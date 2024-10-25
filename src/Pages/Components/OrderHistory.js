import React, { useEffect, useState } from "react";
import Header from "../Admin/Header";
import Admsidebar from "../Admin/Admsidebar";
import { useSidebar } from "../Admin/SidebarContext";
import { useLocation } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
// import "./Sidebar.css";
import "../Admin/Admstyle.css";

const OrderHistory = () => {
    const { sideBarCollapse } = useSidebar();
    const [orderData, setOrderData] = useState([]);
    const [orderDetails, setOrderDetails] = useState('');

    const location = useLocation();
    const id = location.state.id;
    const [token] = useState(localStorage.getItem("token"));
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const { apiServiceCall } = useAppContext();

    useEffect(() => {
        ViewUsers();
    }, []);

    const ViewUsers = () => {
        const url = `/order/id`;
        const data = {
            id: id,
        };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "User Details");
                setOrderData(response.data?.orderDetails || []);
                setOrderDetails(response.data.orders);
            });
    };


    
    // const formatTimestampToDate = (timestamp) => {
    //     const date = new Date(timestamp);
    //     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //     const dayOfWeek = days[date.getDay()];
    //     const month = months[date.getMonth()];
    //     const dayOfMonth = date.getDate();
    //     const year = date.getFullYear();

    //     const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
    //     return formattedDate;
    // };


    const formatTimestampToDate = (timestamp) => {
        const date = new Date(timestamp);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayOfWeek = days[date.getDay()];
        const month = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();
        
        // Add time formatting
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures minutes are always two digits
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Converts 24-hour time to 12-hour time
    
        const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year} ${formattedHours}:${minutes} ${ampm}`;
        return formattedDate;
    };
    
    const base64ToImageUrl = (base64String) => {
        return `data:image/jpeg;base64,${base64String}`;
    };

    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            <div className='maincontent_user'>
                <div className="order-summary">
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px" }}>
                        <h4 style={{ color: "#ff5722", fontWeight: "bold" }}>Order Summary</h4>
                    </div>
                    <div className="payment-status">
                        {orderDetails.paymentStatus === 'PAY_FAILED' || orderDetails.paymentStatus === 'PAY_PENDING' ? (
                            <p style={{ color: 'red', fontWeight: 'bold' }}>Your payment could not be processed</p>
                        ) : null}

                    </div>
                    <div>
            <ul className="list-group list-group-flush">
                <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Your Order</h5>
                {orderData.map((order, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ marginBottom: '10px' }}
                    >
                        <div className="d-flex flex-column">
                            <img
                                src={base64ToImageUrl(order.products.productImage) || "https://via.placeholder.com/150"}
                                alt={order.products.productName}
                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }}
                            />
                            <span>{order.products.productName}</span>
                        </div>

                        <p>
                            <span style={{
                                border: '1px solid green',
                                backgroundColor: '#EAFFCA',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                marginRight: '5px'
                            }}>
                                {order.quantity}
                            </span> 
                            x ₹ {order.products.productPrice}
                        </p>
                    </li>
                ))}
            </ul>
        </div>

                    <div>
                        <ul className="list-group list-group-flush">
                            {/* <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Item total :
                                <span>₹ {orderDetails.orderAmount}</span>
                            </li> */}
                            {/* <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Taxes :
                                <span > {orderDetails.gst} %</span>
                            </li> */}
                             <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                             </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Grand Total :
                                <span> ₹ {orderDetails.totalAmount}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                            </li>
                            {orderDetails?.walletAmount > 0 && (
                                <>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        Wallet :
                                        <span> ₹ - {orderDetails?.walletAmount || 0}</span>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        Amount :
                                        <span>
                                            {orderDetails?.razorpayAmount > 0 && (
                                                <span> ₹ {orderDetails?.razorpayAmount}</span>
                                            )}
                                            {orderDetails?.cashAmount > 0 && (
                                                <span> ₹ {orderDetails?.cashAmount} </span>
                                            )}
                                            {/* Fallback in case both are zero */}
                                            {orderDetails?.razorpayAmount === 0 && orderDetails?.cashAmount === 0 && (
                                                <span> ₹ 0 </span>
                                            )}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    {/* <div>
                        <h5 className="card-title" style={{ fontWeight: "bold",color: "#ff5722" }}>Customer Information</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Name
                                <span>{orderDetails.userDetails?.userName ?? ""}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Mobile Number
                                <span>{orderDetails.userDetails?.phone ?? ""}</span>
                            </li>
                        </ul>
                    </div> */}

                    <div>
                        <h5 className="card-title" style={{ fontWeight: "bold",color: "#ff5722" }}>Payment Information</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Order ID:
                                <span>{orderDetails.orderId}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Payment Mode:
                                {/* <span style={{ color: orderDetails.paymentStatus === 'PAY_SUCCESS' ? 'green' : 'red' }}>
                                    {orderDetails.paymentStatus === 'PAY_SUCCESS' ? 'SUCCESS' : 'FAILED'}
                                </span> */}
                                <span style={{ color: 'green'}}>
                                    {/* Check if payment was successful */}
                                    {orderDetails?.paymentStatus === 'PAY_SUCCESS'
                                        ? (
                                            <>
                                                {/* {orderDetails?.razorpayAmount > 0 && "Razorpay"}
                                                {orderDetails?.cashAmount > 0 && "Cash On Delivery (COD)"} */}

                                                {/* <> */}
                                                {orderDetails?.razorpayAmount > 0 && "Online"}
                                                {orderDetails?.cashAmount > 0 && "Cash On Delivery (COD)"}
                                                {orderDetails?.razorpayAmount === 0 && orderDetails?.cashAmount === 0 && orderDetails?.walletAmount > 0 && "Wallet"}

                                            {/* </> */}
                                            </>
                                        )
                                        : 'FAILED'
                                    }
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Date:
                                <span>{formatTimestampToDate(orderDetails.orderedDateTime)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
