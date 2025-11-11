"use client";
import React from "react";
import { Box } from "@mui/material";
import HeroSection from "./HeroSection";
import DividerLine from "@/components/shared/DividerLine";
import LatestPublication from "./LatestPublication";
import MostPopularInsights from "./MostPopularInsights";
import NewsArticles from "./NewsArticles";
import ReviewsSection from "./Reviews-section";

const Masters = () => {
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                maxWidth: "1670px",
                margin: "0 auto",
                backgroundColor: "#FFFFFF",
                padding: "20px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "20px",
                boxSizing: "border-box", // This ensures padding is included in width calculation
            }}
        >
            <HeroSection />
            <DividerLine />
            <LatestPublication />
            <DividerLine />
            <MostPopularInsights />
            <DividerLine />
            <NewsArticles />
            <DividerLine />
            <ReviewsSection />
        </Box>
    );
};

export default Masters;
