import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

/**
 * ProtectedContent Component
 * Wraps any content that should only be visible to authenticated users
 */
export function ProtectedContent({ children, title, description }) {
  const { user, openSignup, openLogin } = useContext(AuthContext);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px"
        }}
      >
        <h2 style={{ color: "#1e2a78", marginBottom: "15px", fontSize: "1.8em" }}>
          {title || "Sign In Required"}
        </h2>
        <p style={{ color: "#666", fontSize: "1em", marginBottom: "25px", maxWidth: "500px" }}>
          {description || "You need to be signed in to access this feature. Sign up or log in to continue."}
        </p>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openSignup}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(45deg, #00c6ff, #0072ff)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Sign Up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openLogin}
            style={{
              padding: "12px 28px",
              background: "transparent",
              color: "#1e2a78",
              border: "2px solid #1e2a78",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Log In
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

/**
 * ProtectedButton Component
 * Button that triggers auth modal if user is not logged in
 */
export function ProtectedButton({ children, onClick, ...props }) {
  const { user, openSignup } = useContext(AuthContext);

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      openSignup();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}
