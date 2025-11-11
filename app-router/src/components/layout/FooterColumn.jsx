"use client";
import React from "react";

const FooterColumn = ({ title, links }) => {
    return (
        <div
            style={{
                fontWeight: "500",
                minWidth: "240px",
                width: "300px",
            }}
        >
            <h2
                style={{
                    fontSize: "20px",
                    color: "#ffffff",
                    fontFamily: "var(--font-inter)",
                }}
            >
                {title}
            </h2>
            <nav
                style={{
                    marginTop: "20px",
                    width: "100%",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#d1d5db",
                }}
            >
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={typeof link === "object" ? link.href : "#"}
                        style={{
                            display: "block",
                            color: "#d1d5db",
                            marginTop: index > 0 ? "20px" : "0",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                            fontFamily: "var(--font-inter)",
                        }}
                    >
                        {typeof link === "object" ? link.text : link}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default FooterColumn;
