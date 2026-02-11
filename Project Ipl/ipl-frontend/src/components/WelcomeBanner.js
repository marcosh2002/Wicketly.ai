import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";

export default function WelcomeBanner() {
  // Show banner by default when the page loads unless user has dismissed it before.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("welcomeDismissed");
    if (!dismissed) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // persist dismissal so banner won't auto-show again
    localStorage.setItem("welcomeDismissed", "1");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1e2a78 0%, #00c6ff 100%)",
            color: "white",
            padding: "25px 30px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            maxWidth: "600px",
            width: "90%",
            zIndex: 1500,
            border: "2px solid #00c6ff"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1.4em", fontWeight: 800, letterSpacing: "0.5px" }}>
                Welcome to Wicketly.AI
              </h3>
              <p style={{ margin: 0, fontSize: "1.05em", opacity: 0.95, fontWeight: 600 }}>
                When Cricket Meets AI
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "15px",
                transition: "all 0.3s"
              }}
            >
              <Close style={{ fontSize: "20px" }} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
