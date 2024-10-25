import React, { useEffect, useState } from "react";
import Header from "./Header";
import Admsidebar from "./Admsidebar";
import { useSidebar } from "./SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from '../Components/AppProvider';
import "./Sidebar.css";
import "./Admstyle.css";
import { toast } from "react-toastify";

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
    const [codflag, setcodflag] = useState("")
    const [delflag, setDelflag] = useState("")

    const navigate = useNavigate();

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
                setOrderData(response.data?.orderDetails);
                setPayable(response.data.orders.razorpayAmount);
                settotalAmount(response.data.orders.totalAmount);
                setOrderId(response.data.orders.orderId);
                setOrderDateandtime(response.data.orders.orderedDateTime);
                setwalletAmount(response.data.orders.walletAmount);
                setCodeAmount(response.data.orders.cashAmount);
                setpaymentStatus(response.data.orders.paymentStatus);

                setcodflag(response.data.orders.cashOrderStatus)
                setDelflag(response.data.orders.deliveredStatus)
                console.log(response.data.orders.deliveredStatus)
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
    const codBtn = () => {
        const url = `/order/updateOrderStatus`;
        const data = {
            orderId: orderId,
            cashOrderStatus: true,
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                if (response.status === 200) {
                    ViewUsers();
                    toast.success('COD Approved', {
                        position: "bottom-center",
                        autoClose: 2000, // Auto close after 3 seconds
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            })
            .catch((error) => {
            });
    };
    const DeliveredBtn = () => {
        const url = `/order/updateDeliveredStatus`;
        const data = {
            orderId: orderId,
            deliveredStatus: true,
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                console.log(response, "SaveList response");
                if (response.status === 200) {
                    ViewUsers();
                }
            })
            .catch((error) => {
            });
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
                                {/* <h5 className="card-title" style={{ fontWeight: "bold", color: "#ff5722" }}>Your Order</h5> */}
                                {orderData.map((orderDetail, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ marginBottom: '10px' }}
                                    >
                                        <div className="d-flex flex-column " >
                                            <img
                                                src={base64ToImageUrl(orderDetail.products?.productImage) || "https://via.placeholder.com/150"}
                                                alt={orderDetail.products?.productName || "Product"}
                                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }}
                                            />
                                            <span>{orderDetail.products?.productName || 'Product Name'}</span>
                                        </div>
              
                                        <p >
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
                                                {paymentStatus === 'PAY_SUCCESS'
                                                    ? (
                                                        <>
                                                            {payable > 0 && "Online"}
                                                            {codAmount > 0 && "Cash On Delivery (COD)"}
                                                            {payable === 0 && codAmount === 0 && walletAmount > 0 && "Wallet"}
                                                        </>
                                                    )
                                                    : ''
                                                }
                                                <span> ₹ {codAmount || 0}</span>
                                            </>
                                        ) : (
                                            <>
                                                {paymentStatus === 'PAY_SUCCESS'
                                                    ? (
                                                        <>
                                                            {payable > 0 && "Online"}
                                                            {codAmount > 0 && "Cash On Delivery (COD)"}
                                                            {payable === 0 && codAmount === 0 && walletAmount > 0 && "Wallet"}
                                                        </>
                                                    )
                                                    : ''
                                                }
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
                                                    {payable > 0 && "Online"}
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
                        {/* COD */}
                        {codAmount > 0 &&
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                                {codflag === true ? (
                                    <div className="col-lg-3 col-md-12">
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                            <span className='required' style={{ color: "red" }}></span>
                                        </label>
                                        <button
                                            className='input_box'
                                            style={{
                                                backgroundColor: "green", // Change to green if codflag is true
                                                color: "white",
                                                cursor: "default",
                                                display: "block",
                                                width: "100%",
                                                borderRadius: "8px",
                                            }}
                                            disabled
                                        >
                                            COD Collected
                                        </button>
                                    </div>
                                ) : (
                                    <div className="col-lg-3 col-md-12">
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                            <span className='required' style={{ color: "red" }}></span>
                                        </label>
                                        <button
                                            className='input_box'
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                cursor: "pointer",
                                                display: "block",
                                                width: "100%",
                                                borderRadius: "8px",
                                            }}
                                            onClick={codBtn}
                                        >
                                            COD Collected
                                        </button>
                                    </div>
                                )}

                                {delflag === true ? (
                                    <div className="col-lg-3 col-md-12">
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                            <span className='required' style={{ color: "red" }}></span>
                                        </label>
                                        <button
                                            className='input_box'
                                            style={{
                                                backgroundColor: "green",
                                                color: "white",
                                                cursor: "default",
                                                display: "block",
                                                width: "100%",
                                                borderRadius: "8px",
                                            }}
                                            disabled
                                        >
                                            Delivered
                                        </button>
                                    </div>
                                ) : (
                                    <div className="col-lg-3 col-md-12">
                                        <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                            <span className='required' style={{ color: "red" }}></span>
                                        </label>
                                        <button
                                            className='input_box'
                                            disabled={codflag === false}
                                            style={{
                                                backgroundColor: codflag === true ? "red" : "#AFB0B1",
                                                color: codflag === true ? "white" : "white",
                                                cursor: codflag === false ? "not-allowed" : "pointer",
                                                display: "block",
                                                width: "100%",
                                                borderRadius: "8px",
                                                border: "none"
                                            }}
                                            onClick={codflag === false ? null : DeliveredBtn}
                                        >
                                            Yet to Deliver
                                        </button>

                                    </div>
                                )}


                            </div>
                        }
                        {/* ONLINE */}
                        {(payable > 0 || (payable === 0 && codAmount === 0 && walletAmount > 0)) && (
                            <>
                                {delflag ? (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                                        <div className="col-lg-3 col-md-12">
                                            <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                                <span className='required' style={{ color: "red" }}></span>
                                            </label>
                                            <button
                                                className='input_box'
                                                style={{
                                                    backgroundColor: "green",
                                                    color: "white",
                                                    cursor: "default",
                                                    display: "block",
                                                    width: "100%",
                                                    borderRadius: "8px",
                                                }}
                                                disabled
                                            >
                                                Delivered
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                                        <div className="col-lg-3 col-md-12">
                                            <label className="admaddmenu_label" style={{ marginBottom: "55px" }}>
                                                <span className='required' style={{ color: "red" }}></span>
                                            </label>
                                            <button
                                                className='input_box'
                                                // disabled={!codflag}
                                                style={{
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    display: "block",
                                                    width: "100%",
                                                    borderRadius: "8px",
                                                    border: "none",
                                                }}
                                                onClick={DeliveredBtn}
                                            >
                                                Yet to Deliver
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                       
                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderBasedOnUser;
