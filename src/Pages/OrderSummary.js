import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFoodContext } from "./Components/FoodContext";
import { useAppContext } from "./Components/AppProvider";
import { SlWallet } from "react-icons/sl";
import useRazorpayPayment from "./Components/RazorpayPayment";
import Alert from "./Components/Alert";
import Header from "./Admin/Header";

const OrderInfo = ({
  title,
  quantity,
  totalItemPrice,
  gst,
  productAmount,
  description,
  imgSrc,
  productId,
  onAdd,
  onSubtract,
}) => (
  <div className="OrderSummary_card" style={{ marginBottom: "10px" }}>
    <div className="row">
      <div className="col-4 col-md-5 col-lg-3">
        <img
          src={imgSrc || "https://via.placeholder.com/150"}
          className="summaryimg"
          alt={title}
        />
      </div>
      <div className="col-8 col-md-7 col-lg-9">
        <div className="row">
          <h5 className="card-title">
            {title} ₹ {productAmount}
          </h5>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="quantity-controls">
              <button className="btn px-3" onClick={onSubtract}>
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button className="btn px-3" onClick={onAdd}>
                +
              </button>
            </div>
            <p className="card-text">
              <small className="text-muted">₹{totalItemPrice}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderSummary = () => {
  const { state: userDetails } = useLocation();

  const { foodData, addToCart, removeFromCart, setFoodData } = useFoodContext();
  const { apiServiceCall } = useAppContext();

  const navigate = useNavigate();

  const location = useLocation();
  const selectedLocation = location?.state?.selectedLocation ?? null;

  const [foodList, setFoodList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [userAlert, setUserAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertConfirm, setAlertConfirm] = useState(() => null);
  const [alertClose, setAlertClose] = useState(() => null);

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [walletMethod, setWalletMethod] = useState(null);
  const [walletAmount, setWalletAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(orderList.totalAmount);
  const [walletRedeemedAmount, setWalletRedeemedAmount] = useState(0);

  const id = userDetails?.userId;
  const [token] = useState(localStorage.getItem("token"));
  const locationId = localStorage.getItem("location");
  const companyName = localStorage.getItem("companyname");
  const locationName = localStorage.getItem("locationname");
  const userId = localStorage.getItem("userId");

  const saveListCalled = useRef(false);

  useEffect(() => {
    if (walletMethod && walletAmount > 0) {
      const redeemed = Math.min(walletAmount, orderList.totalAmount);
      setWalletRedeemedAmount(redeemed);
      setRemainingAmount(orderList.totalAmount - redeemed);
      console.log(orderList.totalAmount - redeemed);
      if (orderList.totalAmount - redeemed === 0) {
        setPaymentMethod("");
      } else {
        setPaymentMethod("online");
      }
    } else {
      setWalletRedeemedAmount(0);
      setRemainingAmount(orderList.totalAmount);
    }
  }, [orderList]);
  useEffect(() => {
    getwalletAmount();
  }, []);

  useEffect(() => {
    console.log(userDetails, foodData, "userDetails");
    const data = foodData.filter((food) => food.quantity > 0);
    if (data.length === 0) {
      navigate("/FoodList");
    } else {
      SaveList(data);
    }
  }, [foodData]);

  const handlePaymentChange = (event) => {
    const selectedPayment = event.target.value;
    setPaymentMethod(selectedPayment);
    console.log("Selected Payment Method:", selectedPayment);
  };
  const handleWallet = (event) => {
    const isChecked = event.target.checked;
    setWalletMethod(isChecked);
    if (isChecked && walletAmount > 0) {
      const redeemed = Math.min(walletAmount, orderList.totalAmount);
      setWalletRedeemedAmount(redeemed);
      setRemainingAmount(orderList.totalAmount - redeemed);
      if (orderList.totalAmount - redeemed === 0) {
        setPaymentMethod("");
      }
    } else {
      setWalletRedeemedAmount(0);
      setRemainingAmount(orderList.totalAmount);
      setPaymentMethod("online");
    }
    console.log("Wallet Amount:", walletAmount);
  };
  const base64ToImageUrl = (base64String) => {
    try {
      if (typeof base64String !== "string" || base64String.trim() === "") {
        throw new Error("Invalid Base64 string");
      }

      const paddedBase64String = base64String.padEnd(
        base64String.length + ((4 - (base64String.length % 4)) % 4),
        "="
      );

      const binaryString = window.atob(paddedBase64String);
      const binaryLen = binaryString.length;

      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes.buffer], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error converting Base64 string to image URL:", error);
      return null;
    }
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleRazorpayPayment = useRazorpayPayment();

  const navigateBack = () => {
    navigate("/FoodList");
  };

  const saveWallet = () => {
    const productIds = foodList.map((food) => food.products?.productId);
    const url = "/payment/payByWallet";
    const data = {
      userId: userId,
      walletAmount: walletRedeemedAmount,
      orderId: orderId,
      productIds: productIds,
      razorPaymentStatus: null,
    };
    if (paymentMethod === "offline") {
      data.cashAmount =
        remainingAmount > 0 ? remainingAmount : orderList?.totalAmount;
    }
    if (walletMethod && paymentMethod === "online") {
      data.razorPaymentStatus = "PAY_SUCCESS";
      data.razorpayAmount = remainingAmount;
    }
    apiServiceCall("POST", url, data, headers)
      .then((response) => {
        if (response.status === 200) {
          console.log("expected response:", response);
          navigate("/OrderPlaced", {
            state: { orderData: response.data },
            replace: true,
          });
        } else {
          console.error("Unexpected response:", response);
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
        // Handle error (show error message to user, etc.)
      });
  };
  const protopay = () => {
    const amountToPay =
      remainingAmount > 0 ? remainingAmount : orderList?.totalAmount;
    if (paymentMethod === "") {
      saveWallet();
    } else if (paymentMethod === "offline") {
      OrderPlacedZeroAmount();
    } else {
      handleRazorpayPayment(
        id,
        orderList?.id,
        onSuccess,
        onFailure,
        amountToPay
      );
    }
  };

  const onSuccess = (response) => {
    console.log("Payment success response:", response);
    if (walletMethod) {
      saveWallet();
    } else {
      navigate("/OrderPlaced", {
        state: { orderData: response },
        replace: true,
      });
    }
  };

  const onFailure = (response) => {
    setAlertType("error");
    setAlertMsg("Payment Failed!");
    setAlertClose(() => () => setUserAlert(false));
    setUserAlert(true);
    console.log("Payment success response:", response);
  };

  const SaveList = (data) => {
    console.log(data, "SaveList data");
    const url = `/order/save?userId=${id}&locationId=${locationId}`;
    const foodData = data.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    apiServiceCall("POST", url, foodData, headers)
      .then((response) => {
        console.log(response, "SaveList response");
        if (response.status === 200) {
          setFoodList(response.data.orderDetails);
          setOrderList(response.data.orders);
          setOrderId(response.data.orders.id);
        }
      })
      .catch((error) => {
        const { response } = error;
        if (response) {
          const { errorCode, localizedMessage } = response.data;

          if (errorCode === 1004) {
            setAlertType("error");
            setAlertMsg("The order window has closed!..");
          } else {
            setAlertType("error");
            setAlertMsg("The order window has not yet started!..");
          }

          setAlertClose(() => () => {
            navigate("/FoodList");
            window.location.reload();
          });
          setUserAlert(true);
        } else {
          setAlertType("error");
          setAlertMsg("Network error or server is not responding.");
          setAlertClose(() => () => {
            navigate("/FoodList");
            window.location.reload();
          });
          setUserAlert(true);
        }
      });
  };
  const OrderPlacedZeroAmount = () => {
    const url = `/wallet/getOrderDetails?userId=${id}&orderId=${orderId}`;
    const data = foodData.filter((e) => e.quantity > 0);
    apiServiceCall("POST", url, data, headers)
      .then((response) => {
        console.log("OrderPlacedZeroAmount response:", response);
        if (response.status === 200 && response.data) {
          saveWallet();
        } else {
          console.error("Unexpected response:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        // Handle error
      });
  };
  const getwalletAmount = () => {
    const url = `/companyadmin/getWalletDetails`;
    const data = { userId: id };
    apiServiceCall("GET", url, data, headers)
      .then((response) => {
        console.log(response, "walletAmount");
        setWalletAmount(response.data.walletAmount);
      })
      .catch((error) => {
        console.log("Error fetching menu:", error);
      });
  };

  return (
    <div>
      <Header
        title="Kannan Catering Service"
        hideLocation={true}
        backicon={true}
      />
      <div className="maincontent_user">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-3 mb-md-2">
            <div
              className="Orderheader_card mb-6"
              style={{ marginBottom: "10px" }}
            >
              <div
                className="card-body"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <h5 className="card-title">Order Summary</h5>
                {/* <h5 className="card-title" style={{ color: "#dc354" }}>{locationName}({companyName})</h5> */}
              </div>
            </div>
            {foodList.map((food, index) => (
              <OrderInfo
                key={index}
                title={food.products?.productName}
                description={food.products?.productDescription}
                quantity={food.quantity}
                totalItemPrice={food.totalPrice}
                productAmount={food.products?.productPrice}
                gst={food.taxAmount}
                productId={food.products?.productId}
                imgSrc={base64ToImageUrl(food.products?.productImage)}
                onAdd={() => addToCart(food.products?.productId)}
                onSubtract={() => removeFromCart(food.products?.productId)}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="OrderSummary_card" style={{ marginBottom: "20px" }}>
              <div className="card-body">
                <h5 className="card-title">Customer Information</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Employee Code
                    <span>{orderList.userDetail?.employeeCode || ""}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Mobile Number
                    <span>{orderList.userDetail?.phone || ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="OrderSummary_card" style={{ marginBottom: "20px" }}>
              <div className="card-body">
                <h5 className="card-title">Payment Method</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <SlWallet style={{ marginBottom: "5px" }}></SlWallet>
                      <label style={{ marginLeft: "5px" }}>Wallet</label>
                    </div>
                    <label className="chkbox">
                      <input
                        type="checkbox"
                        value="online"
                        checked={walletMethod}
                        onChange={handleWallet}
                        disabled={walletAmount === 0}
                      />
                      ₹ {walletAmount || 0}
                    </label>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <label className="chkbox">
                      <input
                        type="checkbox"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={handlePaymentChange}
                        disabled={walletMethod && remainingAmount === 0}
                      />
                      Online Payment
                    </label>
                    <label className="chkbox">
                      <input
                        type="checkbox"
                        value="offline"
                        checked={paymentMethod === "offline"}
                        onChange={handlePaymentChange}
                        disabled={walletMethod && remainingAmount === 0}
                      />
                      Cash On Delivery
                    </label>
                  </li>
                </ul>
                <ul className="list-group list-group-flush">
                  {walletMethod && (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <label style={{ marginLeft: "5px", color: "#00D700" }}>
                          Using ₹{walletRedeemedAmount} from available ₹
                          {walletAmount}
                        </label>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="OrderSummary_card">
              <div className="card-body">
                <h5 className="card-title">Bill Details</h5>
                <h5 className="card-title">
                  {foodList.length} {foodList.length > 1 ? "ITEMS" : "ITEM"}
                </h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Order Total
                    <span>₹ {orderList.totalAmount}</span>
                  </li>
                </ul>
                {walletRedeemedAmount > 0 && (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Wallet redeemed
                      <span>- ₹ {walletRedeemedAmount}</span>
                    </li>
                  </ul>
                )}
                {walletMethod && (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Amount Payable
                      <span>₹ {remainingAmount}</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div
              className="mt-6 order-ui"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button
                style={{ backgroundColor: "red", color: "white" }}
                className="btn btn-block"
                onClick={navigateBack}
              >
                <span style={{ fontSize: "14px" }}>&lt; Back</span>
              </button>
              <button
                style={{ backgroundColor: "#00D700", color: "white" }}
                className="btn btn-block"
                onClick={protopay}
              >
                <span style={{ fontSize: "14px" }}>
                  Place Order ₹{" "}
                  {walletMethod ? remainingAmount : orderList.totalAmount}
                </span>
              </button>
            </div>
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
  );
};

export default OrderSummary;
