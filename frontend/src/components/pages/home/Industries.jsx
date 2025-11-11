"use client";
import React from "react";
import IndustriesHeader from "./IndustriesHeader";
import IndustriesList from "./IndustriesList";

const Industries = () => {
    return (
        <section className="industries-section">
            <IndustriesHeader />
            <IndustriesList />
        </section>
    );
};

export default Industries;
