import React from "react";
import VerifyCode from "./Verify_Code";

const page = () => {
    return <VerifyCode />;
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
