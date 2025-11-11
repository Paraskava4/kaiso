"use client";
import React from "react";

const ServiceItem = ({ title, isActive = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                borderBottom: "0.5px solid #ddd",
                boxSizing: "border-box",
                padding: "16px 20px",
                cursor: "pointer",
                fontWeight: 600,
                lineHeight: 1.375,
                transition: "color 0.3s ease",
                color: isActive ? "#be0021" : "#18181b",
                fontSize: "17px",
            }}
        >
            {title}
        </div>
    );
};

export default ServiceItem;
