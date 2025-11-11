import React from "react";
import Deliveryformats from "./deliveryformats";

const page = () => {
    return <Deliveryformats />;
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
