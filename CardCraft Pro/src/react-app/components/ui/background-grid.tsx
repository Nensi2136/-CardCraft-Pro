import React from "react";

export interface BackgroundGridProps {
  className?: string;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  return (
    <div 
      className={`fixed inset-0 -z-10 h-full w-full ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(156 163 175 / 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
  );
};
