import React from "react";
import SetNewPassWord_Page from "./setnewpassword";

const page = () => {
    return <SetNewPassWord_Page />;
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
