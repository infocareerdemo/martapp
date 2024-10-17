import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import './UserForm.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from './Components/AppProvider';
import { getGeolocation } from './Components/getGeolocation';
import { getIpAddress } from './Components/getIpAddress';
import { getBrowserDetails } from './Components/getBrowserDetails';
import Alert from './Components/Alert';
import { useFoodContext } from './Components/FoodContext';
import { MdVerified } from "react-icons/md";
import Header from './Admin/Header';

const UserForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const selectedLocation = location.state.selectedLocation ;
    const selectedLocation = location?.state?.selectedLocation ?? null;

    const [errors, setErrors] = useState({});
    const { apiServiceCall } = useAppContext()

    const [formData, setFormData] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null)
    const [alertClose, setAlertClose] = useState(() => null);

    const [otpShow, setOtpShow] = useState(false)
    const [phoneOtp, setPhoneOtp] = useState('')

    const [otpSend, setOtpSend] = useState(false);
    const [otpVerify, setOtpVerify] = useState(false);

    const [countdown, setCountdown] = useState(180);

    const [browserDetails, setBrowserDetails] = useState([])

    const { foodData } = useFoodContext();

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (!selectedLocation || selectedLocation === "" || selectedLocation === undefined) {
            navigate('/');
        } else {
            console.log('Selected option:', selectedLocation.value);
        }
    }, [selectedLocation]);

    useEffect(() => {
        const data = foodData.filter(food => food.quantity > 0);

        if (data.length === 0) {
            navigate("/userForm");
        }
    }, [foodData, navigate]);

    useEffect(() => {
        if (localStorage.getItem('formData')) {
            var data = localStorage.getItem('formData');
            var parsed = JSON.parse(data)
            setFormData(parsed)
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coords, browser] = await Promise.all([getGeolocation(), getBrowserDetails(),]);
                setBrowserDetails({
                    geolocation: coords,
                    browser: browser
                })
                console.log(coords);
                console.log(browser)
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'phoneNumber') {
            validatePhoneNumber(value);
        } else if (name === 'email') {
            validateEmail(value);
        }
        else {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handlePhoneNumberChange = (e) => {
        const { name, value } = e.target;
        if (/^[0-9\b]*$/.test(value)) {
            setFormData({
                ...formData,
                [name]: value
            });

            validatePhoneNumber(value);
        }
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

    const handlePhoneExist = (e) => {
        const phoneNumber = e.target.value;
        if (phoneNumber.length !== 10) {
            // Do not proceed if the phone number is not exactly 10 digits
            return;
        }
        const url = `/user/phone`;
        const data = { phone: phoneNumber };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response);
                if (response.data && response.data.phoneVerified) {
                    setAlertMsg("The mobile number already exists in our system. Do you want to continue with the details ?");
                    setAlertType("info");
                    setAlertClose(() => () => storeData(response.data));
                    // setAlertClose(() => () => {
                    //     setUserAlert(false);
                    //     setFormData({
                    //         id: '',
                    //         name: '',
                    //         email: '',
                    //         phoneNumber: formData.phoneNumber,
                    //         location: null
                    //     });
                    // });
                    setUserAlert(true);
                } else {
                    phoneOtpSend();
                    setFormData({
                        id: '',
                        name: '',
                        email: '',
                        phoneNumber: formData.phoneNumber,
                        location: null
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const phoneOtpSend = () => {
        const url = `/user/otpToPhone`;
        const data = {
            phone: formData.phoneNumber,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                setOtpShow(true)
                setOtpSend(true)
                setCountdown(180);
                startCountdown();
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleVerifyOtpClick = () => {
        if (phoneOtp.length === 0) {
            setErrors({
                ...errors,
                phoneOtp: 'Phone OTP is required'
            });
            return;
        }
        phoneOtpVerify();
    };
    const phoneOtpVerify = () => {
        const url = `/user/verifyPhone`;
        const data = {
            phone: formData.phoneNumber,
            otp: phoneOtp
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                if (response.data != '') {
                    setOtpVerify(true)
                    setFormData({
                        id: response.data.userId,
                        name: response.data.userName,
                        email: response.data.emailId,
                        phoneNumber: formData.phoneNumber,
                        // location: response.data.address
                    })
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneOtp: ''
                    }));
                }
                else {
                    setOtpVerify(false)
                }
                console.log(response)
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
    }

    const storeData = (response) => {
        setFormData({
            id: response.userId,
            name: response.userName,
            email: response.emailId,
            phoneNumber: response.phone,
            
            // location: {
            //     value: response.address,
            //     label: response.address
            // }
        })
            setErrors({});
        setUserAlert(false)
    }

    const handleLocationChange = (selectedOption) => {
        setFormData({
            ...formData,
            location: selectedOption
        });

        setErrors({
            ...errors,
            location: ''
        });
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phonePattern = /^[0-9]{10}$/;
        if (phoneNumber.length === 0) {
            setErrors({
                ...errors,
                phoneNumber: 'Phone number is required'
            });
        }
        else if (!phonePattern.test(phoneNumber)) {
            setErrors({
                ...errors,
                phoneNumber: 'Phone number must be exactly 10 digits'
            });
        } else {
            setErrors({
                ...errors,
                phoneNumber: ''
            });
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length === 0) {
            setErrors({
                ...errors,
                email: 'Email Id is required'
            });
        }
        else if (!emailPattern.test(email)) {
            setErrors({
                ...errors,
                email: 'Invalid email Id'
            });
        } else {
            setErrors({
                ...errors,
                email: ''
            });
        }
    };

    const validate = () => {
        let errors = {};
        const phonePattern = /^[0-9]{10}$/;
        if (!formData.phoneNumber) {
            errors.phoneNumber = 'Mobile Number is required';
        } else if (!phonePattern.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Mobile Number must be exactly 10 digits';
        }

        if (otpShow === true && phoneOtp.length === 0) {
            errors.phoneOtp = 'Phone OTP is required';
        } else if (otpShow === true && otpVerify === false) {
            errors.phoneOtp = 'Invalid Otp';
        }

        if (!formData.name) {
            errors.name = 'Name is required';
        } 

        if (!formData.email) {
            errors.email = 'Email Id is required';
        } else {
            validateEmail(formData.email);
        }

        // if (!formData.location) {
        //     errors.location = 'Location is required';
        // }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            saveUserDetails()
        } else {
            setErrors(validationErrors);
        }
    };

    const saveUserDetails = () => {
        const url = "/user/details";
        const data = {
            "id": formData.id !== '' ? formData.id : '',
            "name": formData.name,
            "phone": parseInt(formData.phoneNumber),
            "emailid": formData.email,
            "address": "dummydata",
            "locationId": selectedLocation.value,
            "role": {
                "roleId": 2
            },
            "userIp": '',
            "latitude": browserDetails.geolocation.latitude,
            "longitude": browserDetails.geolocation.latitude,
            "browser": browserDetails.browser.browserName
        };

        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "Response from saveUserDetails");
                if (response.status === 201) {
                    const newFormData = {
                        ...response.data
                    };
                    console.log(newFormData, "kjjjkjk")
                    setFormData(newFormData);
                    navigate('/OrderSummary', { state: { ...newFormData, selectedLocation: selectedLocation } });
                    // localStorage.setItem('formData', JSON.stringify(newFormData));
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

    const handleKeyPress = (e) => {
        const charCode = e.charCode || e.keyCode;
        const char = String.fromCharCode(charCode);
    
        // Allow alphabetic characters and spaces
        if (!/[a-zA-Z\s]/.test(char)) {
            e.preventDefault();
        }
    };
    

    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
                backicon={false}
            />
            {/* <Header></Header> */}
            <div className='py-5'>
                <div className="form_container" style={{ padding: "12px" }}>
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="custom-label">Mobile Number <span className='required' style={{ color: "red" }}>*</span></label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    maxLength={10}
                                    className={`custom-input ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                    value={formData.phoneNumber}
                                    onBlur={handlePhoneExist}
                                    onChange={handlePhoneNumberChange}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    readOnly={otpSend === true}
                                />
                                {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                            </div>

                            {otpShow === true &&
                                <div className='input_contanier_Verify form-group'>
                                    <input
                                        type="text"
                                        id="phoneOtp"
                                        name="phoneOtp"
                                        className={`custom-input ${errors.phoneOtp ? 'is-invalid' : ''}`}
                                        placeholder="Enter OTP"
                                        value={phoneOtp}
                                        onChange={(e) => {
                                            if (e.target.value.length > 6) {
                                                e.target.value = e.target.value.slice(0, 6);
                                            }
                                            setPhoneOtp(e.target.value);
                                        }}
                                        readOnly={otpVerify === true}
                                        onKeyPress={(e) => {
                                            const charCode = e.charCode || e.keyCode;
                                            if (charCode < 48 || charCode > 57) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errors.phoneOtp && <div className="invalid-feedback">{errors.phoneOtp}</div>}
                                    {otpVerify === false &&
                                        <button
                                            style={{
                                                position: 'absolute',
                                                right: '4px',
                                                top: '3.5px',
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
                                    {otpVerify === true &&
                                        <MdVerified style={{
                                            color: 'green', position: "absolute", right: '3%',
                                            top: '25%',
                                        }} className="eye-icon_login" />
                                    }
                                    {otpVerify === false &&
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", marginTop: "5px" }}>
                                            {countdown > 0 && (
                                                <div>
                                                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>Time Remaining {countdown} </label>
                                                </div>
                                            )}
                                            <div>
                                                {countdown === 0 ? (
                                                    <span className="link-like"
                                                        onClick={phoneOtpSend}
                                                    > Resend OTP
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    }
                                </div>
                            }

                            <div className="form-group">
                                <label className="custom-label">Name <span className='required' style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`custom-input ${errors.name ? 'is-invalid' : ''}`}
                                    value={formData.name}
                                    maxLength={100}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}

                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label className="custom-label">Email Id <span className='required' style={{ color: "red" }}>*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label className="custom-label">Location <span className='required' style={{ color: "red" }}>*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    readOnly
                                    className={`custom-input`}
                                    value={selectedLocation ? selectedLocation.label : ''}
                                // onChange={handleChange}
                                />
                                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                            </div>

                            <button type="submit" className="sub_button mt-3">Submit</button>
                        </form>
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

export default UserForm;