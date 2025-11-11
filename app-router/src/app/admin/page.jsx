import React from "react";
import Admin from "./admin";

const AdminIndex = () => {
    return <Admin />;
};

export default AdminIndex;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
