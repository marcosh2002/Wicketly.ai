import React, { useMemo, memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBackground = memo(() => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024 && window.innerWidth >= 768);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width < 1024 && width >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine animation counts based on device type
  const getAnimationCounts = () => {
    if (isMobile) {
      return { lines: 6, nodes: 4, lights: 6, particles: 12 };
    }
    if (isTablet) {
      return { lines: 10, nodes: 6, lights: 9, particles: 18 };
    }
    return { lines: 15, nodes: 8, lights: 12, particles: 25 };
  };

  const counts = getAnimationCounts();

  // Generate neural network coordinates once
  const neuralLines = useMemo(() => {
    return [...Array(counts.lines)].map((_, i) => ({
      id: i,
      x1: Math.random() * 1000,
      y1: Math.random() * 1000,
      x2: Math.random() * 1000,
      y2: Math.random() * 1000,
      x1Target: Math.random() * 1000,
      x2Target: Math.random() * 1000,
      duration: isMobile ? 8 + Math.random() * 4 : 6 + Math.random() * 4,
    }));
  }, [counts.lines, isMobile]);

  const neuralNodes = useMemo(() => {
    return [...Array(counts.nodes)].map((_, i) => ({
      id: i,
      cx: Math.random() * 1000,
      cy: Math.random() * 1000,
      duration: isMobile ? 4 + Math.random() * 4 : 3 + Math.random() * 3,
    }));
  }, [counts.nodes, isMobile]);

  const stadiumLights = useMemo(() => {
    return [...Array(counts.lights)].map((_, i) => ({
      id: i,
      top: (i * 25) % 100,
      left: (i * 30) % 100,
      duration: isMobile ? 5 + Math.random() * 3 : 4 + Math.random() * 3,
      delay: i * (isMobile ? 0.5 : 0.4),
    }));
  }, [counts.lights, isMobile]);

  const particles = useMemo(() => {
    return [...Array(counts.particles)].map((_, i) => ({
      id: i,
      size: 2 + Math.random() * (isMobile ? 3 : 4),
      top: Math.random() * 100,
      left: Math.random() * 100,
      yTarget: Math.random() * (isMobile ? 250 : 400) - (isMobile ? 125 : 200),
      xTarget: Math.random() * (isMobile ? 60 : 100) - (isMobile ? 30 : 50),
      duration: isMobile ? 7 + Math.random() * 5 : 5 + Math.random() * 5,
      delay: i * (isMobile ? 0.2 : 0.15),
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, [counts.particles, isMobile]);

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
          opacity: isMobile ? 0.1 : 0.15,
          pointerEvents: "none",
        }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
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
            style={{
              willChange: "opacity",
              WebkitFontSmoothing: "antialiased",
            }}
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
            style={{
              willChange: "opacity",
              WebkitFontSmoothing: "antialiased",
            }}
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
              width: isMobile ? "100px" : "150px",
              height: isMobile ? "100px" : "150px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)`,
              filter: isMobile ? "blur(25px)" : "blur(40px)",
              top: `${light.top}%`,
              left: `${light.left}%`,
              pointerEvents: "none",
              willChange: "opacity, transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
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
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
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

  // Aurora/Northern Lights Effect
  const AuroraEffect = () => {
    const auroraWaves = [
      { color: "rgba(16, 185, 129, 0.15)", delay: 0, duration: 15 },
      { color: "rgba(14, 165, 233, 0.12)", delay: 2, duration: 18 },
      { color: "rgba(139, 92, 246, 0.1)", delay: 4, duration: 20 },
    ];

    return (
      <>
        {auroraWaves.map((wave, index) => (
          <motion.div
            key={`aurora-${index}`}
            style={{
              position: "absolute",
              top: "-50%",
              left: "-25%",
              width: "150%",
              height: "100%",
              background: `linear-gradient(180deg, transparent 0%, ${wave.color} 50%, transparent 100%)`,
              filter: isMobile ? "blur(60px)" : "blur(80px)",
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            animate={{
              x: ["-10%", "10%", "-10%"],
              y: ["0%", "20%", "0%"],
              rotate: [-5, 5, -5],
              opacity: [0.3, 0.6, 0.3],
              scaleY: [1, 1.3, 1],
            }}
            transition={{
              duration: isMobile ? wave.duration * 1.3 : wave.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: wave.delay,
            }}
          />
        ))}
      </>
    );
  };

  // Mesh Gradient Blobs - Glassmorphism style
  const MeshGradientBlobs = () => {
    const blobs = useMemo(() => [
      { 
        size: isMobile ? 300 : 500, 
        top: "10%", 
        left: "5%", 
        colors: ["rgba(16, 185, 129, 0.25)", "rgba(6, 182, 212, 0.15)"],
        duration: 25
      },
      { 
        size: isMobile ? 250 : 400, 
        top: "60%", 
        left: "70%", 
        colors: ["rgba(139, 92, 246, 0.2)", "rgba(236, 72, 153, 0.1)"],
        duration: 30
      },
      { 
        size: isMobile ? 200 : 350, 
        top: "30%", 
        left: "50%", 
        colors: ["rgba(14, 165, 233, 0.2)", "rgba(16, 185, 129, 0.1)"],
        duration: 22
      },
    ], [isMobile]);

    return (
      <>
        {blobs.map((blob, index) => (
          <motion.div
            key={`blob-${index}`}
            style={{
              position: "absolute",
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, ${blob.colors[0]} 0%, ${blob.colors[1]} 50%, transparent 70%)`,
              filter: isMobile ? "blur(40px)" : "blur(60px)",
              top: blob.top,
              left: blob.left,
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.5, 0.7, 0.4, 0.5],
            }}
            transition={{
              duration: isMobile ? blob.duration * 1.2 : blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 3,
            }}
          />
        ))}
      </>
    );
  };

  // Hexagon Grid Pattern - Modern honeycomb overlay
  const HexagonGrid = () => {
    const hexSize = isMobile ? 30 : 45;
    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="hexagons"
            width={hexSize * 1.5}
            height={hexSize * 1.732}
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <polygon
              points={`${hexSize * 0.5},0 ${hexSize * 1.5},0 ${hexSize * 2},${hexSize * 0.866} ${hexSize * 1.5},${hexSize * 1.732} ${hexSize * 0.5},${hexSize * 1.732} 0,${hexSize * 0.866}`}
              fill="none"
              stroke="rgba(16, 185, 129, 0.5)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    );
  };

  // Subtle Grid Pattern - Tech/Futuristic overlay (kept for layering)
  const GridPattern = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? "40px 40px" : "60px 60px",
          pointerEvents: "none",
          opacity: 0.3,
        }}
      />
    );
  };

  // Data Stream Animation - AI/Prediction theme
  const DataStreams = () => {
    const streamCount = isMobile ? 8 : 15;
    const streams = useMemo(() => 
      [...Array(streamCount)].map((_, i) => ({
        id: i,
        left: (i / streamCount) * 100 + Math.random() * 5,
        height: 50 + Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        opacity: 0.1 + Math.random() * 0.2,
      }))
    , [streamCount]);

    return (
      <>
        {streams.map((stream) => (
          <motion.div
            key={`stream-${stream.id}`}
            style={{
              position: "absolute",
              left: `${stream.left}%`,
              top: "-10%",
              width: "2px",
              height: `${stream.height}px`,
              background: `linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, ${stream.opacity}) 50%, transparent 100%)`,
              borderRadius: "2px",
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
            animate={{
              y: ["0vh", "120vh"],
              opacity: [0, stream.opacity, 0],
            }}
            transition={{
              duration: stream.duration,
              repeat: Infinity,
              ease: "linear",
              delay: stream.delay,
            }}
          />
        ))}
      </>
    );
  };

  // Constellation Stars - Twinkling depth effect
  const ConstellationStars = () => {
    const starCount = isMobile ? 30 : 60;
    const stars = useMemo(() => 
      [...Array(starCount)].map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 3,
        maxOpacity: 0.3 + Math.random() * 0.5,
      }))
    , [starCount]);

    return (
      <>
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            style={{
              position: "absolute",
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              backgroundColor: "#fff",
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,
              pointerEvents: "none",
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
            animate={{
              opacity: [0.1, star.maxOpacity, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay,
            }}
          />
        ))}
      </>
    );
  };

  // Shooting Stars - Fast diagonal streaks
  const ShootingStars = () => {
    const shootingStarCount = isMobile ? 3 : 5;
    const shootingStars = useMemo(() => 
      [...Array(shootingStarCount)].map((_, i) => ({
        id: i,
        startX: Math.random() * 100,
        startY: Math.random() * 50,
        length: 80 + Math.random() * 120,
        duration: 1.5 + Math.random() * 1,
        delay: i * 4 + Math.random() * 8,
      }))
    , [shootingStarCount]);

    return (
      <>
        {shootingStars.map((star) => (
          <motion.div
            key={`shooting-${star.id}`}
            style={{
              position: "absolute",
              top: `${star.startY}%`,
              left: `${star.startX}%`,
              width: `${star.length}px`,
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, rgba(16, 185, 129, 1) 100%)",
              borderRadius: "2px",
              transform: "rotate(45deg)",
              transformOrigin: "left center",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
            animate={{
              x: ["0vw", "100vw"],
              y: ["0vh", "100vh"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeIn",
              delay: star.delay,
              repeatDelay: 8 + Math.random() * 12,
            }}
          />
        ))}
      </>
    );
  };

  // Noise/Grain Texture - Subtle film grain for premium depth
  const NoiseTexture = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    );
  };

  // Pulsing Radar Rings - AI scanning effect
  const RadarRings = () => {
    const ringCount = isMobile ? 2 : 3;
    return (
      <>
        {[...Array(ringCount)].map((_, i) => (
          <motion.div
            key={`radar-${i}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: isMobile ? "300px" : "500px",
              height: isMobile ? "300px" : "500px",
              borderRadius: "50%",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
            animate={{
              scale: [0, 3],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: isMobile ? 5 : 4,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * (isMobile ? 2 : 1.5),
            }}
          />
        ))}
      </>
    );
  };

  // Light Rays - Dramatic beams from corners
  const LightRays = () => {
    const rays = [
      { top: "0%", left: "0%", rotate: 45, width: isMobile ? 200 : 400 },
      { top: "0%", left: "100%", rotate: 135, width: isMobile ? 150 : 300 },
      { top: "100%", left: "0%", rotate: -45, width: isMobile ? 180 : 350 },
    ];

    return (
      <>
        {rays.map((ray, i) => (
          <motion.div
            key={`ray-${i}`}
            style={{
              position: "absolute",
              top: ray.top,
              left: ray.left,
              width: `${ray.width}px`,
              height: "2px",
              background: `linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, transparent 100%)`,
              transform: `rotate(${ray.rotate}deg)`,
              transformOrigin: "left center",
              filter: "blur(3px)",
              pointerEvents: "none",
              willChange: "opacity",
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scaleX: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </>
    );
  };

  // Floating Geometric Shapes - Rotating hexagons/triangles
  const FloatingShapes = () => {
    const shapeCount = isMobile ? 4 : 8;
    const shapes = useMemo(() => 
      [...Array(shapeCount)].map((_, i) => ({
        id: i,
        type: i % 2 === 0 ? 'hexagon' : 'triangle',
        size: 20 + Math.random() * 30,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 15 + Math.random() * 10,
        rotationDuration: 10 + Math.random() * 15,
        delay: Math.random() * 5,
      }))
    , [shapeCount]);

    return (
      <>
        {shapes.map((shape) => (
          <motion.div
            key={`shape-${shape.id}`}
            style={{
              position: "absolute",
              top: `${shape.top}%`,
              left: `${shape.left}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: shape.type === 'hexagon' ? "25%" : "0%",
              clipPath: shape.type === 'triangle' ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translateZ(0)",
            }}
            animate={{
              rotate: [0, 360],
              y: [-20, 20, -20],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              rotate: {
                duration: shape.rotationDuration,
                repeat: Infinity,
                ease: "linear",
              },
              y: {
                duration: shape.duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: shape.duration / 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: shape.delay,
              },
            }}
          />
        ))}
      </>
    );
  };

  // Color Cycling Orbs - Smooth hue-shifting glowing orbs
  const ColorCyclingOrbs = () => {
    const orbCount = isMobile ? 2 : 4;
    const orbs = useMemo(() => 
      [...Array(orbCount)].map((_, i) => ({
        id: i,
        size: isMobile ? 100 + Math.random() * 50 : 150 + Math.random() * 100,
        top: 20 + (i * 25) % 60,
        left: 10 + (i * 30) % 80,
        duration: 8 + Math.random() * 4,
      }))
    , [orbCount, isMobile]);

    return (
      <>
        {orbs.map((orb) => (
          <motion.div
            key={`orb-${orb.id}`}
            style={{
              position: "absolute",
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              filter: isMobile ? "blur(30px)" : "blur(50px)",
              pointerEvents: "none",
              willChange: "transform, opacity, filter",
              transform: "translateZ(0)",
            }}
            animate={{
              background: [
                "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              ],
              scale: [1, 1.2, 1],
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.id * 2,
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
      background: "linear-gradient(135deg, #030712 0%, #0c1222 25%, #0f172a 50%, #0c1222 75%, #030712 100%)",
      zIndex: -1,
      overflow: "hidden",
      pointerEvents: "none",
      willChange: "transform",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      perspective: "1000px",
    }}>
      {/* Aurora Effect - Base layer */}
      <AuroraEffect />

      {/* Constellation Stars - Background depth */}
      <ConstellationStars />

      {/* Shooting Stars - Fast diagonal streaks */}
      <ShootingStars />

      {/* Color Cycling Orbs - Hue-shifting glow */}
      <ColorCyclingOrbs />

      {/* Mesh Gradient Blobs */}
      <MeshGradientBlobs />

      {/* Light Rays - Dramatic corner beams */}
      <LightRays />

      {/* Grid Pattern Overlay */}
      <GridPattern />

      {/* Hexagon Grid - Modern honeycomb */}
      <HexagonGrid />

      {/* Floating Geometric Shapes */}
      <FloatingShapes />

      {/* Data Streams - AI theme */}
      <DataStreams />

      {/* Radar Rings - AI scanning effect */}
      <RadarRings />

      {/* Neural Network */}
      <NeuralNetwork />
      
      {/* Stadium Lights - Skip on very small screens */}
      {!isMobile && <StadiumLights />}
      
      {/* Particles */}
      <Particles />

      {/* Noise Texture - Film grain */}
      <NoiseTexture />

      {/* Vignette Effect - Cinematic dark edges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';
export default AnimatedBackground;
