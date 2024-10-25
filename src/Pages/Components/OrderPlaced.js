import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderPlaced.css';
import Header from '../Admin/Header';
import { useNavigate } from 'react-router-dom';
import { useFoodContext } from "./FoodContext";

const OrderPlaced = () => {

    const location = useLocation();
    const { orderData } = location.state || {};
    const [userId] = useState(localStorage.getItem("userId"))
    const navigate = useNavigate();
    const { paymentId } = location.state || {};  // Retrieve paymentId from state
    const { setFoodData } = useFoodContext()

    const handleMyOrder = () => {
        navigate("/MyOrders");
    }
    const handleBack = () => {
        setFoodData([])
        navigate("/FoodList");
    }

    // useEffect(() => {
    //     const handleBrowserBack = () => {
    //         if (location.pathname !== "/FoodList") {  // Customize behavior only if not already on FoodList
    //             handleBack();
    //         }
    //     };

    //     window.history.pushState(null, null, window.location.href); // This prevents going back directly to a previous page
    //     window.addEventListener("popstate", handleBrowserBack); // Listen for back navigation

    //     // Clean up the listener on component unmount
    //     return () => {
    //         window.removeEventListener("popstate", handleBrowserBack);
    //     };
    // }, [location.pathname]);

    useEffect(() => {
        console.log('*******Payment ID:', paymentId);
        if (orderData) {
            console.log("Order Details :", orderData);
        }
    }, [orderData]);

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
                backicon={true}
            />
            <div className='maincontent_user'>
                <div className="order-summary">
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#ff5722" }}>Order Placed</h4>
                        <div onClick={handleBack}>
                            <label
                                className="fw-bold fs-6"
                                style={{
                                    marginBottom: "10px",
                                    color: "blue",
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                }}
                            >
                                Back to Order
                            </label>
                        </div>
                    </div>

                    <div>
                        <ul className="list-group list-group-flush">
                            <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Your Order</h5>
                            {orderData?.orderDetails?.map((orderDetail, index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ marginBottom: '10px' }}
                                >
                                    <div className="d-flex flex-column">
                                        <img
                                            src={base64ToImageUrl(orderDetail.products?.productImage) || "https://via.placeholder.com/150"}
                                            alt={orderDetail.products?.productName || "Product"}
                                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }}
                                        />
                                        <span>{orderDetail.products?.productName || 'Product Name'}</span>
                                    </div>

                                    <p>
                                        <span style={{
                                            border: '1px solid green',
                                            backgroundColor: '#EAFFCA',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            marginRight: '5px'
                                        }}>{orderDetail.quantity}</span> x ₹ {orderDetail.products?.productPrice || 0}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Grand Total :
                                <span> ₹ {orderData?.orders?.totalAmount || 0}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                            </li>
                            {orderData?.orders?.walletAmount > 0 && (
                                <>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        Wallet :
                                        <span> ₹ - {orderData?.orders?.walletAmount || 0}</span>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        Amount :
                                        <span>
                                            {orderData?.orders?.razorpayAmount > 0 && (
                                                <span> ₹ {orderData?.orders?.razorpayAmount}</span>
                                            )}
                                            {orderData?.orders?.cashAmount > 0 && (
                                                <span> ₹ {orderData?.orders?.cashAmount} </span>
                                            )}
                                            {/* Fallback in case both are zero */}
                                            {orderData?.orders?.razorpayAmount === 0 && orderData?.orders?.cashAmount === 0 && (
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

                    <div>
                        <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Payment Information</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Order ID:
                                <span>{orderData?.orders?.orderId || "N/A"}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Payment Method:
                                <span style={{ color: orderData?.orders?.paymentStatus === 'PAY_SUCCESS' ? 'green' : 'red' }}>
                                    {/* Check if payment was successful */}
                                    {orderData?.orders?.paymentStatus === 'PAY_SUCCESS'
                                        ? (
                                            <>
                                                {orderData?.orders?.razorpayAmount > 0 && "Online"}
                                                {orderData?.orders?.cashAmount > 0 && "Cash On Delivery (COD)"}
                                                {orderData?.orders?.razorpayAmount === 0 && orderData?.orders?.cashAmount === 0 && orderData?.orders?.walletAmount > 0 && "Wallet"}

                                            </>
                                        )
                                        : 'FAILED'
                                    }
                                </span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                Date:
                                <span>{orderData?.orders?.orderedDateTime ? formatTimestampToDate(orderData.orders.orderedDateTime) : "N/A"}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OrderPlaced;
