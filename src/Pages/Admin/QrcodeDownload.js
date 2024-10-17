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

const QrcodeDownload = (props) => {
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
            title: 'Mobile Number',
            field: 'userLogin.phone'
        },
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
            GetallOrdersDetails();
            GetallProducts();
        }
    }, [locationId]);
    useEffect(() => {
        console.log("userOrderData updated:", userOrderData);
    }, [userOrderData]);

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
    return (
        <div>
            <Header />
            <Admsidebar />
            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h4>OR Generator</h4>
                            </div>
                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={userOrderData}
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

export default QrcodeDownload;
