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
import axios from "axios";
import { REACT_APP_BASE_URL } from "../Components/Config";

const AdminLocation = (props) => {
    const { sideBarCollapse } = useSidebar();
    const [roleId] = useState(localStorage.getItem("roleId"));
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [userOrderData, setUserOrderData] = useState([]);
    const [userAllOrderData, setUserAllOrderData] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [userid] = useState(localStorage.getItem("userId"));
    const [orderDate, setOrderDate] = useState([]);
    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [locationId, setLocationId] = useState(""); // State to store the selected locationId

    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null)
    const [alertClose, setAlertClose] = useState(() => null);

    const columns = [
        {
            title: 'Location Name',
            field: 'locationName'
        },
        {
            title: 'Company Name',
            field: 'companyName'
        },
        {
            title: 'Action',
            // field: 'locationName',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => handleActionClick(rowData.
                        locationId
                        )}
                >
                    View
                </button>
            )
        },
        {
            title: 'Download QR',
            field: 'action',
            render: rowData => (
                <button
                    variant="contained"
                    className="viewbtnmenu"
                    color="primary"
                    onClick={() => DownloadReport(rowData.
                        locationId
                        )}
                >
                    Qr
                </button>
            )
        },
    ];
    const baseUrl = REACT_APP_BASE_URL ;
    
    const DownloadReport = (rowId) => {
        const axiosConfig = {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf',
                Authorization: `Bearer ${token}`
            }
        };
        axios.post(`${baseUrl}/location/qrcode?locationId=${rowId}`, null, axiosConfig)
        // axios.post(`http://192.168.3.127:7080/api/v1/order/report?date=${orderDate}&locationId=${locationId}`, null, axiosConfig)
            .then((response) => {
                console.log(response,"report")
                if (!response.data || response.data.size === 0) { // Adjusted check for blob size
                    setAlertType("error");
                    setUserAlert(true);
                    setAlertMsg("PDF file is not available for the date.");
                    setAlertClose(() => () => {
                        setUserAlert(false);
                    });
                    return;
                }
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'QrCode.pdf'); // Changed filename to .pdf
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log('Error fetching PDF file:', error);
            })
            .finally(() => {
                // setLoading(false);
            });
    };
    
    useEffect(() => {
        GetallLocation();
        // GetallOrdersDetails();
    }, []);

    // useEffect(() => {
    //     if (locationId) {
    //         GetallProducts();
    //     }
    // }, [locationId]);
    // useEffect(() => {
    //     console.log("userOrderData updated:", userOrderData);
    // }, [userOrderData]);

    const handleActionClick = (
        locationId
        ) => {
        console.log(
            locationId
            ,"locationId")
        navigate('/AdmupdLocation', { state: { id: locationId} });
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
                // setUserOrderData(response.data);
                if (Array.isArray(response.data)) {
                    setUserOrderData(response.data);
                } else {
                    setUserOrderData([]); // Clear the data if it's not an array
                }
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
        label: item.locationName
    })) : [];

    const GetallLocation = () => {
        const url = `/location/getAllLocation`;
        apiServiceCall('GET', url, null,headers)
            .then((response) => {
                console.log(response.data, "location");
                setLocationData(response.data);

            })
            .catch((error) => {
                console.error("Error fetching locations:", error);
            });
    };
    const addmenu = () => {
        navigate("/AdmAddLocation");
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
                                <h4>Location</h4>
                                <button className="btnmenu" onClick={addmenu}>
                                    Add
                                </button>
                            </div>
                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={locationData}
                                    options={{
                                        search: true,
                                        paging: true,
                                        draggable:false,
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
            </div>
        </div>
    );
};

export default AdminLocation;
