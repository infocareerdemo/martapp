import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useAppContext } from '../Components/AppProvider';
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../Components/Alert";
import { Modal } from "react-bootstrap";
import {
    AiOutlineClose,
    AiOutlineEye,
    AiOutlineEyeInvisible,
} from "react-icons/ai";

import { toast } from "react-toastify";
const UpdateUserByAdmin = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();


    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    // const [Id,setId] = useState("");
    const [empcode, setEmpcode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    // const [wallet, setWalletAmount] = useState('');
    const [wallet, setWallet] = useState('');
    const [name, setName] = useState('');
    const [data, setData] = useState([]);
    const [activeDate, setActiveDate] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [userid] = useState(localStorage.getItem("userId"));

    const [enterOTP, setEnterOTP] = useState("");

    const [otpModalOpen, setOtpModalOpen] = useState(false);

    const location = useLocation();
    const id = location.state.id;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        ViewProducts();
    }, []);
    const closeModal = () => {
        setOtpModalOpen(false);
    };

    // Dummy data
    const validateFields = () => {
        if (name.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("error")
            setAlertMsg("Name is required");
            return false;
        }
        if (!phone || phone.length < 10) {
            setUserAlert(true);
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setAlertType("error");
            setAlertMsg("Mobile Number is required and must be at least 10 digits");
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            setUserAlert(true);
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setAlertType("error");
            setAlertMsg("Email is required");
            return false;
        }
        if (!emailRegex.test(email.trim())) {
            setUserAlert(true);
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setAlertType("error");
            setAlertMsg("Please enter a valid email address");
            return false;
        }
        return true;
    };
    const validateFieldsWallet = () => {
        if (wallet.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("error")
            setAlertMsg("Wallet is required");
            return false;
        }
        return true;
    };
    const handlesubmit = () => {
        if (!validateFields()) {
            return;
        }
        const url = `/companyadmin/updateUser`;
        const data = {
            userId: id,
            employeeCode: empcode,
            userName: name,
            emailId: email,
            phoneNo: phone
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        setUserAlert(false)
                    })
                    setAlertType("success")
                    setAlertMsg("User updated successfully");
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
    };
    const ViewProducts = () => {
        const url = `/companyadmin/getUserDetailsById`;
        const data = {
            userId: id,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "get user details")
                setEmpcode(response.data?.employeeCode || ""); // Use optional chaining and provide a default value
                setName(response.data?.userName || "");
                setEmail(response.data?.emailId || "");
                setPhone(response.data?.phoneNo || "");
                setWallet(response.data?.walletAmount || "")
            })
    }
    const Otpsent = () => {
        if (!validateFieldsWallet()) {
            return;
        }
        const url = `/companyadmin/verifyCmpnyAdminAndSendOtp`;
        const data = { userId: userid };
        apiServiceCall("GET", url, data, headers)
            .then((response) => {
                console.log(response, "Otpsent response");
                if (response.data === "OTP SENT") {
                    toast.success("OTP sented successfully");
                    setOtpModalOpen(true);
                    setEnterOTP(null);
                    setAlertMsg("Wallet updated successfully");
                }
            })
            .catch((error) => { });
    };
    const Otpverify = () => {
        const url = `/companyadmin/verifyOtp`;
        const data = {
            userId: userid,
            reqOtp: enterOTP,
        };
        apiServiceCall("GET", url, data, headers)
            .then((response) => {
                console.log(response, "Otpsent response");
                if (response.data === true) {
                    setOtpModalOpen(false);
                    setEnterOTP("");
                    setUserAlert(true);
                    setAlertType("success");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                        SaveList();
                    });
                    setAlertMsg("OTP verified");
                } else if (response.data === false) {
                    toast.error("Invalid OTP");
                }
            })
            .catch((error) => { });
    };
    const SaveList = () => {
        const url = `/companyadmin/updateWalletToOneUser`;
        const data = {
            userId:id,
            employeeCode: empcode,
            // userName: name,
            emailId: email,
            phoneNo: phone,
            walletAmount: wallet
        };
        apiServiceCall("POST", url, data, headers)
            .then((response) => {
                console.log(response, "SaveList response");
                if (response.status === 200) {
                    setUserAlert(true);
                    setAlertType("success");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });

                    setAlertMsg("Wallet saved successfully");
                }
            })
            .catch((error) => { });
    };
    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>Update User</h4>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: "20px", rowGap: "10px" }}>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Employee Code <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        disabled
                                        className='input_box'
                                        placeholder="Enter Employee Code"
                                        maxLength={20}
                                        value={empcode}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Enter Name"
                                        maxLength={100}
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Mobile Number <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="tel"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Enter Mobile Number"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value)
                                        }}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Email Address <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='input_box'
                                        placeholder="Enter Email Address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Wallet Amount <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="walletamount"
                                        id="walletamount"
                                        name="Wallet Amount"
                                        className='input_box'
                                        placeholder="Enter Wallet Amount"
                                        value={wallet}
                                        onChange={(e) => {
                                            setWallet(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <button className="btnmenu" style={{ marginTop: "40px" }}>
                            Update
                        </button> */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="btnmenu"
                                style={{ marginTop: "40px" }}
                                onClick={handlesubmit}
                            >
                                Update
                            </button>
                            <button
                                className="btnmenu"
                                style={{ marginTop: "40px" }}
                                onClick={Otpsent}
                            >
                                Update Wallet
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btnmenu"
                                style={{ marginTop: "40px" }}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    <Modal
                        dialogClassName="modal-dialog modal-md"
                        centered
                        show={otpModalOpen}
                    >
                        <Modal.Header>
                            <div className="modal_subhead">
                                <span className="modal_head_txt">Verify OTP</span>
                                <AiOutlineClose
                                    className="moda_closel_icon"
                                    onClick={() => closeModal()}
                                />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal_body_container">
                                <div className="col-lg-12 col-md-12">
                                    <div className="input_contanier">
                                        <label className="admaddmenu_label">
                                            OTP{" "}
                                            <span className="required" style={{ color: "red" }}>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="numeric"
                                            id="activeDate"
                                            className="input_box"
                                            value={enterOTP}
                                            maxLength={6}
                                            // onChange={(e) => setEnterOTP(e.target.value)}
                                            onChange={(e) => setEnterOTP(e.target.value)}
                                            onKeyPress={(e) => {
                                              if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="col-lg-6 col-md-12">
                                        <label
                                            className="admaddmenu_label"
                                            style={{ marginBottom: "55px" }}
                                        >
                                            {" "}
                                            <span className="required" style={{ color: "red" }}></span>
                                        </label>
                                        <button
                                            className="input_box"
                                            style={{ backgroundColor: "green", color: "white" }}
                                            onClick={Otpverify}
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
                <Alert
                    title={alertTitle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={alertClose}
                    onConfirm={alertConfirm}
                />
            </div>
        </div>
    );
};

export default UpdateUserByAdmin;