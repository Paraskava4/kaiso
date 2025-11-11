"use client";
import React from "react";
import StrategicAnalysisNewsHeader from "./StrategicAnalysisNewsHeader";
import StrategicAnalysisNewsList from "./StrategicAnalysisNewsList";

const StrategicAnalysisNews = () => {
    return (
        <section className="strategic-analysis-news-section bg-[#faf5ef]">
            <StrategicAnalysisNewsHeader />
            <StrategicAnalysisNewsList />
        </section>
    );
};

export default StrategicAnalysisNews;
