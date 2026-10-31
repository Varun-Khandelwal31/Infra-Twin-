'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VengenceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'rose' | 'emerald' | 'amber' | 'purple';
  spotlight?: boolean;
  tilt3d?: boolean;
}

export default function VengenceCard({
  children,
  className,
  glowColor = 'cyan',
  spotlight = true,
  tilt3d = true,
  ...props
}: VengenceCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlight) {
      setMousePos({ x, y });
    }

    if (tilt3d) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Gentle 3D tilt
      const rX = ((y - centerY) / centerY) * -5;
      const rY = ((x - centerX) / centerX) * 5;
      setRotateX(rX);
      setRotateY(rY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const glowStyles = {
    cyan: 'border-slate-800/90 hover:border-cyan-500/50 shadow-2xl hover:shadow-cyan-glow/20',
    rose: 'border-slate-800/90 hover:border-rose-500/50 shadow-2xl hover:shadow-rose-500/20',
    emerald: 'border-slate-800/90 hover:border-emerald-500/50 shadow-2xl hover:shadow-emerald-500/20',
    amber: 'border-slate-800/90 hover:border-amber-500/50 shadow-2xl hover:shadow-amber-500/20',
    purple: 'border-slate-800/90 hover:border-purple-500/50 shadow-2xl hover:shadow-purple-500/20',
  };

  const spotlightGlows = {
    cyan: 'rgba(0, 217, 255, 0.15)',
    rose: 'rgba(239, 68, 68, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.15)',
    amber: 'rgba(245, 158, 11, 0.15)',
    purple: 'rgba(168, 85, 247, 0.15)',
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered && tilt3d ? rotateX : 0,
        rotateY: isHovered && tilt3d ? rotateY : 0,
        y: isHovered ? -3 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn(
        'relative rounded-2xl bg-[#111726]/90 backdrop-blur-xl border transition-colors duration-200 overflow-hidden group text-slate-100',
        glowStyles[glowColor],
        className
      )}
      {...(props as any)}
    >
      {/* Hairline top light highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none z-10" />

      {/* Radial Spotlight Glow Layer */}
      {spotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightGlows[glowColor]}, transparent 70%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
