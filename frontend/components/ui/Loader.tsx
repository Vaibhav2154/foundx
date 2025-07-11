'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoaderProps {
  variant?: 'default' | 'dots' | 'pulse' | 'spinner' | 'skeleton' | 'bars';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

// Default spinning loader
const SpinnerLoader = ({ size }: { size: string }) => (
  <motion.div
    className={cn(
      'border-2 border-gray-200 border-t-blue-600 rounded-full',
      size === 'sm' && 'w-4 h-4',
      size === 'md' && 'w-8 h-8',
      size === 'lg' && 'w-12 h-12',
      size === 'xl' && 'w-16 h-16'
    )}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);

// Dots loader
const DotsLoader = ({ size }: { size: string }) => {
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('bg-blue-600 rounded-full', dotSize)}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Pulse loader
const PulseLoader = ({ size }: { size: string }) => (
  <motion.div
    className={cn(
      'bg-gradient-to-r from-blue-500 to-purple-600 rounded-full',
      size === 'sm' && 'w-8 h-8',
      size === 'md' && 'w-12 h-12',
      size === 'lg' && 'w-16 h-16',
      size === 'xl' && 'w-20 h-20'
    )}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Bars loader
const BarsLoader = ({ size }: { size: string }) => {
  const barHeight = size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-10';
  const barWidth = size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-2.5';
  
  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={cn('bg-blue-600 rounded-sm', barWidth, barHeight)}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Skeleton loader
const SkeletonLoader = ({ size }: { size: string }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-10';
  
  return (
    <div className="space-y-3 w-full max-w-sm">
      <motion.div
        className={cn('bg-gray-200 rounded-lg w-3/4', height)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={cn('bg-gray-200 rounded-lg w-full', height)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        className={cn('bg-gray-200 rounded-lg w-2/3', height)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const Loader: React.FC<LoaderProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  text,
  fullScreen = false,
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      case 'spinner':
      case 'default':
        return <SpinnerLoader size={size} />;
      case 'bars':
        return <BarsLoader size={size} />;
      case 'skeleton':
        return <SkeletonLoader size={size} />;
      default:
        return <SpinnerLoader size={size} />;
    }
  };

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className
      )}
    >
      {renderLoader()}
      {text && (
        <motion.p
          className={cn(
            'text-gray-600 font-medium',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Advanced loader with custom animations
export const AdvancedLoader = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-200 border-b-purple-500 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  </div>
);

// Page loader with company branding
export const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <motion.div
    className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center space-y-8">
      {/* Logo animation */}
      <motion.div
        className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
        }}
      >
        <span className="text-white font-bold text-2xl">F</span>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">FoundX</h2>
        <p className="text-gray-600">{message}</p>
      </motion.div>
      
      {/* Progress indicator */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  </motion.div>
);

export default Loader;
