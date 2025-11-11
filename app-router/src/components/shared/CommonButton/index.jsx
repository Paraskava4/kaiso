"use client";
import React from "react";
import { CircularProgress } from "@mui/material";

const CommonButton = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    variant = "primary",
    loading = false,
    startIcon,
    endIcon,
    className = "",
    size = "medium",
    fullWidth = false,
}) => {
  const sizeClasses = {
    small: "px-2 sm:px-3 py-1.5 text-xs sm:text-sm",
    medium: "px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base",
    large: "px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg",
  };

  const baseClasses = `
    overflow-hidden gap-2 sm:gap-2.5 font-medium leading-none text-center
    rounded-md border border-solid min-w-[120px] sm:min-w-[180px] lg:min-w-[220px]
    transition-colors focus:ring-2 focus:ring-offset-2
    inline-flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variantClasses = {
        primary: `
      border-[color:var(--Border,rgba(77,77,77,0.30))]
      text-zinc-600 hover:bg-gray-50
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
        secondary: `
      border-[color:var(--Border,rgba(77,77,77,0.30))]
      text-zinc-600 hover:bg-gray-50
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
        danger: `
      border-[color:var(--Border,rgba(255,0,0,0.5))]
      text-red-700 hover:bg-red-100
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseClasses}
        ${fullWidth ? "w-full" : ""}
        ${sizeClasses[size]}
        ${variantClasses[variant] || variantClasses["primary"]}
        ${className}
      `}
        >
            {startIcon && !loading && <span className="mr-2">{startIcon}</span>}
            {loading ? <CircularProgress size={20} color="inherit" className="mr-2" /> : children}
            {endIcon && !loading && <span className="ml-2">{endIcon}</span>}
        </button>
    );
};

export default CommonButton;
export { CommonButton };
