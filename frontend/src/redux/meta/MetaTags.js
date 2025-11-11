// components/MetaTags.js
import Head from "next/head";
import { useSelector } from "react-redux";

export default function MetaTags() {
    const author = useSelector((state) => state.meta.author) || "Kaiso Research And Consulting";

    return (
        <Head>
            <meta name="author" content={author} />
        </Head>
    );
}
