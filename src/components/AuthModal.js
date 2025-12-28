import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";

export default function AuthModal({
  isOpen,
  mode = "login", // "login" or "signup"
  onClose,
  onAuthSuccess
}) {
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
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              position: "relative"
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                color: "#999"
              }}
            >
              <Close />
            </button>

            {/* Title */}
            <h2 style={{
              marginTop: 0,
              marginBottom: "30px",
              color: "#1e2a78",
              textAlign: "center",
              fontSize: "28px",
              fontWeight: 700
            }}>
              {mode === "login" ? "Login" : "Create Account"}
            </h2>

            {/* Form */}
            <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === "signup" ? 0.2 : 0.1 }}
              >
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "14px"
                }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border 0.3s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </motion.div>

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === "signup" ? 0.4 : 0.2 }}
              >
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "14px"
                }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === "login" ? "Enter password" : "Min 6 characters"}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border 0.3s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                  onBlur={(e) => e.target.style.borderColor = "#ddd"}
                />
              </motion.div>

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </motion.div>
              )}

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Referral Code (optional)</label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="e.g. FRIEND-123"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "15px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00c6ff"}
                    onBlur={(e) => e.target.style.borderColor = "#ddd"}
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "#ffebee",
                    color: "#c62828",
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
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 500
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading ? "#ccc" : "linear-gradient(45deg, #1e2a78, #00c6ff)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginBottom: "15px"
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
