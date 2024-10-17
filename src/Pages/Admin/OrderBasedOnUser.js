import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useLocation } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import "./Sidebar.css";
import "./Admstyle.css";

const OrderBasedOnUser = () => {
    const { sideBarCollapse } = useSidebar();
    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [walletAmount, setwalletAmount] = useState("");
    const [totalAmount, settotalAmount] = useState("");
    const [payable, setPayable] = useState("");
    const [codAmount, setCodeAmount] = useState("");
    const [orderdataandtime, setOrderDateandtime] = useState("")
    const [paymentStatus, setpaymentStatus] = useState("")


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
                setOrderData(response.data.orderDetails);
                setPayable(response.data.orders.razorpayAmount);
                settotalAmount(response.data.orders.totalAmount);
                setOrderId(response.data.orders.orderId);
                setOrderDateandtime(response.data.orders.orderedDateTime);
                setwalletAmount(response.data.orders.walletAmount);
                setCodeAmount(response.data.orders.cashAmount);
                setpaymentStatus(response.data.orders.paymentStatus);
            });
    };
    const base64ToImageUrl = (base64String) => {
        try {
            if (typeof base64String !== 'string' || base64String.trim() === '') {
                throw new Error('Invalid Base64 string');
            }
            const paddedBase64String = base64String.padEnd(base64String.length + (4 - base64String.length % 4) % 4, '=');
            const binaryString = window.atob(paddedBase64String);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error converting Base64 string to image URL:', error);
            return null;
        }
    };
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
    return (
        <div>
            <Header />
            <Admsidebar />
            {/* <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
                                <h4>Order Details</h4>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
                                <h5>Total Amount : </h5>
                                <h5>Wallet Amount : </h5>
                                <h5>Yet to collect : </h5>
                            </div>
                            {orderData.length > 0 ? (
                                orderData.map((order, index) => (
                                    <div className="task" key={index} draggable="true">
                                        <div >
                                            <div className="tags">
                                                <span className="tag">Product Name: {order.products.productName}</span>
                                            </div>
                                            <p>Quantity: {order.quantity}</p>
                                            <p>Order Amount: ₹ {order.totalPrice}</p>
                                            
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No order details available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="page_container">
                <div className={sideBarCollapse ? "main_content" : "main_content collapsed"}>
                    <div className="Summary_card">
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px" }}>
                            <h4 style={{ fontWeight: "bold", color: "#ff5722" }}>Order Details</h4>
                            <div >
                                {/* <label
                                    className="fw-bold fs-6"
                                    style={{
                                        marginBottom: "10px",
                                        color: "blue",
                                        textDecoration: "underline",
                                        cursor: "pointer"
                                    }}
                                >
                                    Back to Order
                                </label> */}
                            </div>
                        </div>

                        <div>
                            <ul className="list-group list-group-flush">
                                <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Your Order</h5>
                                {orderData.map((orderDetail, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ marginBottom: '10px' }}
                                    >
                                        <div className="d-flex flex-column align-items-center">
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
                                    <span> ₹ {totalAmount || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                </li>
                                {/* {orderData?.orders?.walletAmount > 0 && ( */}
                                <>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        Wallet :
                                        <span> ₹ - {walletAmount || 0}</span>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                        {payable === 0 ? (
                                            <>
                                                Amount:
                                                <span> ₹ {codAmount || 0}</span>
                                            </>
                                        ) : (
                                            <>
                                                Amount:
                                                <span> ₹ {payable || 0}</span>
                                            </>
                                        )}
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    </li>
                                </>
                                {/* )} */}
                            </ul>
                        </div>

                        <div>
                            <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Payment Information</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    Order ID:
                                    <span>{orderId || "N/A"}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
    Payment Method:
    <span style={{ color: paymentStatus === 'PAY_SUCCESS' ? 'green' : 'red' }}>
        {/* Check if payment was successful */}
        {paymentStatus === 'PAY_SUCCESS'
            ? (
                <>
                    {payable > 0 && "Razorpay"}
                    {codAmount > 0 && "Cash On Delivery (COD)"}
                    {payable === 0 && codAmount === 0 && walletAmount > 0 && "Wallet"}
                </>
            )
            : 'FAILED'
        }
    </span>
</li>


                                <li className="list-group-item d-flex justify-content-between align-items-center orderHistory_label">
                                    Date:
                                    <span>{orderdataandtime ? formatTimestampToDate(orderdataandtime) : "N/A"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderBasedOnUser;
