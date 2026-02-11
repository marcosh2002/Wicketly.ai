import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Close, 
  Person, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
  CardGiftcard
} from "@mui/icons-material";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    fullName: null,
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
    referralCode: null
  });

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

  // Input change handler with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
    
    // Real-time validation
    validateField(name, value);
  };

  // Real-time field validation
  const validateField = (name, value) => {
    let isValid = null;
    
    switch(name) {
      case 'fullName':
        isValid = value.trim().length >= 2;
        break;
      case 'username':
        isValid = value.trim().length >= 3;
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        if (formData.confirmPassword && mode === 'signup') {
          setFieldValidation(prev => ({
            ...prev,
            confirmPassword: value === formData.confirmPassword
          }));
        }
        break;
      case 'confirmPassword':
        isValid = value === formData.password;
        break;
      case 'referralCode':
        if (value.trim() === '') {
          isValid = null; // optional field
        } else {
          isValid = /^[A-Za-z0-9-_]{3,20}$/.test(value);
        }
        break;
      default:
        break;
    }
    
    setFieldValidation(prev => ({
      ...prev,
      [name]: isValid
    }));
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

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('http://127.0.0.1:8000/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: formData.email.trim() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(`Password reset instructions have been sent to ${formData.email}`);
        setTimeout(() => {
          setShowForgotPassword(false);
          resetForm();
        }, 3000);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Request timeout. Please try again.");
      } else {
        setError("Network error. Please try again.");
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
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForgotPassword(false);
    setFieldValidation({
      fullName: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      referralCode: null
    });
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
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
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
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
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
              background: "linear-gradient(135deg, #1e2a78, #00c6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}>
              {showForgotPassword ? "Reset Password" : mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            {/* Form */}
            <form onSubmit={showForgotPassword ? handleForgotPassword : mode === "login" ? handleLogin : handleSignup}>
              {mode === "signup" && !showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Full Name</label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Person style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.fullName === false ? "#c62828" : fieldValidation.fullName ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.fullName === false ? "#c62828" : fieldValidation.fullName ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.fullName === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.fullName === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {fieldValidation.fullName !== null && (
                      <div style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}>
                        {fieldValidation.fullName ? 
                          <CheckCircle style={{ color: "#2e7d32", fontSize: "20px" }} /> :
                          <ErrorIcon style={{ color: "#c62828", fontSize: "20px" }} />
                        }
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {!showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === "signup" ? 0.2 : 0.1 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Username</label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Person style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.username === false ? "#c62828" : fieldValidation.username ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe123"
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.username === false ? "#c62828" : fieldValidation.username ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.username === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.username === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {fieldValidation.username !== null && (
                      <div style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}>
                        {fieldValidation.username ? 
                          <CheckCircle style={{ color: "#2e7d32", fontSize: "20px" }} /> :
                          <ErrorIcon style={{ color: "#c62828", fontSize: "20px" }} />
                        }
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {(mode === "signup" || showForgotPassword) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Email Address</label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Email style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.email === false ? "#c62828" : fieldValidation.email ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.email === false ? "#c62828" : fieldValidation.email ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.email === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.email === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {fieldValidation.email !== null && (
                      <div style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}>
                        {fieldValidation.email ? 
                          <CheckCircle style={{ color: "#2e7d32", fontSize: "20px" }} /> :
                          <ErrorIcon style={{ color: "#c62828", fontSize: "20px" }} />
                        }
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {!showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mode === "signup" ? 0.4 : 0.2 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Password</label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Lock style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.password === false ? "#c62828" : fieldValidation.password ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={mode === "login" ? "Enter password" : "Min 6 characters"}
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.password === false ? "#c62828" : fieldValidation.password ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.password === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.password === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        color: "#999"
                      }}
                    >
                      {showPassword ? 
                        <VisibilityOff style={{ fontSize: "20px" }} /> : 
                        <Visibility style={{ fontSize: "20px" }} />
                      }
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === "signup" && !showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Confirm Password</label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Lock style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.confirmPassword === false ? "#c62828" : fieldValidation.confirmPassword ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.confirmPassword === false ? "#c62828" : fieldValidation.confirmPassword ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.confirmPassword === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.confirmPassword === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        color: "#999"
                      }}
                    >
                      {showConfirmPassword ? 
                        <VisibilityOff style={{ fontSize: "20px" }} /> : 
                        <Visibility style={{ fontSize: "20px" }} />
                      }
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === "signup" && !showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}>Referral Code <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span></label>
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <CardGiftcard style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: fieldValidation.referralCode === false ? "#c62828" : fieldValidation.referralCode ? "#2e7d32" : "#999",
                      fontSize: "20px",
                      transition: "color 0.3s"
                    }} />
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="e.g. FRIEND-123"
                      style={{
                        width: "100%",
                        padding: "12px 45px 12px 45px",
                        border: `2px solid ${fieldValidation.referralCode === false ? "#c62828" : fieldValidation.referralCode ? "#2e7d32" : "#e0e0e0"}`,
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        transition: "all 0.3s",
                        outline: "none"
                      }}
                      onFocus={(e) => {
                        if (fieldValidation.referralCode === null) {
                          e.target.style.borderColor = "#00c6ff";
                          e.target.style.boxShadow = "0 0 0 3px rgba(0, 198, 255, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        if (fieldValidation.referralCode === null) {
                          e.target.style.borderColor = "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }
                      }}
                    />
                    {fieldValidation.referralCode !== null && (
                      <div style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}>
                        {fieldValidation.referralCode ? 
                          <CheckCircle style={{ color: "#2e7d32", fontSize: "20px" }} /> :
                          <ErrorIcon style={{ color: "#c62828", fontSize: "20px" }} />
                        }
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Forgot Password Link */}
              {mode === "login" && !showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "right",
                    marginBottom: "15px"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#00c6ff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "color 0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#1e2a78"}
                    onMouseLeave={(e) => e.target.style.color = "#00c6ff"}
                  >
                    Forgot Password?
                  </button>
                </motion.div>
              )}

              {/* Back to Login Link */}
              {showForgotPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    marginBottom: "15px"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError("");
                      setSuccess("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#00c6ff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "color 0.3s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#1e2a78"}
                    onMouseLeave={(e) => e.target.style.color = "#00c6ff"}
                  >
                    ← Back to Login
                  </button>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
                    color: "#c62828",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid #ef9a9a",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <ErrorIcon style={{ fontSize: "20px" }} />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                    color: "#2e7d32",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid #a5d6a7",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    whiteSpace: "pre-line"
                  }}
                >
                  <CheckCircle style={{ fontSize: "20px" }} />
                  <span>{success}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "none" : "0 8px 20px rgba(0, 198, 255, 0.3)" }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: loading ? "#e0e0e0" : "linear-gradient(135deg, #1e2a78, #00c6ff)",
                  color: loading ? "#999" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  marginBottom: "15px",
                  boxShadow: loading ? "none" : "0 4px 12px rgba(0, 198, 255, 0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      width: "16px",
                      height: "16px",
                      border: "2px solid #999",
                      borderTopColor: "transparent",
                      borderRadius: "50%"
                    }}
                  />
                )}
                {loading ? "Processing..." : showForgotPassword ? "Send Reset Link" : mode === "login" ? "Sign In" : "Create Account"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
