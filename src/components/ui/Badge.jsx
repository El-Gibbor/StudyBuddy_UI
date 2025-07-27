import React from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, User, Ticket } from 'lucide-react';
import { getStatusColor, getPriorityColor, formatStatus } from '../../utils/formatters';

export const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const getStatusIcon = (status) => {
    const iconClass = "w-4 h-4";
    switch (status?.toLowerCase()) {
      case 'open':
        return <AlertCircle className={iconClass} />;
      case 'claimed':
      case 'in_progress':
        return <Clock className={iconClass} />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className={iconClass} />;
      default:
        return <Ticket className={iconClass} />;
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {showIcon && getStatusIcon(status)}
      <span>{formatStatus(status)}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)} ${className}`}>
    {priority?.toUpperCase()}
  </span>
);

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-navy text-white',
    secondary: 'bg-gray-200 text-gray-900',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
