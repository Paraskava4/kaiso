import React from "react";
import ReturnPolicyPage from "./retunpolicy";

const ReturnPolicy = () => {
    return <ReturnPolicyPage />;
};

export default ReturnPolicy;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
