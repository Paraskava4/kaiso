import React from "react";
import BecomeReseller from "./become-a-reseller";

const index = () => {
    return <BecomeReseller />;
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
