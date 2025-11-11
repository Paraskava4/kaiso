import React from "react";
import InquiryBeforeBuy_page from "./inquiry-before-buy";

const page = () => {
    return <InquiryBeforeBuy_page />;
};

export default page;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
