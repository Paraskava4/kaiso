"use client";
import React from "react";
import Companies from "./Companies";
import FeedbackList from "./FeedbackList";

const Feedback = ({ feedbackData, isLoading }) => {
    return (
        <section className="feedback-section">
            <Companies />
            <div className="feedback-content">
                <FeedbackList feedbackData={feedbackData} isLoading={isLoading} />
            </div>
        </section>
    );
};

export default Feedback;
