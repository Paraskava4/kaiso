import React from "react";
import CustomReportFormPage_page from "./CustomReportFormPage";

const CustomReportFormPage = () => {
    return (
        <div>
            <CustomReportFormPage_page />
        </div>
    );
};

export default CustomReportFormPage;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
