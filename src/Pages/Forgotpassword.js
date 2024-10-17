import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './Components/AppProvider';
import Select from 'react-select'
import Alert from './Components/Alert';
import { MdVerified } from "react-icons/md";
import Header from './Admin/Header';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import "../style.css";

const Forgotpassword = () => {
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [token] = useState(localStorage.getItem("token"));

    const [id, setId] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [name, setName] = useState('')

    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');

    const [showEmailOtp, setShowEmailOtp] = useState(false);
    const [emailOtpSend, setEmailOtpSend] = useState(false);
    const [emailOtpVerify, setEmailOtpVerify] = useState(false);
    const [showEmailAddress, setshowEmailAddress] = useState(false);

    const [showPhoneOtp, setShowPhoneOtp] = useState(false);
    const [phoneOtpSend, setPhoneOtpSend] = useState(false);
    const [phoneOtpVerify, setPhoneOtpVerify] = useState(false);

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null)
    const [alertClose, setAlertClose] = useState(() => null);

    const [countdown, setCountdown] = useState(180);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showcnfPassword, setShowcnfPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglecnfPasswordVisibility = () => {
        setShowcnfPassword(!showcnfPassword);
    };


    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const customStyles = (hasError) => ({
        control: (provided, state) => ({
            ...provided,
            borderColor: hasError ? '#dc3545' : state.isFocused ? '#2684FF' : provided.borderColor,
            '&:hover': {
                borderColor: hasError ? '#dc3545' : state.isFocused ? '#2684FF' : provided.borderColor,
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: provided.color,
        }),
    });


    const isPhoneNumber = (input) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(input);
    };

    const isEmail = (input) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(input);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'Phone':
                if (value.length === 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: 'Please Enter the Mobile Number'
                    }));
                } else if (!isPhoneNumber(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: 'Mobile Number is Invalid'
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: ''
                    }));
                }
                setPhone(value);
                break;
            case 'password':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: ''
                }));
                setPassword(value);
                break;
            case 'confirmpassword':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmpassword: ''
                }));
                setConfirmpassword(value);
                break;
            case 'phoneOtp':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    phoneOtp: ''
                }));
                setPhoneOtp(value);
                break;
            default:
                break;
        }
    };


    const hanldePhoneOtpSend = () => {
        if (phone.length !== 10) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phoneNumber: 'Please enter a valid 10-digit mobile number'
            }));
            return; // Stop further execution if validation fails
        }
        setPhoneOtpSend(true);

        const url = `/user/otpForgotPwd`;
        const data = {
            mobileNo: phone,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                startCountdown();
                setCountdown(15);
                setShowPhoneOtp(true)
                setPhoneOtpSend(true)
                console.log(response)
            })
            .catch((error) => {
                setPhoneOtpSend(false);
                console.log(error, "Error in saveUserDetails");
                const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                setUserAlert(true);
                setAlertClose(() => () => {
                    setUserAlert(false);
                });
                setAlertType("error");
                setAlertMsg(errorMessage);
            });
    }
    const handleVerifyOtpClick = () => {
        if (phoneOtp.length === 0) {
            setErrors({
                ...errors,
                phoneOtp: 'Mobile OTP is required'
            });
            return;
        }
        handlePhoneOtpVerify();
    };
    const handlePhoneOtpVerify = () => {
        const url = `/user/verifyPhone`;
        const data = {
            phone: phone,
            otp: phoneOtp
        };

        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                if (response.data != '') {
                    setPhoneOtpVerify(true)
                    setId(response.data.userId)
                }
                else {
                    setPhoneOtpVerify(false)
                }
                console.log(response)
            })
            .catch((error) => {
                setUserAlert(true);
                setAlertClose(() => () => {
                    setUserAlert(false);
                });
                setAlertType("error");
                setAlertMsg("Invalid OTP");
                // console.log("Inv"+ response.data);

                console.log(error, "Error in saveUserDetails");
            });
    }
    const validate = () => {
        let errors = {};

        if (phone === '') {
            errors.phoneNumber = 'Mobile Number is required';
        } else if (!isPhoneNumber(phone)) {
            errors.phoneNumber = 'Please Enter Vaild Mobile Number';
        }

        if (showPhoneOtp === true && phoneOtp === '') {
            errors.phoneOtp = 'Phone OTP is required';
        }
        if (password === '') {
            errors.password = 'New PIN is required';
        } else if (password.length !== 4) {
            errors.password = 'New PIN must be 4 digits';
        }

        if (confirmpassword === '') {
            errors.confirmpassword = 'Confirm New PIN is required';
        } else if (confirmpassword !== password) {
            errors.confirmpassword = 'New PIN and Confirm New PIN do not match';
        }
        return errors;
    };

    const intervalRef = useRef(null);

    const startCountdown = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                } else {
                    return prevCountdown - 1;
                }
            });
        }, 1000);
    };

    const saveUserDetails = () => {
        const passwordErrors = validate();

        if (Object.keys(passwordErrors).length > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...passwordErrors,
            }));
            return;
        }

        const url = `/user/forgotPassword?id=${id}`;
        const data = {
            newPassword: password,
            confirmPassword: confirmpassword,
        };

        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "Response from saveUserDetails");
                if (response.status === 200) {
                    setUserAlert(true);
                    setAlertClose(() => () => {
                        navigate('/Login');
                    });
                    setAlertType("success");
                    setAlertMsg(
                        <div>PIN Changed Successfully.</div>
                    );
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
                const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                setUserAlert(true);
                setAlertClose(() => () => {
                    setUserAlert(false);
                });
                setAlertType("error");
                setAlertMsg(errorMessage);
            });
    };
    const validatePasswords = () => {
        let errors = {};

        if (password === '') {
            errors.password = 'New PIN is required';
        } else if (password.length !== 4) {
            errors.password = 'New PIN must be 4 digits';
        }

        if (confirmpassword === '') {
            errors.confirmpassword = 'Confirm New PIN is required';
        } else if (confirmpassword !== password) {
            errors.confirmpassword = 'New PIN and Confirm New PIN do not match';
        }

        return errors;
    };


    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            <div className='maincontent_user'>
                <div className="login-container">
                    <div className="login_maincontent" style={{ display: "flex" }}>
                        <h1 style={{ marginBottom: "20px" }}>Forgot PIN</h1>
                        <div className='col-12 col-md-4'>
                            <div className="input_contanier_Verify input-group">
                                <label>Mobile Number <span className='required' style={{ color: "red" }}>*</span></label>
                                <input
                                    type="tel"
                                    id="Phone"
                                    name="Phone"
                                    placeholder="Mobile Number"
                                    className={`${errors.phoneNumber ? 'is-invalid' : ''}`}
                                    maxLength={10}
                                    readOnly={phoneOtpSend === true}
                                    value={phone}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={handleChange}
                                // onBlur={hanldePhoneOtpSend}
                                />
                                {phoneOtpVerify === true &&
                                    <MdVerified style={{
                                        color: 'green', position: "absolute", right: '3%',
                                        top: '60%',
                                    }} className="eye-icon_login" />
                                }
                                <button
                                    style={{
                                        position: 'absolute',
                                        right: '4px',
                                        top: '39px',
                                        height: '34px',
                                        border: 'none',
                                        borderRadius: "5px",
                                        backgroundColor: "#ff5722",
                                        width: "80px",
                                    }}
                                    type='button'
                                    //disabled={phoneOtpVerify === true}
                                    onClick={hanldePhoneOtpSend}
                                    disabled={phoneOtpSend}
                                >
                                    <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sent OTP</span>
                                </button>
                                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                            </div>
                        </div>

                        {showPhoneOtp === true &&
                            <div className='col-12 col-md-4'>
                                <div className="input_contanier_Verify input-group">
                                    <label>Mobile OTP <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="tel"
                                        id="phoneOtp"
                                        name="phoneOtp"
                                        placeholder="Mobile OTP"
                                        className={`${errors.phoneOtp ? 'is-invalid' : ''}`}
                                        maxLength={6}
                                        value={phoneOtp}
                                        readOnly={phoneOtpVerify === true}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={handleChange}
                                    />
                                    {phoneOtpVerify === true &&
                                        <MdVerified style={{
                                            color: 'green', position: "absolute", right: '3%',
                                            top: '60%',
                                        }} className="eye-icon_login" />
                                    }
                                    {errors.phoneOtp && <div className="invalid-feedback">{errors.phoneOtp}</div>}
                                    {phoneOtpVerify === false &&
                                        <button
                                            style={{
                                                position: 'absolute',
                                                right: '4px',
                                                top: '39px',
                                                height: '34px',
                                                border: 'none',
                                                borderRadius: "5px",
                                                backgroundColor: "#3fd713",
                                                width: "80px",
                                            }}
                                            type='button'

                                            onClick={handleVerifyOtpClick}
                                        >
                                            <span style={{ fontSize: '10px', color: "white", fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Verify</span>
                                        </button>
                                    }
                                    {phoneOtpVerify === false &&
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", marginTop: "5px", width: "100%" }}>
                                            {countdown > 0 && (
                                                <div>
                                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown} </label>
                                                </div>
                                            )}
                                            <div>
                                                {countdown === 0 ? (
                                                    <span className="link-like"
                                                        onClick={hanldePhoneOtpSend}
                                                    > Resend OTP
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        {phoneOtpVerify === true &&
                            <>
                                <div className='col-12 col-md-4'>
                                    <div className='input_container'>
                                        <label className='login_label'>New PIN <span className='required' style={{ color: "red" }}>*</span></label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                {/* <RiLockLine /> */}
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "tel" : "password"}
                                                inputMode="numeric"
                                                className={`input_box ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="New PIN"
                                                maxLength={4}
                                                value={password}
                                                onChange={handleChange}
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {showPassword ? <AiOutlineEye onClick={() => togglePasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglePasswordVisibility()} className="eye-icon_login" />}
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-4'>
                                    <div className='input_container'>
                                        <label className='login_label'>Confirm New PIN <span className='required' style={{ color: "red" }}>*</span></label>
                                        <div className='input_contanier'>
                                            <div className="input_icons">
                                                {/* <RiLockLine /> */}
                                            </div>
                                            <input
                                                id="confirmpassword"
                                                name="confirmpassword"
                                                type={showcnfPassword ? "tel" : "password"}
                                                inputMode="numeric"
                                                className={`input_box ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Confirm New PIN"
                                                maxLength={4}
                                                value={confirmpassword}
                                                onChange={handleChange}
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {showcnfPassword ? <AiOutlineEye onClick={() => togglecnfPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglecnfPasswordVisibility()} className="eye-icon_login" />}
                                            {errors.confirmpassword && <div className="invalid-feedback">{errors.confirmpassword}</div>}
                                        </div>
                                    </div>
                                </div>
                                <button className="signin-button" type='button' onClick={saveUserDetails}>Update</button>
                            </>

                        }
                    </div>

                    <Alert
                        title={alertTittle}
                        msg={alertMsg}
                        open={userAlert}
                        type={alertType}
                        onClose={alertClose}
                        onConfirm={alertConfirm}
                    />
                </div>
            </div>
        </div>
    );
};

export default Forgotpassword;