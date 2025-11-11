"use client";
import React from "react";
import { Button as MUIButton } from "@mui/material";

const EntityButton = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  const colorMap = {
    primary: {
      variant: "contained",
      color: "error"
    },
    secondary: {
      variant: "outlined",
      color: "inherit"
    }
  };

  const { variant: muiVariant, color } = colorMap[variant] || colorMap.primary;

  return (
    <MUIButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      variant={muiVariant}
      color={color}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default EntityButton;
