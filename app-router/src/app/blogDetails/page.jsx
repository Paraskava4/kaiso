import React from "react";
import BlogDetailPage from "./blogDetails";

const BlogDetail = (props) => {
    return <BlogDetailPage props={props} />;
};

export default BlogDetail;

// export async function generateMetadata() {
//     return {
//         title: "Kaiso Research",
//         description: "Kaiso Research",
//         robots: { index: false, follow: false },
//         authors: [{ name: "Kaiso Research" }],
//     };
// }
