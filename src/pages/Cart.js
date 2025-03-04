import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.cart.length > 0) {
                setCartItems(response.data.cart);
            } else {
                setError("❌ No items in cart.");
            }
        } catch (err) {
            console.error("❌ Fetch Cart Error:", err);
            setError("❌ Failed to fetch cart items.");
        }
    };

    const handleDelete = async (cartID) => {
        if (!window.confirm("⚠️ Are you sure you want to remove this item?")) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/${cartID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                alert("✅ Item removed from cart!");
                setCartItems(cartItems.filter(item => item.CartID !== cartID));
            } else {
                setError("❌ Failed to remove item.");
            }
        } catch (err) {
            console.error("❌ Delete Cart Error:", err);
            setError("❌ Error removing item from cart.");
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0).toLocaleString();
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            style={styles.card}
        >
            <h2 className="text-center text-gold fw-bold mb-4">🛒 Your Shopping Cart</h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            {cartItems.length === 0 ? (
                <p className="text-center text-danger fs-4">Your cart is empty.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>CartID</th>
                                <th>ProductID</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>CustomerID</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <motion.tr key={item.CartID} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                                    <td>{item.CartID}</td>
                                    <td>{item.ProductID}</td>
                                    <td>{item.ProductName}</td>
                                    <td className="text-gold">{parseFloat(item.Price).toLocaleString()} บาท</td>
                                    <td>{item.CustomerID}</td>
                                    <td>{item.Quantity}</td>
                                    <td>
                                        <motion.button 
                                            className="btn btn-danger btn-sm"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(item.CartID)}
                                        >
                                            ❌ Remove
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h3 className="text-end text-gold fw-bold">Total Price: {getTotalPrice()} บาท</h3>

            <div className="d-flex justify-content-between mt-4">
                <motion.button 
                    className="btn btn-secondary px-4" 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/products")}
                >
                    🔙 Back to Products
                </motion.button>
            </div>
        </motion.div>
    );
};

const styles = {
    card: {
        backgroundColor: "#121212",  
        color: "#fff", 
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.3)",
    },
};

export default Cart;