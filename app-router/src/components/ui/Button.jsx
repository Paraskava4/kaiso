"use client";
import React from 'react';

const Button = ({ 
  className = '', 
  hover = false, 
  icon = false, 
  text = 'Button', 
  type = 'blue',
  onClick,
  disabled = false,
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: 'var(--font-inter)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      opacity: disabled ? 0.6 : 1,
    };

    const typeStyles = {
      blue: {
        backgroundColor: '#163272',
        color: '#ffffff',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#163272',
        border: '1px solid #163272',
      },
      secondary: {
        backgroundColor: '#f5f5f5',
        color: '#1c1c1c',
      }
    };

    const hoverStyles = hover ? {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(22, 50, 114, 0.3)',
    } : {};

    return {
      ...baseStyles,
      ...typeStyles[type],
      ...hoverStyles,
    };
  };

  return (
    <button
      className={className}
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
      {icon && (
        <span style={{ marginLeft: '8px' }}>
          →
        </span>
      )}
    </button>
  );
};

export default Button;
