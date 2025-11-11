import React from "react";
import InquiryBeforeBuy from "./inquiry-before-buy";

const index = () => {
    return <InquiryBeforeBuy />;
};

export default index;

export async function generateMetadata() {
    return {
        title: "Login - Kaiso Research",
        description: "Login to access the admin dashboard.",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
