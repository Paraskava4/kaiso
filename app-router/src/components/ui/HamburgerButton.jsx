"use client";

import React from 'react';

const HamburgerButton = ({ isOpen, onClick, style }) => {
  return (
    <button
      className={`mobile-menu-button ${isOpen ? 'active' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      style={style}
    >
      <div className="hamburger-icon">
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
    </button>
  );
};

export default HamburgerButton;
