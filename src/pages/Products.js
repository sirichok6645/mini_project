import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProducts(res.data.products))
        .catch(() => setError("Unauthorized access. Please login."));
    }, [token]);

    const handleQuantityChange = (productID, value) => {
        setQuantity((prev) => ({ ...prev, [productID]: value }));
    };

    const handleAddToCart = async (product) => {
        const selectedQuantity = quantity[product.ProductID] || 1;
        try {
            const cartData = { 
                ProductID: product.ProductID, 
                Quantity: selectedQuantity, 
                CustomerID: 4 
            };
    
            const response = await axios.post(
                "http://localhost:5000/api/cart",
                cartData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.status === "success") {
                setSuccess("✅ Item added to cart!");
                setTimeout(() => navigate("/cart"), 1000);
            } else {
                setError("❌ Failed to add item to cart.");
            }
        } catch (err) {
            setError("❌ Error adding item to cart.");
        }
    
        setTimeout(() => {
            setSuccess("");
            setError("");
        }, 2000);
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg"
            style={styles.card}  
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center text-gold fw-bold mb-4">🛍 Our Products</h2>

            {success && <p className="alert alert-success text-center">{success}</p>}
            {error && <p className="alert alert-danger text-center">{error}</p>}

            <div className="row">
                {products.map((p) => (
                    <div key={p.ProductID} className="col-lg-4 col-md-6 mb-4">
                        <motion.div 
                            className="card shadow-sm p-3 border-0"
                            style={styles.productCard} 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <h5 className="fw-bold text-gold">{p.ProductName}</h5>
                                <p className="text-light">{p.Description}</p>
                                <p className="fw-bold text-gold fs-5">{parseFloat(p.Price).toLocaleString()} บาท</p>
                                  
                                <div className="mb-3">
                                    <label className="form-label text-light">Quantity:</label>
                                    <input 
                                        type="number" 
                                        className="form-control text-center bg-dark text-gold border-gold" 
                                        value={quantity[p.ProductID] || 1} 
                                        min="1"
                                        onChange={(e) => handleQuantityChange(p.ProductID, parseInt(e.target.value))}
                                    />
                                </div>

                                <motion.button 
                                    className="btn w-100"
                                    style={styles.button}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAddToCart(p)}
                                >
                                    🛒 Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                ))}
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
    productCard: {
        backgroundColor: "#1c1c1c",  
        color: "#fff", 
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(255, 215, 0, 0.2)",
    },
    button: {
        backgroundColor: "#FFD700", 
        color: "#121212",
        fontWeight: "bold",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.3)",
        transition: "all 0.3s ease-in-out",
    }
};

export default Products;
