"use client";
import React from "react";
import NewsHeader from "./NewsHeader";
import NewsList from "./NewsList";

const News = ({ newsData, isLoading }) => {
    return (
        <section className="news-section">
            <NewsHeader />
            <NewsList newsData={newsData} isLoading={isLoading} />
        </section>
    );
};

export default News;
