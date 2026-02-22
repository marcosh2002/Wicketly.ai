import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";

export default function AuthModal({
  isOpen,
  mode = "login", // "login" or "signup"
  onClose,
  onAuthSuccess
}) {
  const accent = "#22d3ee";
  const accentSoft = "rgba(34, 211, 238, 0.35)";
  const textMuted = "#94a3b8";
  const shimmerDuration = mode === "login" ? 3.4 : 3.9;
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const isCompact = viewportWidth <= 420;

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Autofill referral code from URL (e.g. ?ref=CODE)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('referral') || params.get('ref_code');
      if (ref && !formData.referralCode) {
        setFormData((prev) => ({ ...prev, referralCode: ref }));
      }
    } catch (e) {
      // ignore in non-browser or malformed URL
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // Form validation
  const validateForm = () => {
    if (mode === "signup") {
      if (!formData.fullName.trim()) {
        setError("Full name is required");
        return false;
      }
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Invalid email format");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      // Referral code is optional but if provided, validate basic pattern
      if (formData.referralCode && !/^[A-Za-z0-9-_]{3,20}$/.test(formData.referralCode)) {
        setError("Referral code is invalid. Use 3-20 letters, numbers, - or _." );
        return false;
      }
    } else {
      if (!formData.username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!formData.password) {
        setError("Password is required");
        return false;
      }
    }
    return true;
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const signupData = {
        username: formData.username.trim(),
        display_name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      if (formData.referralCode && formData.referralCode.trim()) {
        signupData.referral_code = formData.referralCode.trim();
      }

      // Add timeout to fetch request (20 seconds for signup)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch("http://127.0.0.1:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(signupData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      console.log("Signup response:", response.status, data);

      if (response.ok && data.ok) {
        // Show welcome message with services
        const welcomeMsg = data.welcome || { message: "Welcome!", services: [] };
        const servicesText = (welcomeMsg.services || []).join("\n• ");

        // Include referral code and token balance if returned by the API
        const userRef = data.user && data.user.referral_code ? data.user.referral_code : null;
        const userTokens = data.user && typeof data.user.tokens !== 'undefined' ? data.user.tokens : null;

        let extraMsg = "";
        if (userRef) extraMsg += `\n\nYour referral code: ${userRef} — share it with friends to earn bonuses.`;
        if (userTokens !== null) extraMsg += `\nTokens: ${userTokens}`;

        setSuccess(
          `${welcomeMsg.message}\n\nServices available:\n• ${servicesText}\n\nA confirmation email has been sent to ${formData.email}${extraMsg}`
        );

        setTimeout(() => {
          try { localStorage.setItem("user", JSON.stringify(data.user)); } catch(e){}
          try { localStorage.setItem("welcomeMessage", JSON.stringify(welcomeMsg)); } catch(e){}
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          onAuthSuccess(data.user, data.token);
          resetForm();
          onClose();
        }, 3000);
      } else {
        // More detailed error messages
        if (data.error === "username exists") {
          setError("❌ This username is already taken. Please try another one.");
        } else if (data.error === "email already registered") {
          setError("❌ This email is already registered. Please use a different email or login with existing account.");
        } else {
          setError(data.error || data.message || "Signup failed. Try again.");
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Request timeout - server is not responding. Please check your internet connection and try again.");
      } else {
        console.error("Signup error:", err);
        setError("Network error: " + (err.message || "Could not connect to server"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const loginData = {
        username: formData.username.trim(),
        password: formData.password
      };

      // Add timeout to fetch request (15 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.ok) {
        setSuccess(`Welcome back, ${data.user.display_name}!`);
        // store token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          onAuthSuccess(data.user, data.token);
          resetForm();
          onClose();
        }, 800);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Request timeout - server is not responding. Please try again.");
      } else {
        console.error("Login error:", err);
        setError(err.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: ""
    });
    setError("");
    setSuccess("");
  };

  const getInputStyle = (hasValue) => ({
    width: "100%",
    padding: isCompact ? "12px 12px" : "13px 14px",
    marginBottom: isCompact ? "12px" : "14px",
    border: `1px solid ${hasValue ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)"}`,
    borderRadius: "10px",
    fontSize: isCompact ? "13px" : "14px",
    color: "#e2e8f0",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(12, 18, 32, 0.9))",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
    outline: "none",
    boxShadow: hasValue ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08), 0 6px 20px rgba(15, 23, 42, 0.28)" : "0 4px 14px rgba(2, 6, 23, 0.22)",
    backdropFilter: "blur(3px)",
    letterSpacing: "0.15px"
  });

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#cbd5e1",
    fontWeight: 700,
    fontSize: isCompact ? "10px" : "11px",
    letterSpacing: "0.9px",
    textTransform: "uppercase"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 18% 8%, rgba(59, 130, 246, 0.16), rgba(2, 6, 23, 0.9) 30%, rgba(2, 6, 23, 0.96) 100%)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: isCompact ? "10px" : "18px"
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(0deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.55) 100%)"
            }}
            animate={{ opacity: [0.65, 0.9, 0.65] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0, y: 14 }}
            transition={{ type: "spring", stiffness: 260, damping: 23 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(165deg, rgba(10, 17, 32, 0.96) 0%, rgba(11, 18, 34, 0.94) 38%, rgba(8, 14, 28, 0.97) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "20px",
              padding: isCompact ? "22px 16px 16px" : "34px 30px 26px",
              maxWidth: "500px",
              width: isCompact ? "100%" : "90%",
              boxShadow: "0 30px 80px rgba(2, 6, 23, 0.75), 0 0 0 1px rgba(34, 211, 238, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: "-1px",
                borderRadius: "20px",
                pointerEvents: "none",
                background:
                  "conic-gradient(from 0deg, rgba(34,211,238,0.26), rgba(59,130,246,0.12), rgba(34,211,238,0.26), rgba(59,130,246,0.12), rgba(34,211,238,0.26))",
                opacity: 0.35,
                filter: "blur(8px)"
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: "-35%",
                width: "36%",
                height: "100%",
                pointerEvents: "none",
                background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.09), rgba(255,255,255,0))",
                transform: "skewX(-18deg)"
              }}
              animate={{ x: ["0%", "360%"], opacity: [0, 0.65, 0] }}
              transition={{ duration: shimmerDuration, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.12,
                backgroundImage:
                  "radial-gradient(rgba(148,163,184,0.42) 0.55px, transparent 0.55px)",
                backgroundSize: "3px 3px",
                mixBlendMode: "screen"
              }}
            />

            <motion.div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                width: "18px",
                height: "18px",
                borderTop: "2px solid rgba(34, 211, 238, 0.75)",
                borderLeft: "2px solid rgba(34, 211, 238, 0.75)",
                borderTopLeftRadius: "8px",
                pointerEvents: "none"
              }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              style={{
                position: "absolute",
                top: "14px",
                right: "54px",
                width: "18px",
                height: "18px",
                borderTop: "2px solid rgba(96, 165, 250, 0.75)",
                borderRight: "2px solid rgba(96, 165, 250, 0.75)",
                borderTopRightRadius: "8px",
                pointerEvents: "none"
              }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />

            <motion.div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                width: "18px",
                height: "18px",
                borderBottom: "2px solid rgba(34, 211, 238, 0.65)",
                borderLeft: "2px solid rgba(34, 211, 238, 0.65)",
                borderBottomLeftRadius: "8px",
                pointerEvents: "none"
              }}
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            />

            <motion.div
              style={{
                position: "absolute",
                bottom: "14px",
                right: "14px",
                width: "18px",
                height: "18px",
                borderBottom: "2px solid rgba(96, 165, 250, 0.65)",
                borderRight: "2px solid rgba(96, 165, 250, 0.65)",
                borderBottomRightRadius: "8px",
                pointerEvents: "none"
              }}
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />

            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                top: isCompact ? "-148px" : "-120px",
                right: isCompact ? "-118px" : "-90px",
                background: "radial-gradient(circle, rgba(34, 211, 238, 0.26), rgba(34, 211, 238, 0))",
                filter: "blur(8px)",
                pointerEvents: "none"
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, rgba(34, 211, 238, 0), rgba(34, 211, 238, 0.85), rgba(34, 211, 238, 0))",
                boxShadow: "0 0 16px rgba(34, 211, 238, 0.55)"
              }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: isCompact ? "10px" : "14px",
                right: isCompact ? "10px" : "14px",
                width: isCompact ? "30px" : "34px",
                height: isCompact ? "30px" : "34px",
                borderRadius: isCompact ? "8px" : "10px",
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(148, 163, 184, 0.24)",
                cursor: "pointer",
                color: "#cbd5e1",
                display: "grid",
                placeItems: "center",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accentSoft;
                e.currentTarget.style.color = "#f8fafc";
                e.currentTarget.style.background = "rgba(30, 41, 59, 0.92)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.24)";
                e.currentTarget.style.color = "#cbd5e1";
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.7)";
              }}
            >
              <Close />
            </button>

            {/* Title */}
            <h2 style={{
              marginTop: 0,
              marginBottom: "6px",
              color: "transparent",
              background: "linear-gradient(100deg, #f8fafc 0%, #dbeafe 42%, #67e8f9 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textAlign: "center",
              fontSize: isCompact ? "24px" : "30px",
              fontWeight: 800,
              letterSpacing: "0.3px",
              textShadow: "0 6px 24px rgba(34, 211, 238, 0.15)"
            }}>
              {mode === "login" ? "Login" : "Create Account"}
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: isCompact ? "10px" : "12px",
                textAlign: "center",
                color: textMuted,
                fontSize: isCompact ? "12px" : "13px",
                padding: isCompact ? "0 8px" : "0"
              }}
            >
              {mode === "login" ? "Enter the arena and continue your journey" : "Join the arena and unlock premium features"}
            </p>

            <motion.div
              style={{
                margin: isCompact ? "0 auto 14px" : "0 auto 22px",
                width: "fit-content",
                borderRadius: "999px",
                border: "1px solid rgba(34, 211, 238, 0.32)",
                color: "#a5f3fc",
                background: "linear-gradient(90deg, rgba(8, 47, 73, 0.65), rgba(15, 23, 42, 0.75))",
                padding: isCompact ? "4px 9px" : "5px 11px",
                fontSize: isCompact ? "10px" : "11px",
                fontWeight: 700,
                letterSpacing: "0.55px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: isCompact ? "6px" : "7px"
              }}
              animate={{ boxShadow: ["0 0 0 rgba(34, 211, 238, 0)", "0 0 18px rgba(34, 211, 238, 0.24)", "0 0 0 rgba(34, 211, 238, 0)"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#22d3ee",
                  boxShadow: "0 0 10px rgba(34, 211, 238, 0.95)"
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              Secure encrypted session
            </motion.div>

            {/* Form */}
            <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={getInputStyle(Boolean(formData.fullName))}
                    onFocus={(e) => {
                      e.target.style.borderColor = accent;
                      e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formData.fullName ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                      e.target.style.boxShadow = formData.fullName ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === "signup" ? 0.2 : 0.1 }}
              >
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  style={getInputStyle(Boolean(formData.username))}
                  onFocus={(e) => {
                    e.target.style.borderColor = accent;
                    e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formData.username ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                    e.target.style.boxShadow = formData.username ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                  }}
                />
              </motion.div>

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={getInputStyle(Boolean(formData.email))}
                    onFocus={(e) => {
                      e.target.style.borderColor = accent;
                      e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formData.email ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                      e.target.style.boxShadow = formData.email ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === "signup" ? 0.4 : 0.2 }}
              >
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === "login" ? "Enter password" : "Min 6 characters"}
                  style={getInputStyle(Boolean(formData.password))}
                  onFocus={(e) => {
                    e.target.style.borderColor = accent;
                    e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formData.password ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                    e.target.style.boxShadow = formData.password ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                  }}
                />
              </motion.div>

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    style={getInputStyle(Boolean(formData.confirmPassword))}
                    onFocus={(e) => {
                      e.target.style.borderColor = accent;
                      e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formData.confirmPassword ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                      e.target.style.boxShadow = formData.confirmPassword ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                    }}
                  />
                </motion.div>
              )}

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label style={labelStyle}>Referral Code (optional)</label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="e.g. FRIEND-123"
                    style={getInputStyle(Boolean(formData.referralCode))}
                    onFocus={(e) => {
                      e.target.style.borderColor = accent;
                      e.target.style.boxShadow = "0 0 0 3px rgba(34, 211, 238, 0.2), inset 0 0 0 1px rgba(34, 211, 238, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = formData.referralCode ? "rgba(96, 165, 250, 0.45)" : "rgba(148, 163, 184, 0.22)";
                      e.target.style.boxShadow = formData.referralCode ? "inset 0 0 0 1px rgba(34, 211, 238, 0.08)" : "none";
                    }}
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "linear-gradient(180deg, rgba(127, 29, 29, 0.34), rgba(69, 10, 10, 0.38))",
                    color: "#fecaca",
                    border: "1px solid rgba(248, 113, 113, 0.4)",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "linear-gradient(180deg, rgba(22, 101, 52, 0.28), rgba(6, 78, 59, 0.3))",
                    color: "#bbf7d0",
                    border: "1px solid rgba(74, 222, 128, 0.35)",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 500,
                    whiteSpace: "pre-line"
                  }}
                >
                  ✓ {success}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.018, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: isCompact ? "12px" : "14px",
                  background: loading
                    ? "linear-gradient(120deg, #475569, #64748b)"
                    : "linear-gradient(120deg, #0f172a 0%, #1d4ed8 38%, #22d3ee 100%)",
                  color: "white",
                  border: "1px solid rgba(34, 211, 238, 0.35)",
                  borderRadius: "10px",
                  fontSize: isCompact ? "14px" : "16px",
                  fontWeight: 800,
                  letterSpacing: "0.25px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginBottom: "6px",
                  boxShadow: loading ? "none" : "0 16px 36px rgba(34, 211, 238, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  textShadow: "0 1px 2px rgba(2, 6, 23, 0.45)"
                }}
              >
                {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
