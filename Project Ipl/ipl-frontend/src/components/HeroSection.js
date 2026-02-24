import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

// Typing effect component
const TypeWriter = ({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span>
      {displayText}
      <span className="typing-cursor">|</span>
    </span>
  );
};

// Floating cricket ball component
const FloatingBall = ({ delay, size, left, duration }) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${left}%`,
      bottom: "-50px",
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #c41e3a 0%, #8b0000 50%, #c41e3a 100%)",
      boxShadow: "inset -3px -3px 8px rgba(0,0,0,0.4), inset 3px 3px 8px rgba(255,255,255,0.2)",
      opacity: 0.6,
      zIndex: 0,
    }}
    initial={{ y: 0, rotate: 0 }}
    animate={{ 
      y: [0, -800, -1600],
      rotate: [0, 360, 720],
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  >
    {/* Cricket ball seam */}
    <div style={{
      position: "absolute",
      top: "50%",
      left: "10%",
      right: "10%",
      height: "2px",
      background: "rgba(255,255,255,0.5)",
      transform: "translateY(-50%) rotate(30deg)",
      borderRadius: "50%"
    }} />
  </motion.div>
);

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

  const taglines = [
    "Let's Change The Cricket Future",
    "AI-Powered Match Predictions",
    "96% Live Prediction Accuracy",
    "Real-Time Cricket Analytics"
  ];

  const stats = [
    { value: 96, suffix: "%", label: "Live Accuracy" },
    { value: 50000, suffix: "+", label: "Predictions Made" },
    { value: 10000, suffix: "+", label: "Active Users" },
    { value: 17, suffix: "", label: "IPL Seasons Data" }
  ];

  const features = [
    { icon: "🎯", title: "Match Predictions", desc: "AI-powered win probability" },
    { icon: "📊", title: "Live Analytics", desc: "Real-time match insights" },
    { icon: "⚔️", title: "PVP Mode", desc: "Compete with friends" },
    { icon: "🏆", title: "Player Stats", desc: "Deep performance analysis" }
  ];

  return (
    <section
      className="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        color: "white",
        textAlign: "center",
        padding: "60px 20px",
        boxSizing: "border-box",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        zIndex: 1,
        overflow: "hidden"
      }}
    >
      {/* Floating cricket balls */}
      <FloatingBall delay={0} size={20} left={10} duration={8} />
      <FloatingBall delay={2} size={15} left={25} duration={10} />
      <FloatingBall delay={4} size={25} left={75} duration={9} />
      <FloatingBall delay={6} size={18} left={90} duration={11} />
      <FloatingBall delay={3} size={22} left={50} duration={7} />

      {/* Left Side - Hand with Bat */}
      <motion.div
        className="bat-hand"
        style={{
          position: "absolute",
          left: "-80px",
          top: "35%",
          transform: "translateY(-50%)",
          zIndex: 10,
          overflow: "hidden",
          width: "400px",
          height: "500px"
        }}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 80 }}
      >
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src="/cricket-hands.png-removebg-preview.png" 
            alt="Hand holding cricket bat"
            style={{
              width: "1100px",
              height: "auto",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Right Side - Hand Catching Ball */}
      <motion.div
        className="ball-hand"
        style={{
          position: "absolute",
          right: "-50px",
          top: "35%",
          transform: "translateY(-50%)",
          zIndex: 10
        }}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 1, type: "spring", stiffness: 80 }}
      >
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="/cricket-hands.png-removebg-preview.png" 
            alt="Hand catching ball"
            style={{
              width: "1000px",
              height: "auto",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
              clipPath: "inset(0 0 0 68%)"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Main content - SINGLE GLASS CARD */}
      <motion.div 
        style={{ 
          maxWidth: 1000, 
          position: "relative", 
          zIndex: 2,
          padding: "50px 60px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(14, 165, 233, 0.06) 50%, rgba(139, 92, 246, 0.08) 100%)",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.15), 0 0 80px rgba(16, 185, 129, 0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden"
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated border glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "32px",
          padding: "1px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(14, 165, 233, 0.5), rgba(139, 92, 246, 0.5))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          animation: "borderGlow 3s ease-in-out infinite"
        }} />
        
        {/* Corner accents */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "50px",
            padding: "8px 20px",
            marginBottom: "24px",
            fontSize: "0.9rem",
            color: "#10b981",
            position: "relative",
            zIndex: 1
          }}
        >
          <span style={{ animation: "pulse 2s infinite" }}>🔴</span>
          <span>IPL 2026 Season Ready</span>
          <span style={{ 
            background: "#10b981", 
            color: "#000", 
            padding: "2px 8px", 
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600
          }}>NEW</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          style={{ 
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
            margin: 0, 
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "16px",
            position: "relative",
            zIndex: 1
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span style={{ display: "block", marginBottom: "8px" }}>Welcome to</span>
          <span style={{
            background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block"
          }}>
            Wicketly.AI
          </span>
        </motion.h1>

        {/* Typing tagline */}
        <motion.p 
          style={{ 
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", 
            marginTop: "20px", 
            opacity: 0.9, 
            fontWeight: 500,
            minHeight: "36px",
            color: "rgba(255,255,255,0.85)",
            position: "relative",
            zIndex: 1
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <TypeWriter texts={taglines} speed={80} deleteSpeed={40} pauseTime={2500} />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "40px",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "16px 36px",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)"
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Get Started</span>
            <span>→</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "16px 36px",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backdropFilter: "blur(10px)"
            }}
          >
            <span>▶</span>
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          margin: "40px 0",
          position: "relative",
          zIndex: 1
        }} />

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          position: "relative",
          zIndex: 1
        }}>
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              style={{ 
                textAlign: "center",
                padding: "16px",
                cursor: "pointer"
              }}
            >
              <div style={{ 
                fontSize: "clamp(2rem, 4vw, 2.8rem)", 
                fontWeight: 800,
                background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 50%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
              </div>
              <div style={{ 
                fontSize: "0.85rem", 
                color: "rgba(255,255,255,0.7)", 
                marginTop: "8px",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          margin: "30px 0",
          position: "relative",
          zIndex: 1
        }} />

        {/* Features Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          position: "relative",
          zIndex: 1
        }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + idx * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                background: "rgba(255,255,255,0.08)"
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "18px 20px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                {feature.icon}
              </div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.95)"
                }}>{feature.title}</div>
                <div style={{ 
                  fontSize: "0.8rem", 
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "2px"
                }}>{feature.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.6
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2, duration: 0.5 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <span style={{ fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div style={{
          width: "24px",
          height: "40px",
          border: "2px solid rgba(255,255,255,0.3)",
          borderRadius: "12px",
          position: "relative"
        }}>
          <motion.div
            style={{
              width: "4px",
              height: "8px",
              background: "#10b981",
              borderRadius: "2px",
              position: "absolute",
              left: "50%",
              top: "8px",
              transform: "translateX(-50%)"
            }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* CSS for typing cursor and animations */}
      <style>{`
        .typing-cursor {
          animation: blink 1s infinite;
          color: #10b981;
          font-weight: 400;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes batSwing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @media (max-width: 1200px) {
          .bat-hand, .ball-hand {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
