import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { fullName, email, password });
      alert("✅ Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("❌ Error registering. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.registerBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <motion.button
            type="submit"
            style={styles.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    background: "radial-gradient(circle, #222 0%, #111 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  registerBox: {
    position: "relative",
    background: "rgba(0, 0, 0, 0.8)",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
  },
  title: {
    color: "#FFD700",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "0px 0px 10px rgba(255, 215, 0, 0.5)",
  },
  inputContainer: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#333",
    color: "#FFD700",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#FFD700",
    color: "#000",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.5)",
  },
};

export default Register;