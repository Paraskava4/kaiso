import React from "react";

const StrategicAnalysisNewsHeader = ({ title = "Latest Articles of StrategicAnalysis ", subtitle = "" }) => {
    return (
        <header className="strategic-analysis-news-header">
            <h2 className="strategic-analysis-news-header-title">{title}</h2>
            <p className="strategic-analysis-news-header-subtitle">{subtitle}</p>
        </header>
    );
};

export default StrategicAnalysisNewsHeader;
