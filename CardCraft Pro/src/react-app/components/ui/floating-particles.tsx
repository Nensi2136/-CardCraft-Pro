import React from "react";
import { motion } from "framer-motion";

export interface FloatingParticlesProps {
  className?: string;
  particleCount?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  className = "",
  particleCount = 20 
}) => {
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
