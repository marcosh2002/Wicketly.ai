import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Close, 
  Person, 
  Email, 
  Lock, 
  CheckCircle, 
  Cancel,
  Visibility,
  VisibilityOff,
  Badge,
  CardGiftcard
} from "@mui/icons-material";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE}${path}`;

// Premium Input Component with Floating Label & Icons
const PremiumInput = ({ 
  icon: Icon, 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder,
  isValid,
  showValidation,
  delay = 0,
  isPassword = false
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ position: "relative", marginBottom: "20px" }}
    >
      {/* Animated Gradient Border Container */}
      <div style={{
        position: "relative",
        borderRadius: "12px",
        padding: "2px",
        background: focused 
          ? "linear-gradient(135deg, #10b981, #0ea5e9, #8b5cf6, #10b981)"
          : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        backgroundSize: focused ? "300% 300%" : "100% 100%",
        animation: focused ? "gradientShift 3s ease infinite" : "none",
      }}>
        <div style={{
          position: "relative",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
        }}>
          {/* Icon */}
          <div style={{
            padding: "14px",
            color: focused ? "#10b981" : "#64748b",
            transition: "color 0.3s ease",
            display: "flex",
            alignItems: "center",
          }}>
            <Icon style={{ fontSize: "20px" }} />
          </div>

          {/* Input */}
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused || hasValue ? placeholder : ""}
            style={{
              flex: 1,
              padding: "14px 0",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f1f5f9",
              fontSize: "15px",
              fontFamily: "inherit",
            }}
          />

          {/* Floating Label */}
          <motion.label
            initial={false}
            animate={{
              y: (focused || hasValue) ? -28 : 0,
              x: (focused || hasValue) ? -40 : 0,
              scale: (focused || hasValue) ? 0.85 : 1,
              color: focused ? "#10b981" : "#64748b",
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              left: "48px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: "14px",
              fontWeight: 500,
              background: (focused || hasValue) ? "rgba(15, 23, 42, 1)" : "transparent",
              padding: (focused || hasValue) ? "0 8px" : "0",
            }}
          >
            {label}
          </motion.label>

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                padding: "14px",
                cursor: "pointer",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <VisibilityOff style={{ fontSize: "20px" }} /> : <Visibility style={{ fontSize: "20px" }} />}
            </button>
          )}

          {/* Validation Icon */}
          {showValidation && value && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                padding: "14px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isValid ? (
                <CheckCircle style={{ fontSize: "20px", color: "#10b981" }} />
              ) : (
                <Cancel style={{ fontSize: "20px", color: "#ef4444" }} />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Password Strength Meter
const PasswordStrengthMeter = ({ password }) => {
  const getStrength = useCallback((pwd) => {
    if (!pwd) return { score: 0, label: "", color: "#374151" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 20, label: "Weak", color: "#ef4444" };
    if (score === 2) return { score: 40, label: "Fair", color: "#f97316" };
    if (score === 3) return { score: 60, label: "Good", color: "#eab308" };
    if (score === 4) return { score: 80, label: "Strong", color: "#22c55e" };
    return { score: 100, label: "Very Strong", color: "#10b981" };
  }, []);

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      style={{ marginTop: "-12px", marginBottom: "16px", padding: "0 4px" }}
    >
      <div style={{
        height: "4px",
        background: "#1e293b",
        borderRadius: "2px",
        overflow: "hidden",
        marginBottom: "6px",
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength.score}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${strength.color}, ${strength.color}aa)`,
            borderRadius: "2px",
          }}
        />
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        color: strength.color,
        fontWeight: 600,
      }}>
        <span>Password Strength</span>
        <span>{strength.label}</span>
      </div>
    </motion.div>
  );
};

// Signup Progress Steps
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Account" },
    { num: 2, label: "Security" },
    { num: 3, label: "Complete" }
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "30px",
      gap: "8px",
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.num}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: currentStep >= step.num ? 1 : 0.8,
              background: currentStep >= step.num 
                ? "linear-gradient(135deg, #10b981, #0ea5e9)" 
                : "rgba(100, 116, 139, 0.3)",
            }}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStep >= step.num ? "#fff" : "#64748b",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: currentStep >= step.num 
                ? "0 0 20px rgba(16, 185, 129, 0.4)" 
                : "none",
            }}
          >
            {currentStep > step.num ? "✓" : step.num}
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: 1,
                background: currentStep > step.num 
                  ? "linear-gradient(90deg, #10b981, #0ea5e9)" 
                  : "rgba(100, 116, 139, 0.3)",
              }}
              style={{
                width: "40px",
                height: "3px",
                borderRadius: "2px",
                transformOrigin: "left",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Custom Loading Spinner
const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    style={{
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      display: "inline-block",
      marginRight: "8px",
    }}
  />
);

// Animated Success Checkmark
const SuccessCheckmark = () => (
  <motion.svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    style={{ margin: "0 auto", display: "block" }}
  >
    <motion.circle
      cx="30"
      cy="30"
      r="28"
      fill="none"
      stroke="#10b981"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.path
      d="M18 30 L26 38 L42 22"
      fill="none"
      stroke="#10b981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    />
  </motion.svg>
);

// Confetti Celebration
const Confetti = ({ isActive }) => {
  const particles = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ec4899"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }))
  , []);

  if (!isActive) return null;

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      overflow: "hidden",
      borderRadius: "20px",
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
};

// Social Login Button
const SocialButton = ({ icon, label, onClick, color, hoverColor }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02, background: hoverColor }}
    whileTap={{ scale: 0.98 }}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px",
      background: color,
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s",
    }}
  >
    {icon}
    {label}
  </motion.button>
);

// Main AuthModal Component
export default function AuthModal({
  isOpen,
  mode = "login",
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Calculate current step based on filled fields
  useEffect(() => {
    if (mode === "signup") {
      if (formData.password && formData.confirmPassword) {
        setCurrentStep(3);
      } else if (formData.fullName && formData.username && formData.email) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [formData, mode]);

  // Autofill referral code from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('referral') || params.get('ref_code');
      if (ref && !formData.referralCode) {
        setFormData((prev) => ({ ...prev, referralCode: ref }));
      }
    } catch (e) {}
  }, []);

  // Validation helpers
  const validations = useMemo(() => ({
    fullName: formData.fullName.trim().length >= 2,
    username: /^[a-zA-Z0-9_]{3,20}$/.test(formData.username),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 6,
    confirmPassword: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0,
    referralCode: !formData.referralCode || /^[A-Za-z0-9-_]{3,20}$/.test(formData.referralCode),
  }), [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (mode === "signup") {
      if (!validations.fullName) { setError("Full name must be at least 2 characters"); return false; }
      if (!validations.username) { setError("Username must be 3-20 characters (letters, numbers, underscore)"); return false; }
      if (!validations.email) { setError("Invalid email format"); return false; }
      if (!validations.password) { setError("Password must be at least 6 characters"); return false; }
      if (!validations.confirmPassword) { setError("Passwords do not match"); return false; }
      if (!validations.referralCode) { setError("Invalid referral code format"); return false; }
    } else {
      if (!formData.username.trim()) { setError("Username is required"); return false; }
      if (!formData.password) { setError("Password is required"); return false; }
    }
    return true;
  };

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
      
      if (formData.referralCode?.trim()) {
        signupData.referral_code = formData.referralCode.trim();
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(apiUrl("/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(signupData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.ok) {
        setShowConfetti(true);
        const welcomeMsg = data.welcome || { message: "Welcome!", services: [] };
        setSuccess(`${welcomeMsg.message}`);

        setTimeout(() => {
          try { localStorage.setItem("user", JSON.stringify(data.user)); } catch(e){}
          try { localStorage.setItem("welcomeMessage", JSON.stringify(welcomeMsg)); } catch(e){}
          if (data.token) localStorage.setItem('token', data.token);
          onAuthSuccess(data.user, data.token);
          resetForm();
          onClose();
        }, 2500);
      } else {
        if (data.error === "username exists") {
          setError("This username is already taken");
        } else if (data.error === "email already registered") {
          setError("This email is already registered");
        } else {
          setError(data.error || "Signup failed");
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError("Request timeout - server not responding");
      } else {
        setError("Network error - please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiUrl('/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: formData.username.trim(), password: formData.password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.ok) {
        setSuccess(`Welcome back, ${data.user.display_name}!`);
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
      setError(err.name === 'AbortError' ? "Request timeout" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: "", username: "", email: "", password: "", confirmPassword: "", referralCode: "" });
    setError("");
    setSuccess("");
    setShowConfetti(false);
    setCurrentStep(1);
  };

  // Inline CSS for gradient animation
  const gradientKeyframes = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

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
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "20px",
          }}
        >
          <style>{gradientKeyframes}</style>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Confetti */}
            <Confetti isActive={showConfetti} />

            {/* Glow Effect */}
            <div style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
              }}
            >
              <Close style={{ fontSize: "20px" }} />
            </motion.button>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 0,
                marginBottom: "10px",
                background: "linear-gradient(135deg, #10b981, #0ea5e9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "center",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              {mode === "login" ? "Welcome Back" : "Join Wicketly"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                textAlign: "center",
                color: "#94a3b8",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              {mode === "login" 
                ? "Sign in to access your predictions" 
                : "Create an account to start predicting"}
            </motion.p>

            {/* Progress Steps for Signup */}
            {mode === "signup" && <ProgressSteps currentStep={currentStep} />}

            {/* Success State */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                }}
              >
                <SuccessCheckmark />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    color: "#10b981",
                    fontSize: "18px",
                    fontWeight: 600,
                    marginTop: "20px",
                  }}
                >
                  {success}
                </motion.p>
              </motion.div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
                {mode === "signup" && (
                  <>
                    <PremiumInput
                      icon={Badge}
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      isValid={validations.fullName}
                      showValidation={true}
                      delay={0.1}
                    />
                    <PremiumInput
                      icon={Email}
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      isValid={validations.email}
                      showValidation={true}
                      delay={0.2}
                    />
                  </>
                )}

                <PremiumInput
                  icon={Person}
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  isValid={validations.username}
                  showValidation={mode === "signup"}
                  delay={mode === "signup" ? 0.3 : 0.1}
                />

                <PremiumInput
                  icon={Lock}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  isValid={validations.password}
                  showValidation={mode === "signup"}
                  delay={mode === "signup" ? 0.4 : 0.2}
                  isPassword={true}
                />

                {mode === "signup" && (
                  <>
                    <PasswordStrengthMeter password={formData.password} />
                    
                    <PremiumInput
                      icon={Lock}
                      label="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      isValid={validations.confirmPassword}
                      showValidation={true}
                      delay={0.5}
                      isPassword={true}
                    />

                    <PremiumInput
                      icon={CardGiftcard}
                      label="Referral Code (optional)"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="FRIEND-123"
                      isValid={validations.referralCode}
                      showValidation={!!formData.referralCode}
                      delay={0.6}
                    />
                  </>
                )}

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Cancel style={{ fontSize: "18px" }} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: loading 
                      ? "rgba(100, 116, 139, 0.5)" 
                      : "linear-gradient(135deg, #10b981, #0ea5e9)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: loading ? "none" : "0 10px 30px rgba(16, 185, 129, 0.3)",
                    transition: "all 0.3s",
                  }}
                >
                  {loading && <LoadingSpinner />}
                  {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
                </motion.button>

                {/* Divider */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "25px 0",
                  gap: "15px",
                }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                  <span style={{ color: "#64748b", fontSize: "13px" }}>or continue with</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                </div>

                {/* Social Login Buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <SocialButton
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                    label="Google"
                    color="rgba(255,255,255,0.05)"
                    hoverColor="rgba(255,255,255,0.1)"
                    onClick={() => alert("Google login coming soon!")}
                  />
                  <SocialButton
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
                    label="GitHub"
                    color="rgba(255,255,255,0.05)"
                    hoverColor="rgba(255,255,255,0.1)"
                    onClick={() => alert("GitHub login coming soon!")}
                  />
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
