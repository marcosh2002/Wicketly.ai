import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const AnimatedBackground = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const neuralLines = useMemo(
    () =>
      [...Array(28)].map((_, index) => ({
        id: index,
        x1: Math.random() * 1000,
        y1: Math.random() * 1000,
        x2: Math.random() * 1000,
        y2: Math.random() * 1000,
        x1Target: Math.random() * 1000,
        y1Target: Math.random() * 1000,
        x2Target: Math.random() * 1000,
        y2Target: Math.random() * 1000,
        width: 1.1 + Math.random() * 1.3,
        duration: 2.8 + Math.random() * 2.2,
      })),
    []
  );

  const neuralNodes = useMemo(
    () =>
      [...Array(20)].map((_, index) => ({
        id: index,
        cx: Math.random() * 1000,
        cy: Math.random() * 1000,
        radius: 2 + Math.random() * 2.5,
        duration: 1.4 + Math.random() * 1.6,
      })),
    []
  );

  const stadiumLights = useMemo(
    () =>
      [...Array(12)].map((_, index) => ({
        id: index,
        top: (index * 25) % 100,
        left: (index * 30) % 100,
        duration: 1.8 + Math.random() * 1.4,
        delay: index * 0.16,
      })),
    []
  );

  const particles = useMemo(
    () =>
      [...Array(42)].map((_, index) => ({
        id: index,
        size: 2 + Math.random() * 4,
        top: Math.random() * 100,
        left: Math.random() * 100,
        yTarget: Math.random() * 400 - 200,
        xTarget: Math.random() * 100 - 50,
        duration: 2.2 + Math.random() * 2,
        delay: index * 0.05,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  const auroraBlobs = useMemo(
    () =>
      [...Array(5)].map((_, index) => ({
        id: index,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 220 + Math.random() * 260,
        xTarget: Math.random() * 220 - 110,
        yTarget: Math.random() * 220 - 110,
        duration: 6 + Math.random() * 4,
        delay: index * 0.45,
      })),
    []
  );

  const energyBeams = useMemo(
    () =>
      [...Array(6)].map((_, index) => ({
        id: index,
        top: 8 + index * 15,
        duration: 2.3 + Math.random() * 1.2,
        delay: index * 0.2,
        skew: -18 + Math.random() * 36,
      })),
    []
  );

  const premiumFlares = useMemo(
    () =>
      [...Array(3)].map((_, index) => ({
        id: index,
        top: 18 + index * 30,
        left: 12 + index * 34,
        size: 180 + index * 70,
        duration: 5.2 + index * 1.4,
        delay: index * 0.35,
      })),
    []
  );

  const NeuralNetwork = () => (
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        opacity: 0.22,
      }}
      viewBox="0 0 1000 1000"
    >
      <defs>
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" />
          <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {neuralLines.map((line) => (
        <motion.line
          key={`line-${line.id}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#neuralGrad)"
          strokeWidth={line.width}
          animate={{
            opacity: [0.28, 0.72, 0.28],
            x1: [line.x1, line.x1Target],
            y1: [line.y1, line.y1Target],
            x2: [line.x2, line.x2Target],
            y2: [line.y2, line.y2Target],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : line.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {neuralNodes.map((node) => (
        <motion.circle
          key={`node-${node.id}`}
          cx={node.cx}
          cy={node.cy}
          r={node.radius}
          fill="#22d3ee"
          animate={{
            opacity: [0.24, 0.82, 0.24],
            r: [node.radius, node.radius + 3.2, node.radius],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : node.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: node.id * 0.3,
          }}
        />
      ))}
    </svg>
  );

  const StadiumLights = () => (
    <>
      {stadiumLights.map((light) => (
        <motion.div
          key={`light-${light.id}`}
          style={{
            position: "absolute",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(34, 211, 238, 0) 72%)",
            filter: "blur(30px)",
            top: `${light.top}%`,
            left: `${light.left}%`,
          }}
          animate={{
            opacity: [0.2, 0.72, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : light.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: light.delay,
          }}
        />
      ))}
    </>
  );

  const Particles = () => (
    <>
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          style={{
            position: "absolute",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: `rgba(16, 185, 129, ${particle.opacity})`,
            boxShadow: "0 0 10px rgba(34, 211, 238, 0.72)",
            filter: "blur(0px)",
            top: `${particle.top}%`,
            left: `${particle.left}%`,
          }}
          animate={{
            y: [-30, particle.yTarget],
            x: [0, particle.xTarget],
            opacity: [0, 0.82, 0],
            scale: [0.88, 1.16, 0.84],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : particle.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </>
  );

  const AuroraLayer = () => (
    <>
      {auroraBlobs.map((blob) => (
        <motion.div
          key={`aurora-${blob.id}`}
          style={{
            position: "absolute",
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(34, 211, 238, 0.2) 45%, rgba(59, 130, 246, 0.08) 70%, rgba(16, 185, 129, 0) 82%)",
            filter: "blur(20px)",
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, blob.xTarget, 0],
            y: [0, blob.yTarget, 0],
            opacity: [0.15, 0.58, 0.15],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : blob.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}
    </>
  );

  const EnergyBeams = () => (
    <>
      {energyBeams.map((beam) => (
        <motion.div
          key={`beam-${beam.id}`}
          style={{
            position: "absolute",
            width: "42%",
            height: "1.5px",
            top: `${beam.top}%`,
            left: "-45%",
            transform: `skewX(${beam.skew}deg)`,
            background:
              "linear-gradient(90deg, rgba(34, 211, 238, 0) 0%, rgba(34, 211, 238, 1) 50%, rgba(16, 185, 129, 0) 100%)",
            filter: "blur(0.4px)",
            boxShadow: "0 0 36px rgba(34, 211, 238, 0.8)",
            pointerEvents: "none",
          }}
          animate={{
            x: ["0%", "320%"],
            opacity: [0, 0.86, 0],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : beam.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: beam.delay,
          }}
        />
      ))}
    </>
  );

  const PulseRings = () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={`ring-${ring}`}
          style={{
            position: "absolute",
            width: 280 + ring * 180,
            height: 280 + ring * 180,
            borderRadius: "50%",
            border: "1px solid rgba(34, 211, 238, 0.28)",
            boxShadow: "0 0 52px rgba(34, 211, 238, 0.28)",
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.16, 0.46, 0.16],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 2.6 + ring * 0.8,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: ring * 0.6,
          }}
        />
      ))}
    </div>
  );

  const PremiumFlares = () => (
    <>
      {premiumFlares.map((flare) => (
        <motion.div
          key={`premium-flare-${flare.id}`}
          style={{
            position: "absolute",
            width: `${flare.size}px`,
            height: `${flare.size}px`,
            top: `${flare.top}%`,
            left: `${flare.left}%`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(34, 211, 238, 0.2) 24%, rgba(96, 165, 250, 0.08) 42%, rgba(255,255,255,0) 68%)",
            filter: "blur(9px)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
          animate={{
            opacity: [0.12, 0.45, 0.12],
            scale: [1, 1.16, 1],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : flare.duration,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "easeInOut",
            delay: flare.delay,
          }}
        />
      ))}
    </>
  );

  const TacticalGrid = () => (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(34, 211, 238, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)",
        backgroundSize: "64px 64px, 64px 64px",
        mixBlendMode: "screen",
      }}
      animate={{
        opacity: [0.05, 0.12, 0.05],
        backgroundPosition: [
          "0px 0px, 0px 0px",
          "0px 48px, 48px 0px",
          "0px 0px, 0px 0px",
        ],
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 12,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const EdgeGlow = () => (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "linear-gradient(90deg, rgba(34,211,238,0.24) 0%, rgba(34,211,238,0) 12%, rgba(34,211,238,0) 88%, rgba(34,211,238,0.24) 100%), linear-gradient(180deg, rgba(96,165,250,0.16) 0%, rgba(96,165,250,0) 16%, rgba(96,165,250,0) 84%, rgba(96,165,250,0.16) 100%)",
        mixBlendMode: "screen",
      }}
      animate={{ opacity: [0.14, 0.34, 0.14] }}
      transition={{
        duration: shouldReduceMotion ? 0 : 4.4,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(130% 130% at 20% 8%, #111827 0%, #070d17 34%, #04070f 68%, #02040a 100%)",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(46% 36% at 50% 55%, rgba(34, 211, 238, 0.42) 0%, rgba(16, 185, 129, 0.2) 36%, rgba(0,0,0,0) 72%)",
        }}
        animate={{ opacity: [0.28, 0.72, 0.28], scale: [1, 1.05, 1] }}
        transition={{
          duration: shouldReduceMotion ? 0 : 2.4,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <AuroraLayer />
      <TacticalGrid />
      <PremiumFlares />
      <EnergyBeams />
      <NeuralNetwork />
      <PulseRings />
      <StadiumLights />
      <Particles />

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "conic-gradient(from 220deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(34, 211, 238, 0.1) 74deg, rgba(255,255,255,0) 138deg, rgba(16, 185, 129, 0.07) 220deg, rgba(255,255,255,0) 360deg)",
          mixBlendMode: "screen",
        }}
        animate={{ rotate: [0, 18, 0], opacity: [0.22, 0.42, 0.22] }}
        transition={{
          duration: shouldReduceMotion ? 0 : 9,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 18%, rgba(0,0,0,0.44) 100%)",
        }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{
          duration: shouldReduceMotion ? 0 : 3.2,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.24) 72%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <EdgeGlow />
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";
export default AnimatedBackground;
