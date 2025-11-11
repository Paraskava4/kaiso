import React from "react";
import PaymentErrorPage from "./error";

const PaymentError = () => {
    return <PaymentErrorPage />;
};

export default PaymentError;

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
