import React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/react-app/lib/utils";

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ className, children }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(
      useMotionTemplate`calc(${mouseY} * 5deg)`,
      { stiffness: 400, damping: 30 }
    );
    const rotateY = useSpring(
      useMotionTemplate`calc(${mouseX} * 5deg)`,
      { stiffness: 400, damping: 30 }
    );

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - left) / width - 0.5;
      const y = (event.clientY - top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg dark:from-gray-800 dark:to-gray-900",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: "translateZ(20px)",
          }}
        />
        <div style={{ transform: "translateZ(30px)" }}>{children}</div>
      </motion.div>
    );
  }
);

Card3D.displayName = "Card3D";

export { Card3D };
