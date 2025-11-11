import PrivacyPolicyPage from "./PrivacyPolicy";

export default function PrivacyPolicy() {
    return <PrivacyPolicyPage />;
}

export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
