"use client";
import { useRef, useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { IconButton } from "@mui/material";

const BlogList = ({ blogsData: propBlogsData, isLoading }) => {
    const scrollContainerRef = useRef(null);
    const [blogsData, setBlogsData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!propBlogsData || propBlogsData.length === 0) {
            setBlogsData([]);
            return;
        }

        const sortedInsights = [...propBlogsData].sort((a, b) => {
            const dateA = new Date(a?.blogId?.publishDate || a?.createdAt || 0);
            const dateB = new Date(b?.blogId?.publishDate || b?.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        });

        const transformed = sortedInsights.map((item) => ({
            image: item.bigImage,
            upperText: item.blogTitle,
            lowerText: item.blogDescription,
            alt: item.blogTitle || "Blog Image",
            blogId: item?.blogId?._id,
            type: item?.blogId?.type,
        }));

        setBlogsData(transformed);
    }, [propBlogsData]);

    // Navigation logic
    const handleNext = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.offsetWidth / 3; // Assuming 3 cards visible by default
        const visibleCards = Math.min(3, blogsData.length - currentIndex);

        let scrollAmount;
        if (visibleCards === 3) {
            scrollAmount = cardWidth * 3;
        } else if (visibleCards === 2) {
            scrollAmount = cardWidth * 2;
        } else {
            scrollAmount = cardWidth;
        }

        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setCurrentIndex((prev) => Math.min(prev + visibleCards, blogsData.length - 1));
    };

    const handlePrevious = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.offsetWidth / 3; // Assuming 3 cards visible by default
        const visibleCards = Math.min(3, currentIndex + 1);

        let scrollAmount;
        if (visibleCards === 3) {
            scrollAmount = cardWidth * 3;
        } else if (visibleCards === 2) {
            scrollAmount = cardWidth * 2;
        } else {
            scrollAmount = cardWidth;
        }

        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setCurrentIndex((prev) => Math.max(prev - visibleCards, 0));
    };
    if (isLoading) {
        return (
            <div className="blog-cards-container grid grid-flow-col auto-cols-[100%] sm:auto-cols-[50%] lg:auto-cols-[32.5%] gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="snap-center">
                        <div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (blogsData.length === 0) {
        return <div className="blog-cards-container">No blogs available.</div>
    }

    return (
        <div className="relative w-[81.9%] mx-auto">
            <div
                ref={scrollContainerRef}
                className="grid grid-flow-col auto-cols-[100%] overflow-y-hidden sm:auto-cols-[50%] lg:auto-cols-[32.5%] gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
            >
                {blogsData.map((blog, index) => (
                    <div key={index} className="snap-center">
                        <BlogCard
                            blogId={blog?.blogId}
                            image={blog.image}
                            upperText={blog.upperText}
                            lowerText={blog.lowerText}
                            alt={blog.alt}
                            type={blog?.type}
                        />
                    </div>
                ))}
            </div>

      {blogsData.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            size="large"
            sx={{
              position: "absolute",
              top: "50%",
              left: "-9.2%",
              transform: "translateY(-50%)",
              zIndex: 10,
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <ArrowLeftCircle
              className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]"
              color={currentIndex === 0 ? "gray" : "#1e3a8a"}
            />

          </IconButton>
          <IconButton
            onClick={handleNext}
            size="large"
            sx={{
              position: "absolute",
              top: "50%",
              right: "-9.2%",
              transform: "translateY(-50%)",
              zIndex: 10,
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <ArrowRightCircle
              className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]"
              color={currentIndex >= blogsData.length - 1 ? "gray" : "#1e3a8a"}
            />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default BlogList;
