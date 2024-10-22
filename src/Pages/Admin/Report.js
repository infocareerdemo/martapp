import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import Select from "react-select";
import "./Sidebar.css";
import "./Admstyle.css";
import { Download } from "@mui/icons-material";
import axios from "axios";
import Alert from "../Components/Alert";
import { REACT_APP_BASE_URL } from "../Components/Config";

const Report = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [userOrderData, setUserOrderData] = useState([]);
    const [userAllOrderData, setUserAllOrderData] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [orderDate, setOrderDate] = useState("");
    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [locationId, setLocationId] = useState(""); // State to store the selected locationId

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const addmenu = () => {
        navigate("/AdmaddMenu");
    }
    const baseUrl = REACT_APP_BASE_URL ;
    const columns = [
        {
            title: 'Order Id',
            field: 'orderId'
        },

        {
            title: 'Customer Name',
            field: 'userLogin.userName'
        },
        {
            title: 'Email Address',
            field: 'userLogin.emailId'
        },
        {
            title: 'Mobile Number',
            field: 'userLogin.phone'
        },

        // {
        //     title: 'Status',
        //     field: 'productActive',
        //     render: rowData => (
        //         <span style={{ color: rowData.productActive ? 'green' : 'orange' }}>
        //             {rowData.kycVerified ? 'InActive' : 'Active'}
        //         </span>
        //     )
        // },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => handleActionClick(rowData.id)}
                >
                    View
                </button>
            )
        },
    ];

    useEffect(() => {
        GetallLocation(); // Fetch all locations on component mount
    }, []);

    useEffect(() => {
        if (locationId) {
            GetallProducts();
            GetallOrdersDetails();// Fetch products when locationId changes
        }
    }, [locationId]);

    const handleActionClick = (id) => {
        navigate('/OrderBasedOnUser', { state: { id: id } });
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const GetallProducts = () => {
        const url = `/order/today`;
        const data = {
            locationId: locationId,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "Order user Today");
                setUserOrderData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    };
    const GetallOrdersDetails = () => {
        const url = `/order/getItemQty`;
        const data = {
            locationId: locationId,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "Order all Orders Today");
                setUserAllOrderData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    };

    const handleLocationChange = (selectedOption) => {
        setSelectlocation(selectedOption);
        setLocationId(selectedOption.value);
    };

    const LocationOptions = Array.isArray(locationData) ? locationData.map(item => ({
        value: item.locationId,
        label: `${item.locationName} (${item.companyName})` 
        })) : [];


    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response.data, "location");
                setLocationData(response.data);
                if (response.data.length > 0) {
                    const defaultLocation = response.data[0];
                    setSelectlocation({ value: defaultLocation.locationId, label: defaultLocation.locationName });
                    setLocationId(defaultLocation.locationId);
                }
            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };

    // const DownloadReport = () => {
    //     const url = `/order/report`;
    //     const data = {
    //         date: orderDate,
    //         locationId: locationId
    //     };
    
    //     apiServiceCall('POST', url, data, headers)
    //         .then((response) => {
    //             // Check if response.data is valid
    //             if (!response.data || response.data.byteLength === 0) {
    //                 console.error("Empty response received.");
    //                 return;
    //             }
    
    //             try {
    //                 let blob;
    //                 const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    //                 // Check if response.data is an ArrayBuffer or a base64 string
    //                 if (response.data instanceof ArrayBuffer) {
    //                     // If response.data is ArrayBuffer, create Blob directly
    //                     blob = new Blob([response.data], { type: mimeType });
    //                 } else if (typeof response.data === 'string' && response.data.startsWith('data:')) {
    //                     // If response.data is a base64 string, convert it to Blob
    //                     const base64Data = response.data.split(',')[1];
    //                     blob = base64ToBlob(base64Data, mimeType);
    //                 } else {
    //                     throw new Error("Unexpected response data format.");
    //                 }
    
    //                 // Log the Blob to inspect it
    //                 console.log(blob);
    
    //                 // Create a link element
    //                 const link = document.createElement('a');
    //                 link.href = window.URL.createObjectURL(blob);
    //                 link.download = 'report.xlsx';
    
    //                 // Append link to body
    //                 document.body.appendChild(link);
    
    //                 // Programmatically click the link to trigger the download
    //                 link.click();
    
    //                 // Clean up and remove the link
    //                 document.body.removeChild(link);
    //                 window.URL.revokeObjectURL(link.href);
    //             } catch (error) {
    //                 console.error("Error creating Blob or triggering download:", error);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Download failed:", error);
    //         });
    // };
    
    // Helper function to convert base64 to Blob
    const base64ToBlob = (base64, mimeType) => {
        const sliceSize = 1024;
        const byteCharacters = atob(base64);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        return new Blob(byteArrays, { type: mimeType });
    };

    const DownloadReport = (rowId) => {
        // setLoading(true);
        if (!orderDate) { // Check if orderDate is empty
            setAlertType("error");
            setAlertMsg("Please Choose Date");
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setUserAlert(true);
            return;
        }
        const axiosConfig = {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/order/report?date=${orderDate}&locationId=${locationId}`, null, axiosConfig)
            .then((response) => {
                console.log(response,"report")
                if (!response.data || response.data.size === 0) { // Adjusted check for blob size
                    setAlertType("error");
                    setUserAlert(true);
                    setAlertMsg("Excel file is not available for the date.");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    return;
                }
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Orderdetails_Report.xlsx'); // Changed filename to .xlsx
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching Excel file:', error);
            })
            .finally(() => {
                // setLoading(false);
            });
    };

    
    
    const DownloadTotalOrder = (rowId) => {
        // setLoading(true);
        if (!orderDate) { // Check if orderDate is empty
            setAlertType("error");
            setAlertMsg("Please Choose Date");
            setAlertClose(() => () => {
                setUserAlert(false);
            });
            setUserAlert(true);
            return;
        }
        const axiosConfig = {
            responseType: 'blob',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/order/getTotalQuantityOrderDetailsExcel?date=${orderDate}&locationId=${locationId}`, null, axiosConfig)
            .then((response) => {
                console.log(response,"report")
                if (!response.data || response.data.size === 0) { // Adjusted check for blob size
                    setAlertType("error");
                    setUserAlert(true);
                    setAlertMsg("Excel file is not available for the date.");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    return;
                }
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'TotalCount_Report.xlsx'); // Changed filename to .xlsx
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching Excel file:', error);
            })
            .finally(() => {
                // setLoading(false);
            });
    };

    
    const handleOrderDateChange = (event) => {
        const inputDate = event.target.value;
        const year = inputDate.split('-')[0];
        if (year.length > 4) {
          return; 
        }
      
        setOrderDate(inputDate);
    };
    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>Report</h4>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Location <span className='required' style={{ color: "red" }}>*</span></label>
                                        <Select
                                            name="Users"
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            isDisabled
                                            options={LocationOptions}
                                            value={LocationOptions.find(option => option.value === Selectlocation?.value)}
                                            onChange={handleLocationChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label">Date <span className='required' style={{ color: "red" }}>*</span></label>
                                        <input
    type="date"
    id="name"
    name="name"
    className='input_box'
    value={orderDate}
    onChange={handleOrderDateChange}
    max={new Date().toISOString().split("T")[0]} // Sets max to today's date
/>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label" style={{marginBottom:"55px"}}> <span className='required' style={{ color: "red" }} ></span></label>
                                    
                                        <button className='input_box' style={{backgroundColor:"green",color:"white"}} onClick={DownloadReport}>Download Users Wise</button>

                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12">
                                    <div className='input_contanier'>
                                        <label className="admaddmenu_label" style={{marginBottom:"55px"}}> <span className='required' style={{ color: "red" }} ></span></label>
                                       
                                        <button className='input_box' style={{backgroundColor:"green",color:"white"}} onClick={DownloadTotalOrder}>Download Total Orders</button>

                                    </div>
                                </div>
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

export default Report;
