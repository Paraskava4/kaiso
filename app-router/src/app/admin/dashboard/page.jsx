import React from "react";
import Dashboard from "./dashboard";

const index = () => {
    return <Dashboard />;
};

export default index;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
