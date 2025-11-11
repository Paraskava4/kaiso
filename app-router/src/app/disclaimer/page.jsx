import React from "react";
import Disclaimer from "./disclaimer";

const page = () => {
    return <Disclaimer />;
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
