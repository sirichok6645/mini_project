import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import axios from "axios";

const OrdersAndPayment = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderID, setSelectedOrderID] = useState("");
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/4", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.orders.length > 0) {
                setOrders(response.data.orders);
            } else {
                setError("❌ No orders found.");
            }
        } catch (err) {
            console.error("❌ Fetch Orders Error:", err);
            setError("❌ Failed to fetch orders.");
        }
    };

    const fetchOrderDetails = async (orderID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/order/${orderID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.OrderID) {
                setOrderDetails(response.data);
                setError("");
            } else {
                setError("❌ Order not found.");
                setOrderDetails(null);
            }
        } catch (err) {
            console.error("❌ Fetch Order Error:", err);
            setError("❌ Failed to fetch order details.");
        }
    };

    const handlePayment = async () => {
        if (!selectedOrderID) {
            alert("❌ Please select an Order!");
            return;
        }
        if (!paymentMethod) {
            alert("❌ Please select a payment method!");
            return;
        }

        const paymentData = {
            OrderID: selectedOrderID,
            PaymentMethod: paymentMethod,
            Amount: orderDetails.TotalPrice,
            PaymentDate: new Date().toISOString().slice(0, 19).replace("T", " "), 
            Status: "Completed"
        };

        try {
            const response = await axios.post("http://localhost:5000/api/payments", paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Payment Response:", response.data);

            if (response.data.status === "success") {
                alert("✅ Payment Successful!");

                await axios.put(`http://localhost:5000/api/orders/${selectedOrderID}`, { Status: "Completed" }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                fetchOrders();
                fetchOrderDetails(selectedOrderID);
            } else {
                setError("❌ Failed to complete payment.");
            }
        } catch (err) {
            console.error("❌ Payment Error:", err);
            setError("❌ Error processing payment.");
        }
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg"
            style={styles.card}
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center text-gold fw-bold mb-4">
                📦 <span style={{ color: "#d4af37" }}>Order & Payment</span>
            </h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            <div className="mb-4">
                <label className="fw-bold text-white">Select Order ID:</label>
                <select 
                    className="form-select"
                    value={selectedOrderID}
                    onChange={(e) => {
                        setSelectedOrderID(e.target.value);
                        fetchOrderDetails(e.target.value);
                    }}
                >
                    <option value="">-- Select Order --</option>
                    {orders.map((order) => (
                        <option key={order.OrderID} value={order.OrderID}>
                            Order {order.OrderID} - {new Date(order.OrderDate).toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>

            {orderDetails && (
                <>
                    <div className="p-3 mb-4 rounded shadow-sm" style={styles.orderDetails}>
                        <h4 className="text-center text-gold fw-bold">Order Information</h4>
                        <p className="mb-1"><strong>Order ID:</strong> {orderDetails.OrderID}</p>
                        <p className="mb-1"><strong>Total Price:</strong> {parseFloat(orderDetails.TotalPrice).toLocaleString()} บาท</p>
                        <p className="mb-1">
                            <strong>Status:</strong> 
                            <span className="badge ms-2" style={getStatusStyle(orderDetails.Status)}>
                                {orderDetails.Status}
                            </span>
                        </p>
                    </div>
                </>
            )}
        </motion.div>
    );
};

const getStatusStyle = (status) => ({
    backgroundColor: status === "Completed" ? "#d4af37" : "#808080",
    color: "white", padding: "8px 12px", borderRadius: "5px"
});

const styles = {
    card: {
        backgroundColor: "#121212",
        color: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.5)",
    },
    orderDetails: {
        backgroundColor: "#333333",
        borderRadius: "10px",
        padding: "15px",
    }
};

export default OrdersAndPayment;