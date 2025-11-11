import React from "react";
import ForgotPassword_Page from "./forgotPassword";

const ForgotPassword = () => {
    return <ForgotPassword_Page />;
};

export default ForgotPassword;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
