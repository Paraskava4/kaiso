// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import NewsCard from "./NewsCard";
// import { BASE_URL } from "../../../../config";
// import { fetchWithErrorHandling, parseJsonWithErrorHandling } from "../../../utils/networkError";

// const NewsList = () => {
//     const scrollContainerRef = useRef(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const [startX, setStartX] = useState(0);
//     const [scrollLeft, setScrollLeft] = useState(0);

//     // ✅ State for dynamic API data
//     const [newsData, setNewsData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // ✅ Fetch news data from API
//     useEffect(() => {
//         const fetchNews = async () => {
//             setLoading(true);

//             const response = await fetchWithErrorHandling(`${BASE_URL}/master/webGet`, {}, "fetching news data", { showHttpToast: false });

//             if (response?.error) {
//                 setNewsData([]);
//                 setLoading(false);
//                 return;
//             }

//             const data = await parseJsonWithErrorHandling(response, "parsing news response");

//             if (!data?.data?.newsArticles) {
//                 setNewsData([]);
//                 setLoading(false);
//                 return;
//             }

//             const mappedNews = data.data.newsArticles.map((newsItem) => ({
//                 image: `${BASE_URL}/images/${newsItem.blogId.image}`,
//                 date: new Date(newsItem.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                 }),
//                 title: newsItem.newsArticleTitle,
//                 alt: newsItem.newsArticleTitle,
//                 blogId: newsItem.blogId._id,
//             }));

//             setNewsData(mappedNews);
//             setLoading(false);
//         };

//         fetchNews();
//     }, []);

//     // ✅ Set initial cursor
//     useEffect(() => {
//         if (scrollContainerRef.current) {
//             scrollContainerRef.current.style.cursor = "grab";
//         }
//     }, []);

//     // ✅ Drag & touch handlers
//     const handleMouseDown = (e) => {
//         if (!scrollContainerRef.current) return;
//         setIsDragging(true);
//         setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
//         setScrollLeft(scrollContainerRef.current.scrollLeft);
//         scrollContainerRef.current.style.cursor = "grabbing";
//     };

//     const handleMouseLeave = () => {
//         setIsDragging(false);
//         if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//         if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
//     };

//     const handleMouseMove = (e) => {
//         if (!isDragging || !scrollContainerRef.current) return;
//         e.preventDefault();
//         const x = e.pageX - scrollContainerRef.current.offsetLeft;
//         const walk = (x - startX) * 2;
//         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const handleTouchStart = (e) => {
//         if (!scrollContainerRef.current) return;
//         setIsDragging(true);
//         setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
//         setScrollLeft(scrollContainerRef.current.scrollLeft);
//     };

//     const handleTouchMove = (e) => {
//         if (!isDragging || !scrollContainerRef.current) return;
//         const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
//         const walk = (x - startX) * 2;
//         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
//     };

//     const handleTouchEnd = () => {
//         setIsDragging(false);
//     };

//     // ✅ Optional loading UI
//     if (loading) return <div className="news-list-container">Loading news...</div>

//     return (
//         <div
//             ref={scrollContainerRef}
//             className="news-list-container news-scroll-container"
//             onMouseDown={handleMouseDown}
//             onMouseLeave={handleMouseLeave}
//             onMouseUp={handleMouseUp}
//             onMouseMove={handleMouseMove}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//         >
//             {newsData.map((news, index) => (
//                 <NewsCard key={index} blogId={news?.blogId} image={news.image} date={news.date} title={news.title} alt={news.alt} />
//             ))}
//         </div>
//     );
// };

// export default NewsList;
"use client";
import React, { useRef, useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import { BASE_URL } from "../../../../config";

const NewsList = ({ newsData: propNewsData, isLoading }) => {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [newsData, setNewsData] = useState([]);

    // Process news data from props
    useEffect(() => {
        if (!propNewsData || propNewsData.length === 0) {
            setNewsData([]);
            return;
        }

        const mappedNews = propNewsData.map((newsItem) => ({
            image: `${BASE_URL}/images/${newsItem.blogId.image}`,
            date: new Date(newsItem.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            title: newsItem.newsArticleTitle,
            alt: newsItem.newsArticleTitle || "News Image",
            blogId: newsItem.blogId._id,
            item: newsItem,
        }));

        setNewsData(mappedNews);
    }, [propNewsData]);

    // Set initial cursor
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = "grab";
        }
    }, []);

    // Drag & touch handlers
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = "grab";
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Skeleton UI for loading
    if (isLoading) {
        return (
            <div className="news-list-container news-scroll-container">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg" />
                ))}
            </div>
        );
    }

    // Empty state
    if (newsData.length === 0) {
        return <div className="news-list-container">No news available.</div>;
    }

    return (
        <div
            ref={scrollContainerRef}
            className="news-list-container news-scroll-container"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {newsData.map((news, index) => (
                <NewsCard key={index} blogId={news?.blogId} image={news.image} date={news.date} title={news.title} alt={news.alt} news={news?.item} />
            ))}
        </div>
    );
};

export default NewsList;
