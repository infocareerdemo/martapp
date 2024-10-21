import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from './Components/AppProvider';
import Alert from './Components/Alert';
import { MdVerified } from "react-icons/md";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import "../style.css";

const UserInfo = () => {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const tkn = params.get('tkn');

    const { apiServiceCall } = useAppContext();
    const [token] = useState(localStorage.getItem("token"));

    const location = useLocation();
    const navigate = useNavigate();
    const selectedLocation = location?.state?.selectedLocation ?? null;

    const [id, setId] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [name, setName] = useState('')
    const [phoneOtp, setPhoneOtp] = useState('');

    const [showPhoneOtp, setShowPhoneOtp] = useState(false);
    const [phoneOtpSend, setPhoneOtpSend] = useState(false);
    const [phoneOtpVerify, setPhoneOtpVerify] = useState(false);

    const [userAlert, setUserAlert] = useState(false);
    const [forgotPin, setForgotPin] = useState(true);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const [showcontinue, setShowContinue] = useState("")
    const [countdown, setCountdown] = useState(180);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showReEnterPassword, setShowReEnterPassword] = useState(false);


    const [selectedOption, setSelectedOption] = useState('mobile');
    const [isMobileRegistered, setIsMobileRegistered] = useState(false);

    const [useridtophone, setuserIdtoPhone] = useState("")

    const [locationdata, setLocationData] = useState([]);
    const [locationname, setlocationName] = useState("");
    const [officename, setofficeName] = useState("");
    const [locationId, setlocationId] = useState("");

    const [showlocation, setShowlocation] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleReEnterPasswordVisibility = () => {
        setShowReEnterPassword(!showReEnterPassword);
    };

    useEffect(() => {
        GetallLocation();
        localStorage.clear();
        console.log(tkn, "token of location");
    }, [tkn]);


    const GetallLocation = () => {
        const url = `/food/allLocation`;
        apiServiceCall('GET', url, null)
            .then((response) => {
                console.log(response, "location");
                setLocationData(response.data);
                if (tkn) {
                    const selectedLocation = response.data.find(location => location.locationId === parseInt(tkn));
                    if (selectedLocation) {
                        setlocationName(selectedLocation.locationName);
                        setofficeName(selectedLocation.companyName);
                        setlocationId(selectedLocation.locationId);
                    } else {
                        console.log(`Location with ID ${tkn} not found.`);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };


    const isPhoneNumber = (input) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(input);
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
            case 'reenterPassword':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    reenterPassword: ''
                }));
                setReenterPassword(value);
                break;
            case 'name':
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: ''
                }));
                setName(value);
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
    const storeData = (response) => {
        setId(response.userId)
        setName(response.userName)
        setPhone(response.phone)
        setEmail(response.emailId)
        setlocationName(response.location.locationName)
        setofficeName(response.location.companyName)
        setlocationId(response.location.locationId)
        setUserAlert(false)
        setForgotPin(true)
    }
    const hanldePhoneOtpSend = (item) => {
        const url = `/user/otpToPhone`;
        const data = {
            phone: phone,
            id: item.userId,
        };
        apiServiceCall('GET', url, data)
            .then((response) => {
                startCountdown();
                setCountdown(180);
                setShowPhoneOtp(true)
                setPhoneOtpSend(true)
                console.log(response)
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
            })
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

        apiServiceCall('GET', url, data)
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
                setAlertType("error");
                setAlertMsg("Invalid OTP");
                setUserAlert(true);
                console.log(error, "Error in saveUserDetails");
            });
    }

    const handlePhoneExist = (item) => {
        var number = item.target.value
        if (number.length === 10) {
            const url = `/user/phone`;
            const data = {
                phone: number,
            };
            apiServiceCall('GET', url, data)
                .then((response) => {
                    console.log(response)
                    setShowContinue(response.data.phoneVerified)
                    if (response.data != '' && response.data.phoneVerified === true) {
                        storeData(response.data);
                        setIsMobileRegistered(false);
                        setlocationName(selectedLocation.locationName);
                    }
                    else {
                        setIsMobileRegistered(true);
                        hanldePhoneOtpSend(response.data)
                        setForgotPin(false)
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data != '' && tkn !== null && tkn !== undefined && tkn !== "") {
                        setIsMobileRegistered(true);
                        hanldePhoneOtpSend(error.response.data)
                        setForgotPin(false)
                    }
                    else if (error.response && error.response.data != '' && error.response.data.errorCode && error.response.data.errorCode == 1001) {
                        setAlertType("error");
                        setAlertMsg(error.response.data.message);
                        setUserAlert(true)
                        setPhone('')
                    }

                })
        }

    }
    const validate = () => {
        let errors = {};

        if (selectedOption === 'mobile') {
            if (phone === '') {
                errors.phoneNumber = 'Mobile Number is required';
            } else if (!isPhoneNumber(phone)) {
                errors.phoneNumber = 'Please Enter Valid Mobile Number';
            }
            if (showPhoneOtp === true && phoneOtp === '') {
                errors.phoneOtp = 'Mobile OTP is required';
            }
            if (name === '') {
                errors.name = 'Name is required';
            }

            if (password === '') {
                errors.password = 'New PIN is required';
            }
            if (reenterPassword === '') {
                errors.reenterPassword = 'Re-Enter PIN is required';
            }

        }
        if (phone === '') {
            errors.phoneNumber = 'Mobile Number is required';
        } else if (!isPhoneNumber(phone)) {
            errors.phoneNumber = 'Please Enter Valid Mobile Number';
        }
        if (name === '') {
            errors.name = 'Name is required';
        }
        if (locationname === '') {
            errors.locationname = 'location is required';
        }
        if (officename === '') {
            errors.officename = 'Office is required';
        }
        if (password === '') {
            errors.password = 'New PIN is required';
        }
        else if (reenterPassword === '') {
            errors.reenterPassword = 'Please  Enter Re-Enter New PIN';
        }
        else if (password !== reenterPassword) {
            errors.reenterPassword = 'Re-Enter New PIN is not match with New PIN';
        }
        else if (!validatePassword(password)) {
            errors.password = "PIN must contain 4 Digit";
        }

        return errors;
    };

    const validatePassword = (password) => {
        const regex = /^\d{4}$/;
        return regex.test(password);
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

    const handleKeyPress = (e) => {
        const charCode = e.charCode || e.keyCode;
        const char = String.fromCharCode(charCode);
        if (!/[a-zA-Z\s]/.test(char)) {
            e.preventDefault();
        }
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const url = "/user/login";
        let data = {
            "phone": phone,
            "password": password,
        };
        apiServiceCall('POST', url, data)
            .then((response) => {
                console.log(response, "");
                if (response.data != '') {
                    localStorage.setItem("roleId", response.data.role.roleId)
                    localStorage.setItem("userId", response.data.userId)
                    localStorage.setItem("userName", response.data.userName)
                    localStorage.setItem("Mobile", response.data.phone)
                    saveUserPhoneDetails();
                }
            })
            .catch((error) => {
                // setAlertType("info"); // Set alert type to "error"
                // setAlertMsg("Invalid credentials");
                // setUserAlert(true);

                // console.log(error, "Error in saveUserDetails");

            });

    };

    const saveUserPhoneDetails = () => {
        const url = "/user/details";
        const data = {
            "id": id,
            "name": name,
            "phone": parseInt(phone),
            // "emailid": email,
            "address": "Chennai",
            "locationId": locationId,
            "role": {
                "roleId": 2
            },
            "userIp": '',
            "latitude": '',
            "longitude": '',
            "browser": '',
            "password": password
        };

        apiServiceCall('POST', url, data)
            .then((response) => {
                console.log(response, "Response from saveUserDetails");
                if (response.status === 201) {
                    localStorage.setItem("saveduserId", response.data.userId)
                    localStorage.setItem("userId", response.data.userId)
                    localStorage.setItem("userName", response.data.userName)
                    localStorage.setItem("Mobile", response.data.phone)
                    localStorage.setItem("location", response.data.location.locationId)
                    localStorage.setItem("companyname", response.data.location.companyName)
                    localStorage.setItem("roleId", response.data.role.roleId)
                    localStorage.setItem("locationname", response.data.location.locationName)
                    const newFormData = {
                        ...response.data
                    };
                    console.log(newFormData, "kjjjkjk")
                    navigate('/FoodList', { state: { ...newFormData } });
                    // navigate('/FoodList', { state: { ...newFormData, selectedLocation: selectedLocation } });
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
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

    const handleRegister = () => {
        const validationErrors = validate();
        console.log(validationErrors, "hiii")
        if (Object.keys(validationErrors).length === 0) {
            saveUserPhoneDetails()
        } else {
            setErrors(validationErrors);
        }
    };


    return (
        <div>
            <div className="login-container ">
                <div className="login_maincontent" style={{ display: "flex" }}>
                    <h3 style={{ marginBottom: "20px" }}>Welcome! {locationname && <>{locationname} {officename}</>}</h3>
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
                                onBlur={handlePhoneExist}
                            />
                            {phoneOtpVerify === true &&
                                <MdVerified style={{
                                    color: 'green', position: "absolute", right: '3%',
                                    top: '60%',
                                }} className="eye-icon_login" />
                            }
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
                    {isMobileRegistered && (
                        <>
                            <div className='col-12 col-md-4'>
                                <div className="input-group">
                                    <label>Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Name"
                                        maxLength={30}
                                        value={name}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            </div>
                        </>
                    )}

                    <div className='col-12 col-md-4'>
                        <div className='input_container'>
                            <label className='login_label'>{forgotPin ? "PIN" : "New PIN"}  <span className='required' style={{ color: "red" }}>*</span>  </label>
                            <div className='input_contanier'>
                                <div className="input_icons">
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "tel" : "password"}
                                    inputMode="numeric"
                                    className={`input_box ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder={forgotPin ? "PIN" : "New PIN"}
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
                                {forgotPin && (
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2%" }}>
                                        <Link to="/ForgetPassword" style={{ fontSize: "12px", color: "red" }}>Forgot PIN</Link>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {isMobileRegistered && (
                        <>
                            <div className='col-12 col-md-4'>
                                <div className='input_container'>
                                    <label className='login_label'>Re-Enter New PIN  <span className='required' style={{ color: "red" }}>*</span>  </label>
                                    <div className='input_contanier'>
                                        <div className="input_icons">
                                        </div>
                                        <input
                                            id="reenterPassword"
                                            name="reenterPassword"
                                            type={showReEnterPassword ? "text" : "password"} // Corrected here
                                            inputMode="numeric"
                                            className={`input_box ${errors.reenterPassword ? 'is-invalid' : ''}`}
                                            placeholder="Re-Enter New PIN"
                                            maxLength={4}
                                            value={reenterPassword}
                                            onChange={handleChange}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />

                                        {showReEnterPassword ? <AiOutlineEye onClick={() => toggleReEnterPasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => toggleReEnterPasswordVisibility()} className="eye-icon_login" />}
                                        {/* <span style={{ fontSize: '10px' }}>Note (PIN must be numeric with a minimum of 4 digits)</span> */}
                                        {errors.reenterPassword && <div className="invalid-feedback">{errors.reenterPassword}</div>}

                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                    <div className='col-12 col-md-4'>
                        {showcontinue ? (
                            <button type="button" className="sub_button mt-3" onClick={handleLogin}>Continue</button>
                        ) : (
                            <button type="submit" className="sub_button mt-3" onClick={handleRegister}>Submit</button>
                        )}
                    </div>
                </div>
                <Alert
                    title={alertTittle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={() => setUserAlert(false)}
                    onConfirm={() => setUserAlert(false)}
                />
            </div>
        </div>
    );
};

export default UserInfo;