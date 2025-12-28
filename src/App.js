import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import AnimatedBackground from "./components/AnimatedBackground";
import WelcomeBanner from "./components/WelcomeBanner";
import Home from "./pages/Home";
import Teams from "./pages/TeamsNew";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import PredictForm from "./pages/PredictForm";
import TeamDetails from "./pages/TeamDetails";
import ExploreAnalytics from "./pages/ExploreAnalytics";
import PVP from "./pages/PVP";
import Points from "./pages/Points";
import Spin from "./pages/Spin";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// WICKETLY.AI - PREMIUM CINEMATIC LANDING PAGE
function WelcomePage({ onFinish }) {
  const [showLogo, setShowLogo] = useState(true);
  const [logoComplete, setLogoComplete] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      setLogoComplete(true);
    }, 3500); // 3.5 seconds for logo sequence

    const finishTimer = setTimeout(onFinish, 11000); // Total 11 seconds

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  // Neural Network Animation Component
  const NeuralNetwork = () => {
    return (
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          opacity: 0.15,
        }}
        viewBox="0 0 1000 1000"
      >
        <defs>
          <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Network lines */}
        {[...Array(15)].map((_, i) => (
          <motion.line
            key={i}
            x1={Math.random() * 1000}
            y1={Math.random() * 1000}
            x2={Math.random() * 1000}
            y2={Math.random() * 1000}
            stroke="url(#neuralGrad)"
            strokeWidth="1"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              x1: [Math.random() * 1000, Math.random() * 1000],
              x2: [Math.random() * 1000, Math.random() * 1000],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Network nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r="3"
            fill="#10b981"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              r: [3, 5, 3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    );
  };

  // Stadium Lights Animation
  const StadiumLights = () => {
    return (
      <>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`light-${i}`}
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)`,
              filter: "blur(40px)",
              top: `${(i * 25) % 100}%`,
              left: `${(i * 30) % 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </>
    );
  };

  // Floating Particles
  const Particles = () => {
    return (
      <>
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              borderRadius: "50%",
              background: `rgba(16, 185, 129, ${0.3 + Math.random() * 0.5})`,
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, Math.random() * 400 - 200],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </>
    );
  };

  // Animated Logo Sequence with Brand Logo
  const LogoSequence = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: showLogo ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        background: "rgba(15, 20, 25, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Animated Logo Image */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ 
          scale: showLogo ? 1 : 0.8, 
          rotate: showLogo ? 0 : -180, 
          opacity: showLogo ? 1 : 0 
        }}
        transition={{ 
          duration: 1.5, 
          ease: "easeOut",
          type: "spring",
          stiffness: 60
        }}
        style={{
          position: "relative",
          marginBottom: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {/* Logo Image */}
        <div
          style={{
            width: "220px",
            height: "220px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <img
            src="/my-logo.png"
            alt="Wicketly.ai Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 0 40px rgba(16, 185, 129, 0.5)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.3))",
            }}
          />
        </div>

        {/* Glowing Background Circle */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 40px rgba(16, 185, 129, 0.3)",
              "0 0 60px rgba(16, 185, 129, 0.5)",
              "0 0 40px rgba(16, 185, 129, 0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.05)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      </motion.div>

      {/* Stylish Wicketly.ai Text */}
      <motion.div
        style={{
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showLogo ? 1 : 0, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#3b82f6",
            letterSpacing: "1px",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}>
            Wicketly
          </span>
          <span style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#f97316",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}>
            .
          </span>
          <span style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#10b981",
            letterSpacing: "1px",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}>
            ai
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showLogo ? 1 : 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            fontSize: "0.75rem",
            background: "linear-gradient(90deg, #3b82f6, #f97316, #10b981)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: "8px",
            letterSpacing: "3px",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          AI Cricket Intelligence
        </motion.p>
      </motion.div>
    </motion.div>
  );

  // Word Animation Component
  const AnimatedWord = ({ word, delay, isKeyword }) => (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={logoComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: delay + 3.5, duration: 0.8, ease: "easeOut" }}
      style={{
        display: "inline-block",
        marginRight: "15px",
        background: isKeyword
          ? "linear-gradient(135deg, #10b981, #0ea5e9)"
          : "transparent",
        backgroundClip: isKeyword ? "text" : "unset",
        WebkitBackgroundClip: isKeyword ? "text" : "unset",
        WebkitTextFillColor: isKeyword ? "transparent" : "unset",
        fontWeight: isKeyword ? 900 : 800,
      }}
    >
      {word}
    </motion.span>
  );

  return (
    <motion.div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1419 50%, #0a0e1a 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: logoComplete ? "flex-start" : "center",
      }}
    >
      {/* Background Atmosphere */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <NeuralNetwork />
        <StadiumLights />
        <Particles />
      </div>

      {/* Logo Sequence */}
      <LogoSequence />

      {/* Main Content - Appears after logo */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          paddingTop: logoComplete ? "40px" : "0",
        }}
        initial={{ opacity: 0 }}
        animate={logoComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Hero Section */}
        <motion.div
          style={{
            textAlign: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* Main Heading - Word by Word */}
          <motion.h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 900,
              marginBottom: "20px",
              lineHeight: "1.1",
              letterSpacing: "-1px",
            }}
          >
            <AnimatedWord word="Welcome" delay={0} />
            <AnimatedWord word="to" delay={0.15} />
            <AnimatedWord word="Wicketly" delay={0.3} isKeyword />
            <br />
            <AnimatedWord word="IPL" delay={0.45} isKeyword />
            <AnimatedWord word="Portal!" delay={0.6} />
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={logoComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 4.5, duration: 0.8 }}
            style={{
              fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
              fontWeight: 600,
              color: "#cbd5e1",
              marginBottom: "12px",
              letterSpacing: "1px",
            }}
          >
            Your Ultimate IPL Experience
          </motion.h2>

          {/* Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={logoComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 4.8, duration: 0.8 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "#94a3b8",
              maxWidth: "700px",
              margin: "0 auto 48px",
              lineHeight: "1.8",
              fontWeight: 400,
            }}
          >
            Where artificial intelligence meets cricket mastery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={logoComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 5.1, duration: 0.8 }}
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "60px",
            }}
          >
            <motion.button
              whileHover={{
                y: -5,
                boxShadow: "0 20px 60px rgba(16, 185, 129, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "16px 42px",
                fontSize: "1.05rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "2px solid rgba(16, 185, 129, 0.5)",
                borderRadius: "10px",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
              }}
            >
              ⚡ Explore IPL Predictions
            </motion.button>

            <motion.button
              whileHover={{
                y: -5,
                boxShadow: "0 20px 60px rgba(14, 165, 233, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "16px 42px",
                fontSize: "1.05rem",
                fontWeight: 700,
                background: "rgba(14, 165, 233, 0.12)",
                border: "2px solid rgba(14, 165, 233, 0.4)",
                borderRadius: "10px",
                color: "#38bdf8",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(14, 165, 233, 0.15)",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
                backdropFilter: "blur(10px)",
              }}
            >
              📊 Live Match Analysis
            </motion.button>
          </motion.div>

          {/* Feature Cards - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={logoComplete ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 5.4, duration: 0.8 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
              maxWidth: "1100px",
              margin: "0 auto 48px",
              padding: "0 20px",
            }}
          >
            {[
              {
                icon: "🤖",
                title: "AI Match Predictions",
                desc: "Hyper-accurate predictions powered by deep learning",
              },
              {
                icon: "📊",
                title: "Real-Time IPL Insights",
                desc: "Live analytics, trends, and momentum shifts",
              },
              {
                icon: "⚡",
                title: "Player Performance Intelligence",
                desc: "Individual player stats and pattern analysis",
              },
              {
                icon: "🏆",
                title: "Smart Probability Models",
                desc: "Win probability updated in real-time",
              },
              {
                icon: "🎯",
                title: "Fantasy Cricket Advantage",
                desc: "Edge over competition with AI insights",
              },
              {
                icon: "💎",
                title: "Elite Data Science",
                desc: "Fortune 500-grade analytics engine",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -8,
                  boxShadow: "0 30px 60px rgba(16, 185, 129, 0.2)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={logoComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 5.4 + idx * 0.08, duration: 0.6 }}
                style={{
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "16px",
                  padding: "28px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "14px" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section - Animated Counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={logoComplete ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 6, duration: 0.8 }}
            style={{
              display: "flex",
              gap: "60px",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "40px 20px",
              borderTop: "1px solid rgba(16, 185, 129, 0.15)",
              borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {[
              { label: "Matches Analyzed", value: "500+", delay: 0.2 },
              { label: "Prediction Accuracy", value: "87%", delay: 0.4 },
              { label: "Active Users", value: "10K+", delay: 0.6 },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={logoComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ delay: 6 + stat.delay, duration: 0.6 }}
                style={{ textAlign: "center" }}
              >
                <motion.div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #10b981, #0ea5e9)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "6px",
                  }}
                  initial={{ scale: 0 }}
                  animate={logoComplete ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 6.3 + stat.delay, type: "spring", stiffness: 100 }}
                >
                  {stat.value}
                </motion.div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#cbd5e1", letterSpacing: "0.3px" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Loading/Transition Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={logoComplete ? { opacity: [1, 0.4, 1, 0.4, 1] } : { opacity: 0 }}
            transition={logoComplete ? {
              delay: 8,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            } : { delay: 8, duration: 0.8 }}
            style={{
              fontSize: "0.95rem",
              color: "#10b981",
              fontWeight: 700,
              marginTop: "40px",
              letterSpacing: "2px",
            }}
          >
            ✨ LOADING YOUR AI-POWERED EXPERIENCE...
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent({ showWelcome, setShowWelcome }) {
  const {
    user,
    isLoginOpen,
    isSignupOpen,
    openLogin,
    openSignup,
    closeLogin,
    closeSignup,
    handleAuthSuccess
  } = useContext(AuthContext);

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <WelcomePage key="welcome" onFinish={() => setShowWelcome(false)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          key="main"
          style={{ minHeight: "100vh", position: "relative" }}
        >
          <AnimatedBackground />
          <WelcomeBanner />
          <BrowserRouter>
            <Navbar 
              onOpenLogin={openLogin} 
              onOpenSignup={openSignup}
            />
            
            {/* Login Modal */}
            <AuthModal
              isOpen={isLoginOpen}
              mode="login"
              onClose={closeLogin}
              onAuthSuccess={handleAuthSuccess}
            />
            
            {/* Signup Modal */}
            <AuthModal
              isOpen={isSignupOpen}
              mode="signup"
              onClose={closeSignup}
              onAuthSuccess={handleAuthSuccess}
            />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/pvp" element={<PVP />} />
              <Route path="/points" element={<Points />} />
              <Route path="/spin" element={<Spin />} />
              <Route path="/predict" element={<PredictForm />} />
              <Route path="/explore" element={<ExploreAnalytics />} />
              <Route path="/team/:teamName" element={<TeamDetails />} />
            </Routes>
          </BrowserRouter>
        </motion.div>
      )}
    </AnimatePresence>
  );
}