import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => (
  <div className={`text-center py-8 ${className}`}>
    {Icon && (
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    )}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 mb-4">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
