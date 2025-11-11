import React from "react";
import Cookiepolicy from "./cookiepolicy";

const page = () => {
    return <Cookiepolicy />;
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
