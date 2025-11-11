import React from "react";

const FeedbackHeader = ({ title = "Customers Feedback", subtitle = "" }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
            }}
        >
            {/* Main title */}
            <h2
                style={{
                    color: "var(--black-7001-a-1, #1A1A1A)",
                    fontFamily: '"Inter"',
                    fontSize: "32px",
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: "120%" /* 38.4px */,
                    margin: "0",
                }}
            >
                {title}
            </h2>

            {/* Subtitle */}
            <p
                style={{
                    color: "var(--4d4d4d, #4D4D4D)",
                    fontFamily: "Inter",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "160%" /* 28.8px */,
                    textAlign: "center",
                    margin: "0",
                }}
            >
                {subtitle}
            </p>
        </div>
    );
};

export default FeedbackHeader;
