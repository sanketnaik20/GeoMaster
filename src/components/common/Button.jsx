import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  return (
    <button
      className={`${variant}-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={18} className="btn-icon" />}
      {children}
    </button>
  );
};

export default Button;
