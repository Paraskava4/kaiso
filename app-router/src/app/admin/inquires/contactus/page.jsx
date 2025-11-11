import React from "react";
import ContactUs from "./contact-us";

const index = () => {
    return <ContactUs />;
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
