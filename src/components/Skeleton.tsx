"use client";

import { motion } from "framer-motion";
import { useAnimations } from "@/hooks/useDeviceDetection";

// Base skeleton props
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

// Individual skeleton component
export function Skeleton({ 
  className = "", 
  variant = "rectangular", 
  width, 
  height,
  animation = "pulse"
}: SkeletonProps) {
  const { shouldAnimate, animationDuration } = useAnimations();
  
  const baseStyles = "bg-slate-700/50";
  
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  
  const animationStyles = {
    pulse: shouldAnimate ? "animate-pulse" : "",
    wave: shouldAnimate ? "skeleton-wave" : "",
    none: "",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
        animationDuration: shouldAnimate ? `${animationDuration}s` : undefined,
      }}
    />
  );
}

// Card skeleton
export function CardSkeleton({ className = "" }: { className?: string }) {
  const { shouldAnimate } = useAnimations();
  
  return (
    <div className={`bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={56} height={56} />
        <Skeleton variant="text" width={60} height={24} />
      </div>
      <Skeleton variant="text" width="60%" height={24} className="mb-2" />
      <Skeleton variant="text" width="80%" height={16} className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height={8} />
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className = "" }: { className?: string }) {
  const { shouldAnimate } = useAnimations();
  
  return (
    <div className={`bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <Skeleton variant="text" width={200} height={24} className="mb-6" />
      <div className="h-64 flex items-end justify-around gap-2">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            initial={shouldAnimate ? { height: "20%" } : false}
            animate={shouldAnimate ? { height: ["20%", "60%", "40%", "70%"] } : false}
            transition={shouldAnimate ? { 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.1,
              ease: "easeInOut"
            } : {}}
          >
            <Skeleton 
              variant="rectangular" 
              width={40} 
              height="100%" 
              className="min-h-[60px]"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Sector card skeleton
export function SectorCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={56} height={56} />
        <Skeleton variant="text" width={50} height={20} />
      </div>
      <Skeleton variant="text" width={100} height={24} className="mb-2" />
      <Skeleton variant="text" width="70%" height={16} className="mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" width="100%" height={8} />
        <Skeleton variant="text" width={40} height={16} />
      </div>
    </div>
  );
}

// Stat card skeleton
export function StatCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div>
          <Skeleton variant="text" width={60} height={32} className="mb-2" />
          <Skeleton variant="text" width={100} height={16} />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4, className = "" }: { columns?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={20} />
      ))}
    </div>
  );
}

// Loading overlay with skeleton
export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  const { shouldAnimate, performanceLevel } = useAnimations();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={shouldAnimate ? { opacity: 0.3 } : false}
            animate={shouldAnimate ? { opacity: [0.3, 1, 0.3] } : false}
            transition={shouldAnimate ? {
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            } : {}}
          >
            <div className="w-3 h-3 rounded-sm bg-yellow-500/60" />
          </motion.div>
        ))}
      </div>
      <Skeleton variant="text" width={200} height={16} />
      {performanceLevel === "low" && (
        <p className="text-xs text-slate-500 mt-2">Low performance mode - advanced animations disabled</p>
      )}
    </div>
  );
}

// Skeleton for text paragraphs
export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          width={i === lines - 1 ? "70%" : "100%"} 
          height={16} 
        />
      ))}
    </div>
  );
}

// Dashboard skeleton layout
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header skeleton */}
      <div className="text-center py-8">
        <Skeleton variant="circular" width={16} height={16} className="mx-auto mb-4" />
        <Skeleton variant="text" width={300} height={40} className="mx-auto mb-4" />
        <Skeleton variant="text" width={500} height={20} className="mx-auto" />
-3      </div>

      {/* Sector cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <SectorCardSkeleton key={i} />
        ))}
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {[...Array(3)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart skeleton */}
      <ChartSkeleton />
    </div>
  );
}
