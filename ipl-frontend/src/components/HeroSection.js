import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      setMousePosition({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="hero"
      style={{
        height: "70vh",
        minHeight: "420px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        color: "white",
        textAlign: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        zIndex: 1
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: "3rem", margin: 0, fontWeight: 800 }}>Welcome to Wicketly.AI</h1>
        <p style={{ fontSize: "1.25rem", marginTop: "12px", opacity: 0.95, fontWeight: 600 }}>Let's Change The Cricket Future</p>
      </div>
    </section>
  );
}
