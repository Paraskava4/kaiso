"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useGetBlogByIdDataQuery, useGetLetestArticleDataQuery } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { ISO_toDateFormat } from "@/components/shared/dateFormat";
import Link from "next/link";
import { Footer } from "@/components";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

function BlogDetailInner_Page(props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");
    const slugData = props?.props?.slugData;
    const { redirect } = useRouteRedirect();

    console.log("slugData", props, slugData);

    // dataId logic: prefer slugData._id, else id
    const [dataId, setDataId] = useState(slugData?._id || id);
    // Get blog data via RTK Query, skip if no dataId
    const { data: blogDataRes, error: blogError, isFetching } = useGetBlogByIdDataQuery(dataId, { skip: !dataId });
    const { data: latestArticleRes } = useGetLetestArticleDataQuery();

    // State to store data used for rendering
    const [blogData, setBlogData] = useState(slugData || null);
    const [similarBlogsData, setSimilarBlogsData] = useState([]);
    const [similarReportsData, setSimilarReportsData] = useState([]);
    const [similarNewsArticlesData, setSimilarNewsArticlesData] = useState([]);
    const [latestArticleData, setLatestArticleData] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [currentUrl, setCurrentUrl] = useState(null);
    useEffect(() => {
        if (!slugData && id) {
            setDataId(id);
        }
    }, [id, slugData]);

    useEffect(() => {
        // On mount: get url and window width
        setWindowWidth(window.innerWidth);
        setCurrentUrl(window.location.href);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // If slugData provided (from pretty url), just use that
        if (slugData) {
            setBlogData(slugData?.blog);
            setSimilarBlogsData(slugData.similarBlogs || []);
            setSimilarReportsData(slugData.similarReports || []);
            setSimilarNewsArticlesData(slugData.similarArticles || []);
            return;
        }
        // Otherwise, use fetched data
        if (isStatusInclude(blogDataRes?.status)) {
            setBlogData(blogDataRes?.data?.blog);
            setSimilarBlogsData(blogDataRes?.data?.similarBlogs || []);
            setSimilarReportsData(blogDataRes?.data?.similarReports || []);
            setSimilarNewsArticlesData(blogDataRes?.data?.similarArticles || []);
        }
    }, [slugData, blogDataRes, dataId]);

    // useEffect(() => {
    //     // Only use slugData if it's the initial load and dataId was set from it
    //     if (slugData && dataId === slugData._id) {
    //         setBlogData(slugData?.blog);
    //         setSimilarBlogsData(slugData.similarBlogs || []);
    //         setSimilarReportsData(slugData.similarReports || []);
    //         setSimilarNewsArticlesData(slugData.similarArticles || []);
    //     } else if (isStatusInclude(blogDataRes?.status)) {
    //         // Use fetched data when slugData is not applicable or after dataId change
    //         setBlogData(blogDataRes?.data?.blog);
    //         setSimilarBlogsData(blogDataRes?.data?.similarBlogs || []);
    //         setSimilarReportsData(blogDataRes?.data?.similarReports || []);
    //         setSimilarNewsArticlesData(blogDataRes?.data?.similarArticles || []);
    //     }
    // }, [slugData, blogDataRes, dataId]);

    useEffect(() => {
        if (isStatusInclude(latestArticleRes?.status)) {
            const articles = blogData?.type === "News Article" ? latestArticleRes?.data?.article : latestArticleRes?.data?.blogs;
            setLatestArticleData(Array.isArray(articles) ? articles.slice(0, 3) : []);
        }
    }, [latestArticleRes, blogData, slugData]);

    // Show loading state while router is not ready or while fetching
    if (isFetching) {
        return <div className="flex items-center justify-center h-screen bg-[#F9F8F4]">Loading blog...</div>;
    }

    console.log("blogData", blogData);

    if (!blogData) {
        return (
            <div className="flex items-center  justify-center h-screen bg-[#F9F8F4]">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h1>
                    <p className="text-gray-600 mb-4">The requested blog could not be found.</p>
                    <button onClick={() => redirect("blog")} className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
                        Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="p-6 pb-35 mx-auto flex flex-col  bg-[#fff] md:flex-row gap-6 h-[100%]">
                <div className="mx-auto flex flex-col bg-[#fff] md:flex-row gap-6  w-full" style={{ maxWidth: windowWidth > 1200 ? "83.5%" : "100%" }}>
                    <div className="bg-white w-full overflow-hidden">
                        <div className="w-full px-4 md:px-8">
                            <p className="text-gray-500 mb-4 text-sm">
                                {ISO_toDateFormat(`${blogData?.createdAt}`, "MMM dd, yyyy")}
                                {"  "} {blogData?.type}
                            </p>
                            <p className="text-lg mb-4 pr-0 md:pr-9 ml-0" style={{ fontWeight: "600" }}>
                                {blogData?.blogTitle}
                            </p>
                            {blogData?.image && blogData.image.trim() !== "" && (
                                <Image
                                    src={blogData?.image}
                                    alt={blogData?.blogTitle}
                                    className="rounded-lg mb-4 w-full"
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        maxHeight: "450px",
                                        objectFit: "cover",
                                        borderRadius: "16px",
                                    }}
                                    width={100}
                                    height={100}
                                    quality={100}
                                />
                            )}
                        </div>
                        <div className="px-4 text-sm md:px-7 mt-4 w-full">
                            <div
                                className="blog-content"
                                style={{ color: "#43464B", fontWeight: "400", lineHeight: "1.6" }}
                                dangerouslySetInnerHTML={{ __html: blogData?.description }}
                            />
                        </div>

                        <div className="px-4 md:px-7 mt-5 w-full mb-6">
                            {currentUrl && (
                                <div className="text-center mx-auto flex items-center mt-2 mb-8 justify-center h-full">
                                    <div
                                        style={{ border: "1px solid lightgrey" }}
                                        className="px-6 py-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 flex flex-col sm:flex-row items-center gap-4 mt-6"
                                    >
                                        <button className="flex items-center pr-18" style={{ fontSize: "14px", color: "#43464B", fontWeight: "400" }}>
                                            Share this post
                                        </button>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 rounded-full bg-white p-2 hover:text-blue-600"
                                            >
                                                <Facebook size={20} />
                                            </Link>
                                            <Link
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 rounded-full bg-white p-2 hover:text-blue-400"
                                            >
                                                <Twitter size={20} />
                                            </Link>
                                            <Link
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 rounded-full bg-white p-2 hover:text-blue-700"
                                            >
                                                <Linkedin size={20} />
                                            </Link>
                                            <Link
                                                href={`https://www.instagram.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 rounded-full bg-white p-2 hover:text-red-700"
                                            >
                                                <Instagram size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-78 w-full">
                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200"
                            style={{ position: "sticky", top: "90px", width: "inherit", maxWidth: "inherit", zIndex: 0 }}
                        >
                            <h2 className="text-md p-2 border-b border-gray-200">Similar Reports</h2>
                            <ul className="text-gray-600">
                                {similarReportsData?.slice(0, 6).map((report, index) => {
                                    console.log("report store", report);
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => redirect(`report-store/${report?.url}`)}
                                            className="p-2 border-b border-gray-200 hover:text-rose-600 text-sm cursor-pointer"
                                        >
                                            {/* {report?.reportTitle} */}
                                            {report?.reportTitle?.length > 100 ? report.reportTitle.substring(0, 75) + "..." : report?.reportTitle}
                                        </li>
                                    );
                                })}
                            </ul>
                            <h2 className="text-md p-2 border-b border-gray-200">Similar Blogs</h2>
                            <ul className="text-gray-600">
                                {similarBlogsData?.slice(0, 6).map((blog, index) => (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            // setDataId(blog?._id)
                                            redirect(`blog/${blog?.url}`)
                                        }
                                        className="p-2 border-b border-gray-200 hover:text-rose-600 text-sm cursor-pointer"
                                    >
                                        {blog?.blogTitle?.length > 100 ? blog?.blogTitle?.substring(0, 75) + "..." : blog?.blogTitle}

                                        {/* {blog?.blogTitle} */}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="text-md p-2 border-b border-gray-200">Similar Newsletter</h2>
                            <ul className="text-gray-600">
                                {similarNewsArticlesData?.slice(0, 6)?.map((news, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            console.log("news", news);
                                            redirect(`blog/${news?.url}`);
                                            // setDataId(news?._id)
                                        }}
                                        className="p-2 border-b border-gray-200 hover:text-rose-600 text-sm cursor-pointer"
                                    >
                                        {/* {news?.blogTitle} */}
                                        {news?.blogTitle?.length > 100 ? news?.blogTitle?.substring(0, 75) + "..." : news?.blogTitle}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div className="mx-auto mb-20 px-4" style={{ maxWidth: windowWidth > 1200 ? "76.5%" : "95%" }}>
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] mt-20" style={{ fontWeight: "600" }}>
                        {blogData?.type === "News Article" ? "Latest Articles " : "Latest Blogs"}
                    </p>
                    <p
                        className="text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] mt-2 mb-10"
                        style={{ color: "#43464B", lineHeight: "1.8rem" }}
                    >
                        {/* Lorem Ipsum is simply dummy text of the printing and typesetting has been the industry's standard dummy text ever since. */}
                    </p>
                </div>
                <div className="grid gap-4 sm:gap-6 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {latestArticleData?.slice(0, 6).map((article) => (
                        <article
                            onClick={() => redirect(`blog/${article?.url}`)}
                            key={article._id}
                            style={{ borderRadius: "20px" }}
                            className="group rounded-lg border border-transparent transition-all duration-300 hover:shadow-lg hover:bg-neutral-100 hover:border-gray-300"
                        >
                            <div className="mb-4 overflow-hidden rounded-lg">
                                {article.image && article.image.trim() !== "" ? (
                                    <Image
                                        src={article.image}
                                        alt={article.title || "Article image"}
                                        className="w-full object-cover h-[240px]  transition-transform duration-300 group-hover:scale-105"
                                        style={{ borderRadius: "0px" }}
                                        width={100}
                                        height={100}
                                        quality={100}
                                    />
                                ) : (
                                    <div className="w-full h-[240px] bg-gray-200 rounded" />
                                )}
                            </div>
                            <p className="mb-2 text-xs text-neutral-500 pl-3" style={{ fontSize: "14px", fontWeight: "400" }}>
                                {article.publishDate}
                            </p>
                            <h3
                                className="mb-3 leading-5 text-xs sm:text-xs sm:text-[10px] md:text-[12px] 2xl:text-[14px] font-semibold text-neutral-800 pl-3"
                                style={{ fontWeight: "500" }}
                            >
                                {article.blogTitle}
                            </h3>
                            {/* <Link
                                href={`/blog/${article._id}`}
                                className="group ml-3 text-sm inline-flex items-center gap-2 text-sm mt-2 mb-3 group-hover:text-[#D62035] text-black"
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "400",
                                }}
                            >
                                Read more
                                <ArrowRight className="transition-transform group-hover:translate-x-1" style={{ fontSize: "16px", fontWeight: "500" }} />
                            </Link> */}
                        </article>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function BlogDetailPage(props) {
    console.log("props", props);

    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#F9F8F4]">Loading blog...</div>}>
            <BlogDetailInner_Page {...props} />
        </Suspense>
    );
}
