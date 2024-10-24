import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useAppContext } from '../Components/AppProvider';
import { useNavigate, useLocation } from "react-router-dom";  
import Alert from "../Components/Alert";

const UpdateUserByAdmin = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();


    const [formErrors, setFormErrors] = useState({});
    const [token] = useState(localStorage.getItem("token"));

    const [empcode, setEmpcode] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    // const [wallet, setWalletAmount] = useState('');
    const [wallet, setWallet] = useState('');
    const [name, setName] = useState('');

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const location = useLocation();
    const id = location.state.id;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        ViewProducts();
    }, []);

    // Dummy data
    const validateFields = () => {
        if (name.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Name is required");
            return false;
        }
        if (empcode.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Empcode is required");
            return false;
        }
        if (phone.trim() === "") {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false)
            })
            setAlertType("info")
            setAlertMsg("Mobile Number is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            setUserAlert(true);
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setAlertType("info");
            setAlertMsg("Email is required");
            return false;
        }
        if (!emailRegex.test(email.trim())) {
            setUserAlert(true);
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setAlertType("info");
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
            name: name,
            emailId: email,
            phoneNo : phone
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "");
                if (response.status === 200) {
                    setUserAlert(true)
                    setAlertClose(() => () => {
                        navigate("/AdmMenu");
                    })
                    setAlertType("success")
                    setAlertMsg("Product saved successfully");
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
                console.log(response,"get user details")
                setEmpcode(response.data?.employeeCode || ""); // Use optional chaining and provide a default value
                setName(response.data?.userName || "");
                setEmail(response.data?.emailId || "");
                setPhone(response.data?.phoneNo || "");
                
            })
    }
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
                                    <label className="admaddmenu_label">Name <span className='required' style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        disabled
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
                                        disabled
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
                                        disabled
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
                                        disabled
                                        className='input_box'
                                        placeholder="Enter Email Address"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-lg-4 col-md-12">
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
                            </div> */}
                        </div>
                        <button className="btnmenu" style={{ marginTop: "40px" }}>
                            Update
                        </button>
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

export default UpdateUserByAdmin;