"use client";
import React from "react";
import { Typography, Box } from "@mui/material";

const EntityFormField = ({ label, required = false, className = "", children }) => {
  return (
    <Box className={className} sx={{ mb: 2 }}>
      {label && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
          {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default EntityFormField;
