import React from "react";
import Gdrp from "./gdrp";
// import { Link } from "react-alice-carousel";

export default function gdrp() {
    return <Gdrp />;
}

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
