import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoodContext } from './Components/FoodContext';
import { useAppContext } from './Components/AppProvider';
import Header from './Admin/Header';
import Alert from './Components/Alert';
import "../style.css";
import { Toast } from 'react-bootstrap';
import { toast } from 'react-toastify';

const FoodCard = ({ imgSrc, title, description, price, quantity, totalItemPrice, onAdd, onSubtract, productstatus, handleAddToCard }) => (

    <div className="dish">
        <div className="dish-info">
            <div className="dish-title">
                <h3>{title}</h3>
                <p className="dish-price">₹ {price}</p>
                <p className="dish-description">{description}</p>
            </div>
            <div className="dish-image">
                <img src={imgSrc || "https://via.placeholder.com/150"} alt={title} />
                <div style={{ marginTop: "10px" }}>
                    {productstatus === false ? (
                        <span className="out-of-stock">Out of Stock</span>
                    ) : quantity <= 0 ? (
                        <button onClick={onAdd} className="add-button" style={{ fontSize: "14px" }}>ADD</button>

                    ) : (
                        <div className="quantity-controls">
                            <button onClick={onSubtract} className="btn px-3">-</button>
                            <span className="px-2">{quantity}</span>
                            <button onClick={onAdd} className="btn px-3">+</button>
                        </div>
                    )}

                </div>
                {/* <div style={{ marginTop: "10px" }}>
                    <button className="addtocard-button" style={{ color: "black", fontSize: "12px" }} onClick={handleAddToCard}>ADD TO CARD</button>
                </div> */}
            </div>
        </div>
    </div>
);

const FoodList = () => {
    const { foodData, addToCart, removeFromCart, setFoodData } = useFoodContext();
    const navigate = useNavigate();
    const [Selectlocation, setSelectlocation] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);

    const { apiServiceCall } = useAppContext();
    const [token] = useState(localStorage.getItem("token"));
    const [userAlert, setUserAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertConfirm, setAlertConfirm] = useState(() => null);
    const [alertClose, setAlertClose] = useState(() => null);

    const locationId = localStorage.getItem("location");
    const companyName = localStorage.getItem("companyname");
    const userId = parseInt(localStorage.getItem("userId"), 10);



    const headers = {
        Authorization: `Bearer ${token}`,
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

    useEffect(() => {
        locationbasedMenu();
        console.log("**********:" + companyName);

    }, []);
    const GetAllCardDetails = () => {
        const url = `/cart/getAllProductsByUserId`;
        const data = { userId: userId };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                const data = response.data.length;
            })
            .catch((error) => {
                console.log('Error fetching menu:', error);
            });
    };
    const handleAddToCard = (food) => {
        console.log("Product ID:", food.productId);
        const url = "/cart/addProductByCart";
        const data = {
            "userDetail": {
                "userId": userId,
            },
            "product": {
                "productId": food.productId,
            },
            "quantity": 1,
            "totalPrice": food.productPrice,
            "productActive": true
        };
        apiServiceCall('POST', url, data, headers)
            .then((response) => {
                if (response.data !== '') {
                    GetAllCardDetails();
                    toast.success('Product Added to Card', {
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
                toast.error('Product already Added to Card', {
                    position: "bottom-center",
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            });
    };
    const locationbasedMenu = (id) => {
        console.log('Fetching menu for location ID:', id);
        const url = `/product/getAllProductsByLocation`;
        const data = { id: locationId };
        apiServiceCall('GET', url, data, headers)
            .then((response) => {
                console.log(response, "menu")
                const data = (foodData.length ? foodData : response.data).map((item) => ({
                    ...item,
                    quantity: item.quantity ?? 0 // Preserve existing quantity if it exists, otherwise set to 0
                }));
                
                setFoodData(data);
            })
            .catch((error) => {
                console.log('Error fetching menu:', error);
            });
    };


    const handlenavigate = () => {
        const userId = localStorage.getItem("userId");
        const roleId = localStorage.getItem("roleId");
        const totalPrice = foodData.reduce((total, food) => total + food.quantity * food.productPrice, 0);

        if (totalPrice === 0) {
            setUserAlert(true)
            setAlertClose(() => () => {
                setUserAlert(false);
            })
            setAlertType("error")
            setAlertMsg("Please select items before proceeding.");
        } else {
            navigate('/OrderSummary', { state: { userId: userId, selectedLocation: Selectlocation } });
            // if (roleId === "2" && userId !== "") {

            // } else {
            //     navigate('/OrderSummary', { state: { selectedLocation: Selectlocation } });
            // }
        }
    };
    const totalAmount = foodData.reduce((total, item) => total + item.quantity * item.productPrice, 0);
    const hasItemsInCart = foodData.some((item) => item.quantity > 0);
    const distinctItemCount = foodData.filter(item => item.quantity > 0).length;

    return (
        <div>
            <Header
                //  onLocationChange={handleLocationChange} 
                backicon={true}
            />
            <div className='maincontent_user'>
                {/* <div className="menu-swiggy"> */}
                <div className='container py-1'>
                    <h1 className="h3 mb-4" >
                        Kannan Catering Service
                    </h1>
                    {foodData.length > 0 ? (
                        <>
                            {foodData.map((food, index) => (
                                <FoodCard
                                    imgSrc={base64ToImageUrl(food.productImage)}
                                    title={food.productName}
                                    productstatus={food.productActive}
                                    description={food.productDescription}
                                    price={food.productPrice}
                                    quantity={food.quantity}
                                    totalItemPrice={food.productPrice * food.quantity}
                                    onAdd={() => addToCart(food.productId)}
                                    onSubtract={() => removeFromCart(food.productId)}
                                    handleAddToCard={() => handleAddToCard(food)}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="text-center">
                            <h6> No records</h6>
                        </div>
                    )}
                    {hasItemsInCart && (
                        <div className="mt-4 order-ui">
                            <div>
                                <label>Amount : ₹{totalAmount}</label>
                            </div>
                            <div>
                                <button className="add-button" onClick={handlenavigate}>Continue</button>
                            </div>
                        </div>
                    )}
                </div>
                <Alert
                    title={alertTitle}
                    msg={alertMsg}
                    open={userAlert}
                    type={alertType}
                    onClose={alertClose}
                    onConfirm={alertConfirm}
                />
                {/* </div> */}
            </div>
        </div>
    );
};

export default FoodList;
