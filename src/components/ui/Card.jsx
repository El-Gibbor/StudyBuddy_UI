import React from 'react';

const Card = ({ children, className = '', padding = 'md', shadow = 'sm', hover = false }) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200';
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const hoverEffect = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const combinedClassName = `${baseStyles} ${shadows[shadow]} ${paddings[padding]} ${hoverEffect} ${className}`;
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
