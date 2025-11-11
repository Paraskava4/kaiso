import Back_To_Login from "./back_to_login";

const BackToLogin = () => {
    return <Back_To_Login />;
};

export default BackToLogin;
export async function generateMetadata() {
    return {
        title: "Kaiso Research",
        description: "Kaiso Research",
        robots: { index: false, follow: false },
        authors: [{ name: "Kaiso Research" }],
    };
}
