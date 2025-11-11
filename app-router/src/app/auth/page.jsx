"use client";
import { Box } from "@mui/material";
import React from "react";
import Login from "./login/page";
// import Login from "./login";

const Login_Page = ({ onNavigate }) => {
    return (
        <Box>
            <Login onNavigate={onNavigate} />
        </Box>
    );
};

export default Login_Page;
