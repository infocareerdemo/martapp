import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from "react-select";
// import "../Sidebar.css";
// import "./Admstyle.css";    
import Alert from "../Components/Alert";
import { REACT_APP_BASE_URL } from "../Components/Config";
import * as XLSX from "xlsx"; // Import the xlsx library

const UserList = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();

    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeDate, setActiveDate] = useState("");

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const { apiServiceCall } = useAppContext();
    const [data, setData] = useState([]);
    const baseUrl = REACT_APP_BASE_URL;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        GetAllUser();
    }, []);
    const handleActionClick = (id) => {
        navigate('/UpdateUserByAdmin', { state: { id: id } });
    };
    const columns = [
        {
            title: 'Employee Code',
            field: 'employeeCode'
        },
        {
            title: 'Name',
            field: 'name'
        },
        {
            title: 'Phone',
            field: 'phone'
        },
        {
            title: 'Email',
            field: 'emailId'
        },

        {
            title: 'Status',
            field: 'active',
            render: rowData => (
                <button
                    style={{
                        backgroundColor: rowData.userActive ? 'green' : 'red',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                    }}
                    onClick={() => handlesubmit(rowData.employeeCode, !rowData.userActive)}  // Toggle active status
                >
                    {rowData.userActive ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => handleActionClick(rowData.userId)}
                >
                    View
                </button>
            )
        },
    ];
    const handlesubmit = (employeeCode, newStatus) => {
        const url = "/companyadmin/userActivateAndDeactivate";
        const data = {
            employeeCode: employeeCode,
            userActive: newStatus
        };

        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "Response from saving the item");
                if (response.status === 200) {
                    setAlertType("info");
                    setAlertMsg(newStatus ? "Activated" : "Deactivated");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    setUserAlert(true);
                    // Update the local data after successful status update
                    setData(prevData => prevData.map(user =>
                        user.employeeCode === employeeCode ? { ...user, userActive: newStatus } : user
                    ));
                }
            })
            .catch((error) => {
                console.log(error, "Error in saveItemDetails");
            });
    };
    const GetAllUser = () => {
        const url = `/companyadmin/getAllUserList`;
        const data = {};
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "getallUsers")
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    };
    const adduser = () => {
        navigate("/AddUserByAdmin");
    }

    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>User's</h4>
                                <button className="btnmenu" onClick={adduser}>
                                    Add
                                </button>
                            </div>
                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={data} // Use the imported data here
                                    options={{
                                        search: true,
                                        paging: true,
                                        draggable: false,
                                        pageSize: 5,
                                        pageSizeOptions: [5, 10, 20],
                                        headerStyle: {
                                            backgroundColor: '#EEE',
                                            fontWeight: 'bold'
                                        },
                                        rowStyle: {
                                            backgroundColor: '#FFF',
                                        },
                                        emptyRowsWhenPaging: false,
                                    }}
                                />
                            </div>
                        </div>
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

export default UserList;


