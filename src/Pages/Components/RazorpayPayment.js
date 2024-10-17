import useRazorpay from "react-razorpay";
import { useAppContext } from "./AppProvider";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useRazorpayPayment = () => {
    const [Razorpay] = useRazorpay();
    const { apiServiceCall } = useAppContext();
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };
    const navigate = useNavigate();
    const handleRazorpayPayment = async (userId, orderId, onSuccess, onFailure,amountToPay) => {
        try {
            const url = `/payment/createOrder?id=${userId}&oid=${orderId}&razorpayAmount=${amountToPay}`;
            const response = await apiServiceCall('POST', url, null, headers);

            if (response.status === 200) {
                const data = response.data;
                const options = {
                    key: data.secretId,
                    amount: data.applicationFee,
                    currency: data.currency,
                    name: data.merchantName,
                    description: data.purchaseDescription,
                    order_id: data.razorpayOrderId,
                    handler: async function (response) {
                        console.log("Payment successful: ", response);
                        const checkStatusUrl = `/payment/checkStatus`;
                        const data1 = {
                            razorPayDetails: {
                                razorpayOrderId: response.razorpay_order_id
                            },
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            orders: {
                                id: orderId,
                            },
                        };
                        try {
                            const payRes = await apiServiceCall('POST', checkStatusUrl, data1, headers);
                            if (payRes.data.orders.paymentStatus === "PAY_SUCCESS") {
                                onSuccess(payRes.data);
                            } else if (payRes.data.orders.paymentStatus === "PAY_FAILED") {
                                onFailure(payRes.data);
                            }
                        } catch (error) {
                            console.error("Error checking payment status:", error);
                            onFailure(orderId);
                        }
                    },
                    prefill: {
                        name: data.customerName,
                        email: data.customerEmail,
                        contact: data.customerContact,
                    },
                    notes: data.notes,
                    theme: {
                        color: data.theme,
                    },
                    modal: {
                        ondismiss: () => {
                            onFailure(orderId);
                        }
                    },
                };

                const rzp1 = new Razorpay(options);

                rzp1.on("payment.failed", function (response) {
                    // onFailure(orderId);
                });

                rzp1.open();
            } else {
                console.error("Error creating order:", response.statusText);
                onFailure(orderId);
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            onFailure(orderId);
        }
    };

    return handleRazorpayPayment;
};

export default useRazorpayPayment;