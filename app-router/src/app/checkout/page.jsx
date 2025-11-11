import React from "react";
import Checkout_Page from "./cehckout";

const Checkout = () => {
    return <Checkout_Page />;
};

export default Checkout;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
