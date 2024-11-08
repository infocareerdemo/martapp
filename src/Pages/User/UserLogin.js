import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../Components/AppProvider";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Alert from "../Components/Alert";
import "../../style.css";

const UserLogin = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const tkn = params.get("tkn");

    const { apiServiceCall } = useAppContext();
    const [token] = useState(localStorage.getItem("token"));

    const location = useLocation();
    const navigate = useNavigate();
    const selectedLocation = location?.state?.selectedLocation ?? null;

    const [phone, setPhone] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [phoneOtpVerify, setPhoneOtpVerify] = useState(false);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");

    const [empCode, setEmpCode] = useState("");
    const [otpflag, setOtpflag] = useState(false);
    const [employeeOtp, setEmployeeOtp] = useState("");
    const [countdown, setCountdown] = useState(180);
    const [errors, setErrors] = useState({});

    const [otpModalOpen, setOtpModalOpen] = useState(false);

    useEffect(() => {
        // localStorage.clear();
        if (token) {
            navigate("/FoodList");
        }
        console.log(tkn, "token of location");
    }, []);

    const intervalRef = useRef(null);

    const validateForm = (requireOtp = false) => {
        const newErrors = {};
        if (!empCode) {
            newErrors.empCode = "Employee Code is required";
        }
        if (requireOtp && otpflag && !phoneOtp) {
            newErrors.phoneOtp = "Mobile OTP is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerateOtp = (event) => {
        event.preventDefault();
        if (!validateForm(false)) {
            // Do not validate OTP
            return;
        }
        const url = "/user/verifyEmployeeCodeAndGenerateOtp";
        let data = {
            employeeCode: empCode,
        };
        apiServiceCall("POST", url, data)
            .then((response) => {
                console.log(response, "GenerateOTP");
                if (response.data === true) {
                    setOtpflag(true);
                }
            })
            .catch((error) => { });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        if (!validateForm(true)) {
            // Validate OTP
            return;
        }
        const url = "/user/login";
        let data = {
            employeeCode: empCode,
            phoneOTP: phoneOtp,
        };
        apiServiceCall("POST", url, data)
            .then((response) => {
                console.log(response, "GenerateOTP");
                if (response.data != "") {
                    localStorage.setItem("roleId", response.data.role.roleId);
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("location", response.data.location.locationId);
                    localStorage.setItem("userName", response.data.employeeCode);
                    navigate("/FoodList");
                }
            })
            .catch((error) => { });
    };

    return (
        <div>
            <div className="login-container">
                <div className="login_maincontent" style={{ display: "flex" }}>
                    <h3 style={{ marginBottom: "20px" }}>Welcome !</h3>

                    {/* Employee Code Input */}
                    <div className="col-12 col-md-4">
                        <div className="input_contanier_Verify input-group">
                            <label>
                                Employee Code{" "}
                                <span className="required" style={{ color: "red" }}>
                                    *
                                </span>
                            </label>
                            <input
                                type="text"
                                id="empCode"
                                name="empCode"
                                value={empCode}
                                placeholder="Employee Code"
                                onChange={(e) => {
                                    setEmpCode(e.target.value);
                                    setErrors((prevErrors) => ({ ...prevErrors, empCode: "" })); // Clear error on change
                                }}
                            />
                            {/* Display Error Message for Employee Code */}
                            {errors.empCode && (
                                <p className="invalid-feedback">{errors.empCode}</p>
                            )}
                        </div>
                    </div>

                    {/* OTP Input - Conditionally Rendered */}
                    {otpflag && (
                        <div className="col-12 col-md-4">
                            <div className="input_contanier_Verify input-group">
                                <label>
                                    Mobile OTP{" "}
                                    <span className="required" style={{ color: "red" }}>
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="phoneOtp"
                                    name="phoneOtp"
                                    placeholder="Mobile OTP"
                                    maxLength={6}
                                    value={phoneOtp}
                                    inputMode="numeric" // Prompts the numeric keyboard on mobile
                                    onChange={(e) => {
                                        setPhoneOtp(e.target.value);
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            phoneOtp: "",
                                        }));
                                    }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />


                                {/* Display Error Message for OTP */}
                                {errors.phoneOtp && (
                                    <p className="invalid-feedback">{errors.phoneOtp}</p>
                                )}
                            </div>
                            <div
                                style={{ display: "flex", justifyContent: "flex-end" }}
                                onClick={handleGenerateOtp}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: "#ff5722",
                                        cursor: "pointer",
                                    }}
                                >
                                    Resent OTP
                                </span>
                            </div>
                        </div>
                    )}
                    <div onClick={() => setOtpModalOpen(true)}>
                        <span
                            style={{
                                fontSize: "12px",
                                color: "#ff5722",
                                cursor: "pointer",
                            }}
                        >
                            Terms & Condition
                        </span>
                    </div>
                    {/* Submit / Login Button */}
                    <div className="col-12 col-md-4">
                        {!otpflag ? (
                            <button
                                type="button"
                                className="sub_button mt-3"
                                onClick={handleGenerateOtp}
                            >
                                Request OTP
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="sub_button mt-3"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>

                {/* Alert Component */}
                <Alert
                    title={alertTittle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={() => setUserAlert(false)}
                    onConfirm={() => setUserAlert(false)}
                />
            </div>
            <Modal
                dialogClassName="modal-dialog modal-lg"
                centered
                show={otpModalOpen}
            >
                <Modal.Header>
                    <div className="modal_subhead xl">
                        <span className="modal_head_txt">Teams and Condition</span>
                        <AiOutlineClose onClick={() => setOtpModalOpen(false)}
                            className="moda_closel_icon"
                        />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal_body_container">
                        <div>mani</div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserLogin;
