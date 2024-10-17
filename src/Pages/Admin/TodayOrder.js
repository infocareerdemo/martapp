import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import MaterialTable from '@material-table/core';
import Alert from "../Components/Alert";
import Select from "react-select";
import "./Sidebar.css";
import "./Admstyle.css";

const TodayOrder = () => {
    const { sideBarCollapse } = useSidebar();
    const navigate = useNavigate();
    const { apiServiceCall } = useAppContext();
    const [userOrderData, setUserOrderData] = useState([]);
    const [userAllOrderData, setUserAllOrderData] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [locationId, setLocationId] = useState("");
    const [Selectlocation, setSelectlocation] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTittle, setAletTittle] = useState("");
    const [userAlert, setUserAlert] = useState(false);

    const columns = [
        {
            title: 'Order Id',
            field: 'orderId'
        },
        {
            title: 'Customer Name',
            field: 'userDetail.userName'
        },
        {
            title: 'Mobile Number',
            field: 'userDetail.phone'
        },
        {
            title: 'Amount',
            render: rowData => {
                const { cashAmount, razorpayAmount, walletAmount } = rowData;
    
                // Determine the amount display based on the provided logic
                if (cashAmount > 0) {
                    return ` ₹ ${cashAmount}`;
                } else if (razorpayAmount > 0) {
                    return `₹ ${razorpayAmount}`;
                } else {
                    return ` ₹ 0`;
                }
            }
        },
        {
            title: 'Mode of payment ',
            render: rowData => {
                const { cashAmount, razorpayAmount, walletAmount } = rowData;
    
                // Determine the amount display based on the provided logic
                if (cashAmount > 0) {
                    return `COD`;
                } else if (razorpayAmount > 0) {
                    return `Razorpay`;
                } else {
                    return `Wallet`;
                }
            }
        },
        // {
        //     title: 'Shipped',
        //     field: 'shipped',
        //     render: rowData => (
        //         <input
        //             type="checkbox"
        //             checked={rowData.shippedFlag ? rowData.shippedFlag : rowData.shipped}
        //             disabled={rowData.shipped}
        //             onChange={() => handleShippedChange(rowData.orderId, rowData.shippedFlag)}
        //         />
        //     )
        // },
        // {
        //     title: 'Delivered',
        //     field: 'delivered',
        //     render: rowData => (
        //         <input
        //             type="checkbox"
        //             checked={rowData.deliveredFlag ? rowData.deliveredFlag : rowData.delivered}
        //             disabled={rowData.delivered || !rowData.shipped}
        //             onChange={() => handleDeliveredChange(rowData.orderId, rowData.deliveredFlag)}

        //         />

        //     )
        // },
        {
            title: 'Action',
            field: 'action',
            render: rowData => (
                <button
                    className="viewbtnmenu"
                    onClick={() => handleActionClick(rowData.id)}
                >
                    View
                </button>
            )
        },
    ];

    useEffect(() => {
        GetallLocation();
    }, []);

    useEffect(() => {
        if (locationId) {
            GetallOrdersDetails();
            GetallProducts();
        }
    }, [locationId]);

    const handleActionClick = (id) => {
        console.log("********id is :" + id)
        navigate('/OrderBasedOnUser', { state: { id: id } });
    };

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const GetallProducts = (ids) => {
        const url = `/order/today`;
        const data = { locationId: locationId };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response,"today Order")
                if (Array.isArray(response.data)) {
                    console.log(ids)

                    if (ids) {
                        for (let i = 0; i < response.data.length; i++) {
                            if (ids.includes(response.data[i].orderId)) {
                                const index = userOrderData.findIndex((e) => e.orderId == response.data[i].orderId)
                                userOrderData[index] = response.data[i]                            
                            }
                        }
                        console.log(ids)
                    } else {
                        const data = response.data.map((e) => {
                            return { ...e, shippedFlag: e.shipped, deliveredFlag: e.delivered }
                        })
                        setUserOrderData(data);
                    }
                } else {
                    setUserOrderData([]);

                }
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });
    };

    const GetallOrdersDetails = () => {
        const url = `/order/getItemQty`;
        const data = { locationId: locationId };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
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

    const handleShippedChange = (orderId, currentShippedStatus) => {
        const order = userOrderData.find(order => order.orderId === orderId);
        if (order) {
            const updatedStatus = !order.shippedFlag;
            console.log("******** update Status from event:", updatedStatus);
            setUserOrderData(prevData =>
                prevData.map(row =>
                    row.orderId === orderId
                        ? { ...row, shippedFlag: updatedStatus }
                        : row
                )
            );
        } else {
            console.error("Order ID not found:", orderId);
        }
    };


    const handleDeliveredChange = (orderId, currentDeliveredStatus) => {
        const order = userOrderData.find(order => order.orderId === orderId);
        if (order) {
            const updatedStatus = !order.deliveredFlag;
            setUserOrderData(prevData =>
                prevData.map(row =>
                    row.orderId === orderId
                        ? { ...row, deliveredFlag: updatedStatus }
                        : row
                )
            );
        } else {
            console.error("Order ID not found:", orderId);
        }
    };
    const updateShippedStatus = () => {
        const selectedOrders = userOrderData.filter(order => order.shippedFlag && !order.shipped);
        const orderIds = selectedOrders.map(order => order.orderId);
    
        if (orderIds.length === 0) {
            setAlertType("error"); // Set alert type to "error"
            setAlertMsg("No orders selected for update."); // Set the message
            setUserAlert(true); // Show the alert
            return; // Stop further execution
        }
    
        // Prepare the payload with the selected order IDs and shipped status
        const payload = {
            orderIds: orderIds,
            shipped: selectedOrders.some(order => order.shippedFlag),
        };
    
        const url = `/order/updateShippedStatus`;
    
        // Call the API to update the shipped status
        apiServiceCall('POST', url, payload, headers)
            .then((response) => {
                console.log("Update successful:", response.data);
                setAlertType("info"); // Success alert
                setAlertMsg("Shipped Status Updated!!");
                setUserAlert(true);
    
                // Optionally reload the product list or take any other action
                GetallProducts(orderIds);
            })
            .catch((error) => {
                // Handle error
                setAlertType("error"); // Error alert
                setAlertMsg("Failed to update order statuses");
                setUserAlert(true);
                console.error("Error updating order statuses:", error);
            });
    };
    
    

    const updateDeliveredStatus = () => {
        const selectedOrders = userOrderData.filter(order => order.deliveredFlag && !order.delivered);
        const orderIds = selectedOrders.map(order => order.orderId);
        if (orderIds.length === 0) {
            setAlertType("error");
            setAlertMsg("No orders selected for update.");
            setUserAlert(true);
            return;
        }
        const payload = {
            orderIds: orderIds,
            delivered: selectedOrders.some(order => order.deliveredFlag),
        };
        const url = `/order/updateDeliveredStatus`;
        apiServiceCall('POST', url, payload, headers)
            .then((response) => {
                setAlertType("info");
                setAlertMsg("Delivered Status updated!!");
                setUserAlert(true);
                GetallProducts(orderIds);
            })
            .catch((error) => {
                console.error("Error updating order statuses:", error);
                alert("Failed to update order statuses.");
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
                                <h4>Order Details</h4>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className="col-lg-4 col-md-12">
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
                            </div>
                            <div className="Summary_card" style={{ marginBottom: "15px" }}>
                                <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                                    <span>Today Orders</span>
                                </div>
                                {Object.entries(userAllOrderData).map(([item, quantity]) => (
                                    <div key={item}>
                                        <strong>{item} :</strong> {quantity}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <MaterialTable
                                    title=""
                                    columns={columns}
                                    data={userOrderData}
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
                            {userOrderData.length > 0 && (
                             <>
                            {/* <button
                                className="viewbtnmenu"
                                style={{ marginTop: '10px', width: "20%" }}
                                onClick={updateShippedStatus}
                            >
                                Update Shipped {userOrderData.filter((e) => e.shippedFlag == true && e.shipped == false).length > 0 && userOrderData.filter((e) => e.shippedFlag == true && e.shipped == false).length}
                            </button> */}

                            {/* <button
                                className="viewbtnmenu"
                                style={{ marginTop: '10px', marginLeft: '10px', width: "20%" }}
                                onClick={updateDeliveredStatus}
                            >
                                Update Delivered {userOrderData.filter((e) => e.deliveredFlag == true && e.delivered == false).length > 0 && userOrderData.filter((e) => e.deliveredFlag == true && e.delivered == false).length}
                            </button> */}
                            </>
                            )}
                        </div>
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

export default TodayOrder;
