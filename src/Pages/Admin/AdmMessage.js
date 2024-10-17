import React, { useState, useEffect } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Admstyle.css";
import Alert from "../Components/Alert";
import Select from 'react-select'
import { useAppContext } from '../Components/AppProvider';

const AdmMessage = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("Role_id"));
    const navigate = useNavigate();

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAlertTittle] = useState("");
    const [alertClose, setAlertClose] = useState(() => null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    const [Productname, setProductname] = useState("");
    const [Msg, setMsg] = useState("");

    // const location = useLocation();
    // const id = location.state.id;




    const [userId] = useState(localStorage.getItem("userId"));

    const [token] = useState(localStorage.getItem("token"));

    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const { apiServiceCall } = useAppContext()

    useEffect(() => {
        GetallUsers();
    }, []);

    const userOptions = users.map(user => ({
        value: user.userId,
        label: user.userName 
    }));

    const handleUserChange = (selectedOption) => {
        setSelectedUser(selectedOption);
        console.log('Selected userId:', selectedOption.value);
    };

    const GetallUsers = () => {
        const url = `/user/all`;

        apiServiceCall('GET', url, null, headers)
            .then((response) => {
                console.log(response, "get all users");

                //setUsers(response.data);
               
                   // Filter users with roleId: 2
                   const filteredUsers = response.data.filter(user => user.role.roleId === 2);
                     setUsers(filteredUsers);
            })
            .catch((error) => {
                console.log('Error fetching users:', error);
            });
    };

    const sentMsg = () => {
        if (Msg === "") {
            setUserAlert(true);
            setAlertTittle("");
            setAlertMsg("Please Enter the Message");
            setAlertClose(() => () => {
                setUserAlert(false)
            });
            setAlertType("error");
        }
        else {
            const method = 'POST';
            const url = `/ws/message/send?message=` + Msg;
            const data = null;
            apiServiceCall(method, url, data, headers)
                .then((response) => {
                    if (response.status === 200) {
                        setMsg('')
                        setUserAlert(true);
                        setAlertTittle("");
                        setAlertMsg("Message Sent");
                        setAlertClose(() => () => {
                            setUserAlert(false)
                        });
                        setAlertType("info");
                    }
                })
                .catch((error) => {
                    console.log("Error sending password:", error);
                });
        }
    };
    const sentPrivateMsg = () => {
        if (Msg === "") {
            setUserAlert(true);
            setAlertTittle("");
            setAlertMsg("Please Enter the Message");
            setAlertClose(() => () => {
                setUserAlert(false)
            });
            setAlertType("error");
        }
        else {
            const method = 'POST';
            const url = `/ws/message/private?id=` + selectedUser.value + "&message=" + Msg;
            const data = null;
            apiServiceCall(method, url, data, headers)
                .then((response) => {
                    if (response.status === 200) {
                        setMsg('')
                        setUserAlert(true);
                        setAlertTittle("");
                        setAlertMsg("Message Sent");
                        setAlertClose(() => () => {
                            setUserAlert(false)
                        });
                        setAlertType("info");
                    }
                })
                .catch((error) => {
                    console.log("Error sending password:", error);
                });
        }
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
                                <h4>Sent Message</h4>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: "20px", rowGap: "10px" }}>
                            <div className="col-lg-12 col-md-12">
                                <div className='input_contanier'>
                                    <label className="admaddmenu_label">Message <span className='required' style={{ color: "red" }}>*</span></label>
                                    <textarea
                                        type="text"
                                        id="name"
                                        name="name"
                                        className='msginput_box'
                                        placeholder="Message"
                                        maxLength={100}
                                        value={Msg}
                                        onChange={(e) => {
                                            setMsg(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                                <div className="col-lg-4 col-md-12">
                                    <label className="admaddmenu_label">Users <span className='required' style={{ color: "red" }}>*</span></label>
                                    <Select
                                        name="Users"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={userOptions}
                                        onChange={handleUserChange}
                                    />

                                </div>
           
                        </div>
                        <div style={{ display: "flex", gap: "10px",justifyContent:"center" }}>
                            <button type="button" className="msgbtnmenu" style={{ marginTop: "40px" }} onClick={() => sentMsg()}>
                                Sent message
                            </button>
                             {Msg && selectedUser && (
                                <button type="button" className="msgbtnmenu" style={{ marginTop: "40px" }} onClick={() => sentPrivateMsg()}>
                                    Sent Private message
                                </button>
                            )}
                            
                        </div>
                        <Alert
                            title={alertTittle}
                            msg={alertMsg}
                            open={userAlert}
                            type={alertType}
                            onClose={alertClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmMessage;