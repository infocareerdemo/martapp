import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useAppContext } from '../Components/AppProvider';
import { useNavigate, useLocation } from "react-router-dom";
import MaterialTable from '@material-table/core';
import Select from "react-select";
import Alert from "../Components/Alert";
import UploadMultipleUser from "./UploadMultipleUser";

const AddUserByAdmin = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    const [empcode, setEmpcode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const [isMultiUser, setIsMultiUser] = useState(false);


    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        // GetallLocation();
    }, []);

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
        if (empcode.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("error")
            setAlertMsg("Employee Code is required");
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

    const handlesubmit = () => {
        if (!validateFields()) {
            return;
        }
        const url = `/companyadmin/addNewUser`;
        const data = {
            employeeCode: empcode,
            userName: name,
            emailId: email,
            phoneNo: phone,
            role:{
                roleId : 2 
            }
            
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        navigate("/UserList");
                    })
                    setAlertType("success")
                    setAlertMsg("User saved successfully");
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveUserDetails");
            });
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
                                <h4>{isMultiUser ? "Multiple Users" : "Add User"}</h4>
                                <button
                                    className="btnmenu"
                                    onClick={() => setIsMultiUser(!isMultiUser)} // Toggle between modes
                                >
                                    {isMultiUser ? "Add Single User" : "Multi User's"}
                                </button>
                            </div>
                        </div>
                        {!isMultiUser ? (
                            <>
                            <div className='row' style={{ marginTop: "20px", rowGap: "10px" }}>
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
                                        <label className="admaddmenu_label">Employee Code <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className='input_box'
                                            placeholder="Enter Employee Code"
                                            maxLength={20}
                                            value={empcode}
                                            onChange={(e) => {
                                                setEmpcode(e.target.value)
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
                             
                            </div>
                               <button className="btnmenu" style={{ marginTop: "40px" }} onClick={handlesubmit}>
                               Submit
                           </button>
                           </>

                        ) : (
                            <UploadMultipleUser /> // Show the component for multiple users
                        )}
                    </div>
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

export default AddUserByAdmin;