import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { useAppContext } from '../Components/AppProvider';
import Select from "react-select";
import "./myorders.css"
import Header from '../Admin/Header';

const MyOrders = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const roleId = localStorage.getItem("roleId");
    const saveduserId = localStorage.getItem("saveduserId");
    const { apiServiceCall } = useAppContext();

    const [token] = useState(localStorage.getItem("token"));
    const [myOrders, setMyOrders] = useState([]);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const fetchMyOrders = () => {
        const userIdToUse = userId
        if (!userIdToUse) {
            console.log("User ID is not available.");
            return;
        }

        const url = `/order/getOrdersByUserId`;
        const data = { userId: userIdToUse };

        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response);
                setMyOrders(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const Logout = () => {
        navigate("/Login");
        localStorage.clear();
    };
    const OnclickCard = (orderId) => {
        console.log(orderId.id, "OrderId");
        navigate('/OrderHistory', { state: { id: orderId.id } });
    };

    /*const formatTimestampToDate = (timestamp) => {
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
    };*/

    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
            />
            <div className='maincontent_user'>
                <div className='container'>
                    <h1 className="h3 mb-4" style={{ textAlign: "center" }}>My Orders</h1>
                </div>

                <div>
                    {myOrders.length > 0 ? (
                        myOrders.map((order) => (

                            <div className="myordercard" key={order.id} >
                                <h3 className="myordercard__title">Order ID: {order.orderId || 'Payment Failed'}</h3>
                                {/* <p className="myordercard__content" style={{ color: "black" }}> Location: {order.address}</p> */}
                                <p className={`card__content ${order.paymentStatus === 'PAY_SUCCESS' ? 'payment-success' : 'payment-pending'}`}>
                                    <span style={{ color: "black", fontSize: "13px" }}>Payment Status:</span> {order.paymentStatus === 'PAY_SUCCESS' ? 'SUCCESS' : 'FAILED'}
                                </p>
                                <p className="myordercard__content">
                                    Order Amount: ₹
                                    {order.razorpayAmount > 0
                                        ? order.razorpayAmount
                                        : order.cashAmount > 0
                                            ? order.cashAmount
                                            : 0}
                                </p>

                                <p className="myordercard__content">Location: {order.location.locationName}({order.location.companyName})</p>
                                <div className="myordercard__content">
                                    Order Date:
                                    {/* <span>{formatTimestampToDate(order.orderedDateTime)}</span> */}

                                    {new Date(order.orderedDateTime).toLocaleDateString('en-GB')}
                                </div>
                                {/* <p className="myordercard__content">Delivery Status: {order.shipped ? 'Dispatched' : 'Not Yet Dispatched'}</p> */}
                                {/* <p className="myordercard__content">Deliveryy Status: {order.delivered ? 'Delivered' : 'Not Yet Delivered'}</p> */}

                                {/* <p className="myordercard__content">
                                    Delivery Status:
                                    {order.shipped
                                        ? (order.delivered
                                            ? 'Delivered'
                                            : 'Dispatched')
                                        : 'Not Yet Dispatched'}
                                </p> */}

                                <div className="myordercard__date" style={{ color: "Green" }} onClick={() => OnclickCard(order)}>
                                    <span style={{ borderBottom: "2px solid Green" }}>View Orders</span>
                                </div>
                            </div>

                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>No orders available</p>
                    )}
                </div>
            </div>

        </div>

    );
};

export default MyOrders;
