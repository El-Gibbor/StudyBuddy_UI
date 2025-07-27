import React from 'react';

const Input = ({ 
  label, 
  error, 
  helpText,
  className = '',
  required = false,
  ...props 
}) => {
  const baseInputStyles = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-navy focus:border-navy';
  const errorInputStyles = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  const inputClassName = `${baseInputStyles} ${error ? errorInputStyles : ''} ${className}`;
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  error, 
  helpText,
  className = '',
  required = false,
  rows = 3,
  ...props 
}) => {
  const baseTextareaStyles = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-navy focus:border-navy';
  const errorTextareaStyles = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  const textareaClassName = `${baseTextareaStyles} ${error ? errorTextareaStyles : ''} ${className}`;
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={textareaClassName}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  helpText,
  className = '',
  required = false,
  options = [],
  ...props 
}) => {
  const baseSelectStyles = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy';
  const errorSelectStyles = 'border-red-300 focus:ring-red-500 focus:border-red-500';
  
  const selectClassName = `${baseSelectStyles} ${error ? errorSelectStyles : ''} ${className}`;
  
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={selectClassName}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;
