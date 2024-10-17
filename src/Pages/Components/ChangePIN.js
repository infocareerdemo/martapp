import React, { useEffect, useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { RiLockLine } from 'react-icons/ri';
import { useAppContext } from './AppProvider';
import { Link, useNavigate } from 'react-router-dom';
// import { gp_logo } from '../components/imageUrl';
import { toast } from 'react-toastify';
import Header from '../Admin/Header';
import { Phone } from '@mui/icons-material';
import Alert from './Alert';

const ChangePIN = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [userid] = useState(localStorage.getItem("userId"));
    const [token] = useState(localStorage.getItem("token"));
    const userName = localStorage.getItem("userName");
    const phone = localStorage.getItem("Mobile");
    const [formErrors, setFormErrors] = useState({});

    const { apiServiceCall } = useAppContext();


    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null)
    const [alertClose, setAlertClose] = useState(() => null);

    const navigate = useNavigate();
    const { PostApi } = useAppContext();

    const togglePasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };

    const validatePassword = (password) => {
        const regex = /^\d{4}$/; // Allow only a 4-digit PIN
        return regex.test(password);
    };
    

    const focusOutValidation = async (e, label) => {
        if (label === "currentPassword") {
            if (currentPassword === "") {
                setFormErrors((e) => {
                    return { ...e, currentPassword: "Please Enter the Old PIN" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, currentPassword: "" }
                })
            }
        }
        else if (label === "newPassword") {
            if (newPassword === "") {
                setFormErrors((e) => {
                    return { ...e, newPassword: "Please Enter New PIN" }
                })
            }

            else {
                setFormErrors((e) => {
                    return { ...e, newPassword: "" }
                })
            }
        }
        else if (label === "confirmNewPassword") {
            if (confirmNewPassword === "") {
                setFormErrors((e) => {
                    return { ...e, confirmNewPassword: "Please Enter New PIN" }
                })
            }
            else {
                setFormErrors((e) => {
                    return { ...e, confirmNewPassword: "" }
                })
            }
        }
    }

    const onChangeValidation = (e, label) => {
        const value = e.target.value;
        const errors = { ...formErrors };
        if (label === "currentPassword") {
            if (value === "") {
                errors.currentPassword = "Please Enter the Old PIN";
            } else {
                errors.currentPassword = "";
            }
        }
        if (label === "newPassword") {
            if (value === "") {
                errors.newPassword = "Please Enter the New PIN";
            }
            else if (currentPassword === newPassword) {
                errors.newPassword = "Old PIN and New PIN cannot be same";
            }
            else if (!validatePassword(value)) {
                errors.newPassword = "PIN must contain 4 Digit";
            }
            else {
                errors.newPassword = "";
            }
            if (confirmNewPassword !== "" && confirmNewPassword !== value) {
                errors.confirmNewPassword = "PIN not match with New PIN";
            } else if (confirmNewPassword === value) {
                errors.confirmNewPassword = "";
            }
        }
        if (label === "confirmNewPassword") {
            if (value === "") {
                errors.confirmNewPassword = "Please Enter the Re-Enter New PIN";
            } else if (value !== newPassword) {
                errors.confirmNewPassword = "Re-Enter New PIN not match with New PIN";
            } else {
                errors.confirmNewPassword = "";
            }
        }
        setFormErrors(errors);
    };
    const Logout = () => {
        navigate("/");
        localStorage.clear();
        window.location.reload();
    };
    const handleChangePassword = (event) => {
        event.preventDefault();
        const errors = {};
        if (currentPassword === "") {
            errors.currentPassword = "Please Enter the Old PIN"
        }
        if (newPassword === "") {
            errors.newPassword = "Please Enter the New PIN";
        }
        else if (currentPassword === newPassword) {
            errors.newPassword = "Old PIN and New PIN cannot be same";
        }
        else if (!validatePassword(newPassword)) {
            errors.newPassword = "PIN must contain 4 Digit";
        }
        if (confirmNewPassword === "") {
            errors.confirmNewPassword = "Please Enter the Re-Enter New PIN"
        }
        else if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = "Re-Enter  New PIN not match with New PIN";
        }
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            const url = `/user/changePassword?id=${userid}`;
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmNewPassword,
            };
            apiServiceCall('POST', url, data, headers)
                .then((response) => {
                    console.log(response, "changePassword response")
                    if (response.status === 200) {
                        // toast.success('Password Changed Successfully');
                        setUserAlert(true)
                        setAlertClose(() => () => {
                            Logout();
                        })
                        setAlertType("success")
                        setAlertMsg('PIN Changed Successfully Please Login with New PIN');
                        setAlertType("info");

                    } else if (response.data.status === 409) {
                        toast.error(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error, "Error in saveUserDetails");
                    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    })
                    setAlertType("error")
                    setAlertMsg(errorMessage);
                });
        }

    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            <form onSubmit={handleChangePassword}>
                <div className="login-container">
                    <div className='login_maincontent'>

                        <h2 className="welcome_text" style={{ marginBottom: "10px" }}>Change PIN</h2>

                    

                     
                        <div className='col-12 col-md-4'>
                            <label className='login_label'>Old PIN <span className="required_star">*</span> </label>
                            <div className='input_contanier'>
                                <input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "tel" : "password"}
                                            inputMode="numeric"
                                    className='input_box'
                                    placeholder="Old PIN"
                                    maxLength={4}
                                    onChange={(e) => {
                                        handleCurrentPasswordChange(e);
                                        onChangeValidation(e, 'currentPassword');
                                    }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => focusOutValidation("currentPassword")}
                                // onCopy={(e) => e.preventDefault()}
                                />
                                {showCurrentPassword ? <AiOutlineEye onClick={() => togglePasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglePasswordVisibility()} className="eye-icon_login" />}

                                {formErrors.currentPassword && <div className="field_form_alert">
                                    <span>{formErrors.currentPassword}</span>
                                </div>}
                            </div>
                        </div>
                        <div className='col-12 col-md-4'>
                            <label className='login_label'>New PIN <span className="required_star">*</span> </label>
                            <div className='input_contanier'>
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                            inputMode="numeric"
                                    className='input_box'
                                    placeholder="New PIN"
                                    maxLength={4}
                                    onChange={(e) => {
                                        handleNewPasswordChange(e);
                                        onChangeValidation(e, 'newPassword');
                                    }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => focusOutValidation("newPassword")}
                                // onCopy={(e) => e.preventDefault()}
                                // onPaste={(e) => e.preventDefault()}
                                />

                                {showNewPassword ? <AiOutlineEye onClick={() => toggleNewPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => toggleNewPasswordVisibility()} className="eye-icon_login" />}
                                {formErrors.newPassword && <div className="field_form_alert">
                                    <span>{formErrors.newPassword}</span>
                                </div>}
                            </div>
                        </div>
                        <div className='col-12 col-md-4'>
                            <label className='login_label'>Re-Enter New PIN <span className="required_star">*</span> </label>
                            <div className='input_contanier'>
                                <input
                                    id="confirmNewPassword"
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    inputMode="numeric"
                                    className='input_box'
                                    maxLength={4}
                                    placeholder="Re-Enter New PIN"
                                    onChange={(e) => {
                                        handleConfirmNewPasswordChange(e);
                                        onChangeValidation(e, 'confirmNewPassword');
                                    }}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => focusOutValidation("confirmNewPassword")}
                                // onCopy={(e) => e.preventDefault()}
                                // onPaste={(e) => e.preventDefault()}
                                />
                                {showConfirmNewPassword ? <AiOutlineEye onClick={() => toggleConfirmNewPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => toggleConfirmNewPasswordVisibility()} className="eye-icon_login" />}
                                {formErrors.confirmNewPassword && <div className="field_form_alert">
                                    <span>{formErrors.confirmNewPassword}</span>
                                </div>}
                            </div>
                        </div>
                        <button className="signin-button" type="submit">Update</button>
                    </div>
                </div>
            </form>
            <Alert
                title={alertTittle}
                msg={alertMsg}
                open={userAlert}
                type={alertType}
                onClose={alertClose}
                onConfirm={alertConfirm}
            />
        </div>
    )
}

export default ChangePIN;