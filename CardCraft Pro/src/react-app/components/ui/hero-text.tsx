import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/react-app/lib/utils";

export interface HeroTextProps {
  text: string;
  className?: string;
}

export const HeroText: React.FC<HeroTextProps> = ({ text, className }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap gap-2 justify-center", className)}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
