import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";

const AnimatedBackground = memo(() => {
  // Generate neural network coordinates once
  const neuralLines = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      x1: Math.random() * 1000,
      y1: Math.random() * 1000,
      x2: Math.random() * 1000,
      y2: Math.random() * 1000,
      x1Target: Math.random() * 1000,
      x2Target: Math.random() * 1000,
      duration: 6 + Math.random() * 4,
    }));
  }, []);

  const neuralNodes = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      cx: Math.random() * 1000,
      cy: Math.random() * 1000,
      duration: 3 + Math.random() * 3,
    }));
  }, []);

  const stadiumLights = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      top: (i * 25) % 100,
      left: (i * 30) % 100,
      duration: 4 + Math.random() * 3,
      delay: i * 0.4,
    }));
  }, []);

  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      top: Math.random() * 100,
      left: Math.random() * 100,
      yTarget: Math.random() * 400 - 200,
      xTarget: Math.random() * 100 - 50,
      duration: 5 + Math.random() * 5,
      delay: i * 0.15,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

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
        {neuralLines.map((line) => (
          <motion.line
            key={`line-${line.id}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#neuralGrad)"
            strokeWidth="1"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              x1: [line.x1, line.x1Target],
              x2: [line.x2, line.x2Target],
            }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Network nodes */}
        {neuralNodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="#10b981"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              r: [3, 5, 3],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.id * 0.3,
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
        {stadiumLights.map((light) => (
          <motion.div
            key={`light-${light.id}`}
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)`,
              filter: "blur(40px)",
              top: `${light.top}%`,
              left: `${light.left}%`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: light.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: light.delay,
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
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            style={{
              position: "absolute",
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: "50%",
              background: `rgba(16, 185, 129, ${particle.opacity})`,
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
              top: `${particle.top}%`,
              left: `${particle.left}%`,
            }}
            animate={{
              y: [-20, particle.yTarget],
              x: [0, particle.xTarget],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #0a0e1a 0%, #111820 50%, #0f1419 100%)",
      zIndex: -1,
      overflow: "hidden"
    }}>
      {/* Neural Network */}
      <NeuralNetwork />
      
      {/* Stadium Lights */}
      <StadiumLights />
      
      {/* Particles */}
      <Particles />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;
