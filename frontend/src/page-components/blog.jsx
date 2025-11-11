"use client";
import React from "react";

import { Footer } from "@/components";
import FeaturedBlogs from "@/components/pages/blog/sections/FeaturedBlogs";
import { useNavbarSEO } from "@/utils/hooks/useMetadata.js";

const Blog = () => {
    // Set SEO metadata from navbar API for Blog page - no fallback text
    useNavbarSEO("Blogs & News");

    return (
        <div>
            <FeaturedBlogs />
            <Footer />
        </div>
    );
};

export default Blog;
