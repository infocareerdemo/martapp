import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFoodContext } from './Components/FoodContext';
import { useAppContext } from './Components/AppProvider';
import useRazorpayPayment from './Components/RazorpayPayment';
import Alert from './Components/Alert';
import Header from './Admin/Header';

const Card = ({ title, quantity, totalItemPrice, gst }) => (
    <div className="row d-flex align-items-center justify-content-between">
        <div className='col-4'>
            <p className="fw-bold fs-6" style={{ textAlign: "left", marginBottom: "10px" }}>{title}</p>
        </div>
        <div className='col-4'>
            <p className="text-muted">{quantity}</p>
        </div>
        <div className='col-4' style={{ textAlign: "right" }}>
            <p className="text-muted">₹ {totalItemPrice}</p>
        </div>
        {/* <div className='col-4' style={{ textAlign: "right" }}>
            <p className="text-muted">₹ {gst}</p>
        </div> */}
    </div>
);

const OrderConfirmation = () => {
    const { state: userDetails } = useLocation();

    const { foodData } = useFoodContext();
    const { apiServiceCall } = useAppContext();

    const navigate = useNavigate();

    const location = useLocation();
    const selectedLocation = location?.state?.selectedLocation ?? null;

    const [foodList, setFoodList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const id = userDetails?.userId;
    const [token] = useState(localStorage.getItem("token"));

    const saveListCalled = useRef(false); // UseRef to track if SaveList has been called

    useEffect(() => {
        if (selectedLocation) {
            console.log('location', selectedLocation.label);
        }
    }, [selectedLocation]);
    useEffect(() => {
        console.log(userDetails, "userDetails");
        const data = foodData.filter(food => food.quantity > 0);

        if (data.length === 0) {
            navigate("/");
        } else if (!saveListCalled.current) {
            saveListCalled.current = true;
            SaveList(data);
        }
    }, []);

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const handleRazorpayPayment = useRazorpayPayment();

    // const onSuccess = (orderId) => {
    //     setAlertType("success");
    //     setAlertMsg(
    //         <div>
    //             <p className="fw-bold fs-6" style={{ marginBottom: "10px" }}>
    //                 Your Order Id: <span>{orderId}</span>
    //             </p>
    //             <p className="text-muted">Payment Success!</p>
    //         </div>
    //     );
    //     setAlertClose(() => () => {
    //         navigate('/');
    //         window.location.reload();
    //     });
    //     setUserAlert(true);
    // };
    // replace:true,
    const onSuccess = (orderId) => {
        navigate('/OrderPlaced', {replace:true, state: { orderId: orderId } });
    };

    const onFailure = () => {
        setAlertType("error");
        setAlertMsg("Payment Failed!");
        setAlertClose(() => () => {
            navigate('/');
            window.location.reload();
        });
        setUserAlert(true);
    };

    const SaveList = (data) => {
        console.log(data, "SaveList data");
        const url = `/order/save?userId=${id}&locationId=${selectedLocation.value}`;
        const foodData = data.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        apiServiceCall('POST', url, foodData, headers)
            .then((response) => {
                console.log(response, "SaveList response");
                if (response.status === 200) {
                    setFoodList(response.data.orderDetails);
                    setOrderList(response.data.orders);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <Header
                title="Kannan Catering Service"
                hideLocation={true}
                backicon={false}
            />
            <div className='maincontent_user'>
                <div className="min-vh-100 d-flex flex-column align-items-center  p-4">
                    <div className="max-w-md w-100 bg-white shadow rounded overflow-hidden">
                        <div className="py-3 px-4" style={{ backgroundColor: "black", display: 'flex', justifyContent: "space-between" }}>
                            <h2 className="text-3xl font-bold text-white">Order Confirmation</h2>
                            <h2 className="text-3xl font-bold text-white">{selectedLocation.label}</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-2 details_div">
                                <div className="row d-flex align-items-center justify-content-between">
                                    <div className='col-4'>
                                        <p className="fw-bold fs-6" style={{ textAlign: "left", marginBottom: "10px" }}>Product</p>
                                    </div>
                                    <div className='col-4'>
                                        <p className="text-muted">Quantity</p>
                                    </div>
                                    <div className='col-4' style={{ textAlign: "right" }}>
                                        <p className="text-muted">Price</p>
                                    </div>
                                </div>
                                {foodList.map((food, index) => (
                                    <Card
                                        key={index}
                                        title={food.products?.productName}
                                        quantity={food.quantity}
                                        totalItemPrice={food.totalPrice}
                                        gst={food.taxAmount}
                                    />
                                ))}
                            </div>
                            <div className="mb-6 mt-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-muted">GST :</p>
                                    <div className="d-flex flex-row align-items-end">
                                        <p className="text-muted" style={{ marginRight: '10px' }}>{orderList.gst} %</p>
                                        <p className="text-muted">₹ {orderList.gstAmount}</p>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-6 mt-2 details_div">
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="text-muted">Total Price :</p>
                                    <p className="text-muted">₹ {orderList.totalAmount} </p>
                                </div>
                            </div>
                            <div className="mb-2 mt-3 details_div">
                                <h3 className="h5 text-dark">User Details</h3>
                                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                    <div>
                                        <p className="h6 text-dark" style={{ marginBottom: "0.5rem" }}>Name</p>
                                        <p className="h6 text-dark" style={{ marginBottom: "0.5rem" }}>Email</p>
                                        <p className="h6 text-dark" style={{ marginBottom: "0.5rem" }}>Phone</p>
                                    </div>
                                    <div>
                                        <p className="h6 text-muted" style={{ marginBottom: "0.5rem" }}>{orderList.userLogin?.userName || ''}</p>
                                        <p className="h6 text-muted" style={{ marginBottom: "0.5rem" }}>{orderList.userLogin?.emailId || ''}</p>
                                        <p className="h6 text-muted" style={{ marginBottom: "0.5rem" }}>{orderList.userLogin?.phone || ''}</p>
                                        {/* <p className="h6 text-muted" style={{ marginBottom: "0.5rem" }}>{orderList.userLogin?.address || ''}</p> */}
                                    </div>
                                </div>
                            </div>
                            <button type='button' onClick={() => handleRazorpayPayment(id, orderList?.id, onSuccess, onFailure)} className="btn btn-primary w-100 py-2 font-weight-bold shadow-sm">Payment</button>
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
        </div>
    );
};

export default OrderConfirmation;
