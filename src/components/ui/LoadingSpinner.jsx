import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  return (
    <div className={`animate-spin ${sizes[size]} ${className}`}>
      <svg fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingCard = ({ message = "Loading..." }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-center space-x-3">
      <LoadingSpinner />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
    <div className="flex items-center space-x-3">
      <LoadingSpinner />
      <span className="text-gray-600">{message}</span>
    </div>
  </div>
);

export default LoadingSpinner;
