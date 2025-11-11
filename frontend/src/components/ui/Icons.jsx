"use client";
import React from 'react';

const Icons = ({ className = '', type = 'dropdown', size = 20, color = '#999999' }) => {
  const iconStyles = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-block',
  };

  const renderIcon = () => {
    switch (type) {
      case 'dropdown':
        return (
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={iconStyles}
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke={color} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'arrow-right':
        return (
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={iconStyles}
          >
            <path 
              d="M21 12L16 7M21 12L16 17M21 12H3" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={iconStyles}
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke={color} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <span className={className}>
      {renderIcon()}
    </span>
  );
};

export default Icons;
