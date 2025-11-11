import React from "react";
import Role from "./role";

const index = () => {
    return <Role />;
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
