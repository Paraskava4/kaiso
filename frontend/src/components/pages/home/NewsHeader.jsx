import React from "react";

const NewsHeader = ({
    title = "Industry News & Updates",
    subtitle = "Stay ahead with in-depth reporting and thoughtful analysis your trusted source for stories that matter and insights that empower",
}) => {
    return (
        <header className="news-header">
            <h2 className="news-header-title">{title}</h2>
            <p className="news-header-subtitle">{subtitle}</p>
        </header>
    );
};

export default NewsHeader;
