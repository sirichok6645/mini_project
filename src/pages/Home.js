import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function Home() {
  useEffect(() => {
    const canvas = document.getElementById("backgroundCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const numParticles = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  }, []);

  return (
    <div style={styles.container}>
      <canvas id="backgroundCanvas" style={styles.canvas}></canvas>
      <motion.div
        style={styles.homeBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>Discover Limitless Possibilities</h1>
        <p style={styles.subtitle}>Shop the latest trends with ease and style.</p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link to="/products" style={styles.button}>✨ Explore Now</Link>
        </motion.div>
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
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  homeBox: {
    position: "relative",
    background: "rgba(0, 0, 0, 0.8)",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)",
  },
  subtitle: {
    color: "#ccc",
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#FFD700",
    color: "#000",
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 15px rgba(255, 215, 0, 0.7)",
  },
};

export default Home;