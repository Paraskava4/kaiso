"use client";
import { useGetDataByCategoryAndSubcategoryQuery, useGetGlobalSearchDataQuery } from "@/api/home";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { BASE_URL } from "../../../config";
import UniversalSEO from "@/utils/seo/universalSEO";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../../../../../config";

// FeaturedBlogs Component
const FeaturedBlogs = ({ blogData, loadingData, urlData, searchParams, isErrorData, isSuccessData }) => {
    const [content, setContent] = useState({ blogs: [], articles: [] });
    const [searchQuery, setSearchQuery] = useState(searchParams || "");
    const [searchResults, setSearchResults] = useState({ blogs: [], articles: [] });
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [showAllArticles, setShowAllArticles] = useState(false);
    const [showAllArticles2, setShowAllArticles2] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All");

    console.log("blogData", blogData);

    const formatContent = (items) =>
        items?.map((item, index) => ({
            id: item._id || item.id || `fallback-${index}`,
            title: item.blogTitle || item.title || "Untitled",
            excerpt: item.blogSubTitle || item.excerpt || "",
            date:
                item.publishDate || item.date
                    ? new Date(item.publishDate || item.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                      })
                    : "",
            image: item.image || "/images/fallback.png",
            type: item.type || "Blog",
            featured: index === 0 && (item.type === "Blog" || !item.type),
            items: item,
        })) || [];

    // Load data from props or fallback to static data
    useEffect(() => {
        if (isSuccessData && blogData && Array.isArray(blogData) && blogData.length > 0) {
            setContent({
                blogs: formatContent(blogData.filter((item) => item.type === "Blog" || !item.type)),
                articles: formatContent(blogData.filter((item) => item.type === "News Article")),
            });
            setLoading(false);
        } else if (isErrorData) {
            setError("Failed to load blog data");
            setContent({
                blogs: [],
                articles: [],
            });
            setLoading(false);
        }
    }, [blogData, isSuccessData, isErrorData]);

    // Handle search
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults({ blogs: [], articles: [] });
            setSearchLoading(false);
            return;
        }
        setSearchLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/web/search?search=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Search request failed");
            const responseData = await response.json();
            const { blogs = [], articles = [] } = responseData.data || {};
            setSearchResults({
                blogs: formatContent(blogs),
                articles: formatContent(articles),
            });
        } catch (error) {
            setError(error.message);
            setSearchResults({ blogs: [], articles: [] });
        } finally {
            setSearchLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSeeAllBlogsClick = () => {
        setShowAllArticles(true);
        setShowAllArticles2(false);
        setShowDropdown(true);
        setSelectedOption("Blogs");
    };

    const handleSeeAllArticlesClick = () => {
        setShowAllArticles(false);
        setShowAllArticles2(true);
        setShowDropdown(true);
        setSelectedOption("News Articles");
    };

    const handleDropdownSelect = (e) => {
        const type = e.target.value;
        if (type === "Blogs") {
            setShowAllArticles(true);
            setShowAllArticles2(false);
            setSelectedOption("Blogs");
        } else if (type === "News Articles") {
            setShowAllArticles(false);
            setShowAllArticles2(true);
            setSelectedOption("News Articles");
        } else if (type === "All") {
            setShowAllArticles(false);
            setShowAllArticles2(false);
            setSelectedOption("All");
        }
        setShowDropdown(true);
    };

    const handleReadMoreClick = (item) => {
        console.log("item", item);

        if (item?.items?.url) {
            router.push(`/blog/${item.items.url}`);
        } else if (item?.id) {
            router.push(`/blog/${item.id}`);
        }
    };

    const featured = content.blogs.find((b) => b.featured);
    const otherBlogs = content.blogs.filter((b) => !b.featured);
    const latestContent = [...content.blogs, ...content.articles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

    if (loadingData || loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading content...</p>
            </div>
        );
    }
    if (isErrorData || error) {
        return (
            <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
                <p>Error: {error || "Failed to load content"}</p>
            </div>
        );
    }

    return (
        <div
            className="mx-auto rounded-[12px] overflow-hidden min-h-[440px]"
            style={{
                backgroundImage: `url("/images/report_bg.webp")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: (searchResults?.blogs?.length || 0) + (searchResults?.articles?.length || 0) >= 1 ? "cover" : "contain",
                backgroundPosition: "top center",
                backgroundColor: "#F9F8F4",
            }}
        >
            {/* HEADER */}
            <section className="border-gray-200 pt-4 px-4">
                <div
                    className="flex items-center justify-between max-w-6xl mx-auto px-4 w-full gap-4 flex-wrap"
                    style={{ display: showAllArticles || showAllArticles2 ? "none" : "flex" }}
                >
                    <p
                        style={{ fontSize: "26px", lineHeight: "3.5rem" }}
                        className="md:text-4xl font-bold text-neutral-900 leading-tight text-center flex-1 min-w-[200px]"
                    >
                        Build right features, with confidence!
                    </p>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            style={{ borderRadius: "12px" }}
                            placeholder="Search"
                            className="w-full h-12 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mb-10 items-center mt-6 md:mt-10 w-[83%] mx-auto">
                    <div className="flex items-center w-full md:w-auto">
                        <p style={{ fontSize: "18px" }} className="text-sm font-medium text-neutral-800">
                            Featured Blogs
                        </p>
                    </div>
                    <div className="flex items-center w-full md:w-auto mt-4 md:mt-0">
                        {showDropdown && (
                            <select
                                value={selectedOption}
                                onChange={handleDropdownSelect}
                                className="w-58 border border-gray-300 rounded-lg shadow-md text-sm text-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all duration-200 ease-in-out hover:shadow-lg py-3 px-4 appearance-none mx-2 md:mx-4"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                                    backgroundPosition: "right 0.5rem center",
                                    backgroundSize: "1.5em",
                                    backgroundRepeat: "no-repeat",
                                }}
                            >
                                <option value="All">All</option>
                                <option value="Blogs">Blogs</option>
                                <option value="News Articles">News Articles</option>
                            </select>
                        )}
                    </div>
                </div>
            </section>

            {/* MAIN */}
            <section className="pb-10">
                <div className="mx-auto" style={{ maxWidth: "81%" }}>
                    {searchLoading ? (
                        <div style={{ textAlign: "center", padding: "50px" }}>
                            <p>Loading search results...</p>
                        </div>
                    ) : searchResults.blogs.length > 0 || searchResults.articles.length > 0 ? (
                        <div className="mt-4 sm:mt-6 md:mt-10 rounded-lg">
                            <p style={{ fontSize: "20px", fontWeight: "500" }} className="text-sm font-medium text-neutral-800 mb-4">
                                Search Results
                            </p>
                            <div className="grid gap-4 sm:gap-6 md:gap-2 md:grid-cols-3">
                                {[...searchResults.blogs, ...searchResults.articles].map((item) => (
                                    <article onClick={() => handleReadMoreClick(item)} key={item.id} className="p-4 rounded-lg">
                                        <div className="mb-4 overflow-hidden rounded-lg">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                className="object-cover w-full h-[260px]"
                                                style={{ borderRadius: "12px" }}
                                                width={100}
                                                height={100}
                                                quality={100}
                                            />
                                        </div>
                                        <p className="mb-2 text-xs text-neutral-500" style={{ fontSize: "16px", fontWeight: "400" }}>
                                            {item.date}
                                        </p>
                                        <h3 className="mb-3 text-base font-semibold text-neutral-900" style={{ fontSize: "20px", fontWeight: "500" }}>
                                            {item.title.length > 120 ? `${item.title.slice(0, 120)}...` : item.title}
                                        </h3>
                                        <p className="mb-2 sm:mb-4 text-sm text-neutral-600" style={{ fontSize: "18px", fontWeight: "400" }}>
                                            {item.excerpt}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* FEATURED BLOG */}
                            {content.blogs.length > 0 && (
                                <div style={{ display: showAllArticles ? "block" : showAllArticles2 ? "none" : "block" }}>
                                    <article
                                        onClick={() => handleReadMoreClick(featured)}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-15 rounded-lg"
                                    >
                                        <div className="overflow-hidden rounded-lg w-full">
                                            <Image
                                                src={featured?.image}
                                                alt={featured?.title || "Featured Blog"}
                                                className="object-cover w-full h-[340px]"
                                                style={{ borderRadius: "20px" }}
                                                width={100}
                                                height={100}
                                                quality={100}
                                            />
                                        </div>
                                        <div className="mt-4 sm:mt-6 md:mt-19 w-full">
                                            <p className="mb-2 text-xs text-neutral-500" style={{ fontSize: "16px" }}>
                                                {featured?.date}
                                            </p>
                                            <p className="mb-2 sm:mb-4 md:mb-4 text-[20px] font-semibold text-neutral-900 line-clamp-3">{featured?.title}</p>
                                            <p className="mb-2 sm:mb-4 md:mb-6 text-[18px] text-neutral-600 line-clamp-3">{featured?.excerpt}</p>
                                        </div>
                                    </article>
                                </div>
                            )}

                            {/* OTHER BLOGS */}
                            <div
                                className="mt-4 sm:mt-6 md:mt-10 md:gap-2 rounded-lg"
                                style={{ display: showAllArticles ? "block" : showAllArticles2 ? "none" : "block" }}
                            >
                                <div className="grid gap-6 md:grid-cols-3">
                                    {(showAllArticles ? otherBlogs : otherBlogs.slice(0, 3)).map((blog) => (
                                        <article onClick={() => handleReadMoreClick(blog)} key={blog.id} className="rounded-lg">
                                            <div className="mb-4 cursor-pointer overflow-hidden rounded-lg">
                                                <Image
                                                    src={blog.image}
                                                    alt={blog.title || "Blog Image"}
                                                    className="w-full object-cover h-[240px]"
                                                    style={{ borderRadius: "12px" }}
                                                    width={100}
                                                    height={100}
                                                    quality={100}
                                                />
                                            </div>
                                            <p className="mb-2 text-xs text-neutral-500" style={{ fontSize: "16px", fontWeight: "400" }}>
                                                {blog.date}
                                            </p>
                                            <h3
                                                className="mb-3 cursor-pointer text-base font-semibold text-neutral-900"
                                                style={{ fontSize: "16px", fontWeight: "500" }}
                                            >
                                                {blog?.title.length > 120 ? `${blog?.title.slice(0, 120)}...` : blog?.title}
                                            </h3>
                                            <p className="mb-2 sm:mb-4 cursor-pointer text-sm text-neutral-600" style={{ fontSize: "14px", fontWeight: "400" }}>
                                                {blog?.excerpt.length > 150 ? `${blog?.excerpt.slice(0, 150)}...` : blog?.excerpt}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="button"
                                        onClick={handleSeeAllBlogsClick}
                                        style={{ border: "1px solid lightgrey" }}
                                        className="bg-white w-40 sm:w-50 text-black py-2 px-3 mt-4 sm:mt-7 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-white transition duration-300"
                                    >
                                        See All <ArrowRight className="w-4 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* ARTICLES */}
                            <div
                                className="my-6 sm:my-8 md:my-12 w-full h-[1px] bg-neutral-300"
                                style={{ display: showAllArticles || showAllArticles2 ? "none" : "block" }}
                            ></div>
                            <div style={{ display: showAllArticles2 ? "block" : showAllArticles ? "none" : "block" }}>
                                <div className="text-center max-w-2xl mx-auto px-4">
                                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px]">News Articles</p>
                                </div>
                                <div className="mt-4 sm:mt-6 md:mt-10 rounded-lg">
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {(showAllArticles2 ? content?.articles : content?.articles?.slice(0, 6)).map((article) => (
                                            <article onClick={() => handleReadMoreClick(article)} key={article.id} className="rounded-lg">
                                                <div className="mb-4 cursor-pointer overflow-hidden rounded-lg">
                                                    <Image
                                                        src={article.image}
                                                        alt={article.title}
                                                        className="object-cover w-full h-[240px]"
                                                        style={{ borderRadius: "12px" }}
                                                        width={100}
                                                        height={100}
                                                        quality={100}
                                                    />
                                                </div>
                                                <p className="mb-2 text-xs text-neutral-500" style={{ fontSize: "16px", fontWeight: "400" }}>
                                                    {article.date}
                                                </p>
                                                <h3
                                                    className="mb-3 cursor-pointer text-base font-semibold text-neutral-900"
                                                    style={{ fontSize: "16px", fontWeight: "500" }}
                                                >
                                                    {article?.title.length > 120 ? `${article?.title.slice(0, 120)}...` : article?.title}
                                                </h3>
                                                <p
                                                    className="mb-2 cursor-pointer sm:mb-4 text-sm text-neutral-600"
                                                    style={{ fontSize: "14px", fontWeight: "400" }}
                                                >
                                                    {article?.excerpt.length > 150 ? `${article?.excerpt.slice(0, 150)}...` : article?.excerpt}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-4 sm:mt-6 md:mt-6">
                                        <button
                                            type="button"
                                            onClick={handleSeeAllArticlesClick}
                                            style={{ border: "1px solid lightgrey" }}
                                            className="bg-white w-40 sm:w-50 text-black py-2 px-4 sm:px-6 mt-4 sm:mt-7 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 hover:text-white transition duration-300"
                                        >
                                            See All <ArrowRight className="w-4 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* LATEST BLOGS & ARTICLES */}
                            <div
                                className="my-6 sm:my-8 md:my-12 h-[1px] w-full bg-neutral-300"
                                style={{ display: showAllArticles || showAllArticles2 ? "none" : "block" }}
                            ></div>
                            <div style={{ display: showAllArticles || showAllArticles2 ? "none" : "block" }}>
                                <div className="mx-auto">
                                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] my-2">Latest Blogs & Articles</p>
                                </div>
                                <div className="mt-4 sm:mt-6 md:mt-0 rounded-lg">
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {latestContent.map((item) => (
                                            <article onClick={() => handleReadMoreClick(item)} key={item.id} className="rounded-lg">
                                                <div className="mb-4 cursor-pointer overflow-hidden rounded-lg">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="object-cover w-full h-[240px]"
                                                        style={{ borderRadius: "12px" }}
                                                        width={100}
                                                        height={100}
                                                        quality={100}
                                                    />
                                                </div>
                                                <p className="mb-2 text-xs text-neutral-500" style={{ fontSize: "16px", fontWeight: "400" }}>
                                                    {item.date}
                                                </p>
                                                <h3
                                                    className="mb-3 cursor-pointer text-base font-semibold text-neutral-900"
                                                    style={{ fontSize: "16px", fontWeight: "500" }}
                                                >
                                                    {item?.title.length > 120 ? `${item?.title.slice(0, 120)}...` : item?.title}
                                                </h3>
                                                <p
                                                    className="mb-2 cursor-pointer sm:mb-4 text-sm text-neutral-600"
                                                    style={{ fontSize: "14px", fontWeight: "400" }}
                                                >
                                                    {item?.excerpt.length > 150 ? `${item?.excerpt.slice(0, 150)}...` : item?.excerpt}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FeaturedBlogs;
