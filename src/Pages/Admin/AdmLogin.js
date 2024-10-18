import React, { useState } from 'react';
import './AdmLogin.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Components/AppProvider';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import Header from './Header';
import Alert from '../Components/Alert';
import { Link } from 'react-router-dom';
import { RiMailLine, RiLockLine } from 'react-icons/ri';

const Login = () => {
  const navigate = useNavigate();
  const { apiServiceCall } = useAppContext();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTittle, setAletTittle] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => null);
  const [alertClose, setAlertClose] = useState(() => null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPhoneNumber = (input) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(input);
  };

  const isEmail = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(input);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!userName.trim()) {
      errors.userName = "Mobile Number is required";
      isValid = false;
    } else if (!isEmail(userName) && !isPhoneNumber(userName)) {
      errors.userName = "Mobile Number is invalid";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "PIN is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, userName: 'Mobile Number is required' }));
    } else if (!isEmail(value) && !isPhoneNumber(value)) {
      setErrors(prevErrors => ({ ...prevErrors, userName: 'Please enter a valid Mobile Number' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, userName: '' }));
    }
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'PIN is required' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, password: '' }));
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const url = "/user/adminLogin";
      let data = {
        "password": password,
      };

      if (isPhoneNumber(userName)) {
        data["phone"] = userName;
      } else if (isEmail(userName)) {
        data["mailId"] = userName;
      } else {
        alert("Please enter a valid email address or 10-digit Mobile Number.");
        return;
      }

      apiServiceCall('POST', url, data)
        .then((response) => {
          console.log(response, "");
          if (response.data != '') {
            localStorage.setItem("roleId", response.data.role.roleId)
            localStorage.setItem("userId", response.data.userId)
            localStorage.setItem("userName", response.data.userName)
            localStorage.setItem("Mobile", response.data.phone)
            localStorage.setItem("location", JSON.stringify(response.data.location))

            if (response.data.role?.roleId === 1) {
              navigate("/AdmMenu");
            }
            else if (response.data.role?.roleId === 3) {
              navigate("/ImportFile");
            }
            else {
              navigate("/")
            }
          }
        })
        .catch((error) => {
          setAlertType("info"); // Set alert type to "error"
          setAlertMsg("Invalid credentials"); // Set the message
          setUserAlert(true); // Show the alert
          console.log(error, "Error in saveUserDetails");
        });
    }
  };

  const handleEmailChange = (value) => {
    setUserName(value);
    validateEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  return (
    <div>
      <Header
        title="Kannan Catering Service"
        hideLocation={true}
      />
      <form onSubmit={handleLogin}>
        <div className="login-container">
          <div className="login_maincontent" style={{ display: "flex" }}>
            <h1 style={{ marginBottom: "40px" }}>Welcome!</h1>
            <div className='col-12 col-md-4'>
              <div className='input_container'>
                <label className='login_label'>Mobile Number <span className='required' style={{ color: "red" }}>*</span></label>
                <div className='input_contanier'>
                  <input
                    type="tel"
                    id="userName"
                    name="userName"
                    className='input_box'
                    placeholder="Mobile Number"
                    maxLength={10}
                    onChange={(e) =>
                      handleEmailChange(e.target.value)
                    }
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.userName && (
                    <div className="field_form_alert">
                      <span className='signup_alert_container'>{errors.userName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <div className='input_container'>
                <label className='login_label'>PIN <span className='required' style={{ color: "red" }}>*</span></label>
                <div className='input_contanier'>
                  <div className="input_icons">
                    {/* <RiLockLine /> */}
                  </div>
                  <input
                    // type={showPassword ? "number" : "password"}
                    type={showPassword ? "text" : "password"}
                    inputMode="numeric"
                    className='input_box'
                    placeholder="PIN"
                    maxLength={4}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {showPassword ? <AiOutlineEye onClick={() => togglePasswordVisibility()} className="eye-icon_login" /> : <AiOutlineEyeInvisible onClick={() => togglePasswordVisibility()} className="eye-icon_login" />}
                  {errors.password && (
                    <div className="field_form_alert">
                      <span className='signup_alert_container'>{errors.password}</span>
                    </div>
                  )}
                  {/* <div style={{display:"flex",justifyContent:"flex-end",marginTop:"2%"}}>
                    <Link to="/ForgetPassword" style={{fontSize:"12px",color:"red"}}>Forgot PIN</Link>
                  </div> */}
                </div>
              </div>

            </div>

            <button className="signin-button" type="submit" style={{ fontWeight: "bold" }}>Login</button>
          </div>
        </div >
      </form>
      <Alert
        title={alertTittle}
        msg={alertMsg}
        open={userAlert}
        type={alertType}
        onClose={() => setUserAlert(false)}
        onConfirm={() => setUserAlert(false)}
      />
    </div>
  );
};

export default Login;
