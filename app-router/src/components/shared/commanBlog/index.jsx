"use client";
import React, { useEffect, useState } from "react";
import { Card, CardMedia, CardContent, Typography, CardActions, Button, useTheme, Box, Container } from "@mui/material";
import { useGetPageBlogArticleQuery } from "@/api/pageBlogArticle";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const CommonBlog = ({ PageName, header, description }) => {
    const [pageBlogArticle, setPageBlogArticle] = useState([]);
    const { data: pageBlogArticleRes } = useGetPageBlogArticleQuery({ pageTitle: PageName });
    const theme = useTheme();
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    useEffect(() => {
        if (!isStatusInclude(pageBlogArticleRes?.status)) return;

        // Get the data and limit to maximum 3 articles (latest 3)
        const allArticles = pageBlogArticleRes?.data || [];

        // Create a copy of the array, sort by publishDate (newest first) and take only the first 3
        const limitedArticles = [...allArticles]
            .sort((a, b) => {
                const dateA = new Date(a?.blogId?.publishDate || 0);
                const dateB = new Date(b?.blogId?.publishDate || 0);
                return dateB - dateA; // Newest first
            })
            .slice(0, 3); // Take only first 3 articles

        setPageBlogArticle(limitedArticles);
    }, [pageBlogArticleRes]);

    const truncateText = (text, maxLength) => {
        if (text?.length <= maxLength) {
            return text;
        }
        return text?.substring?.(0, maxLength) + "...";
    };

    return (
        <>
            {isValidArray(pageBlogArticle) && (
                <Box
                    sx={{
                        backgroundColor: "#f8f9fa",
                        py: { xs: 4, md: 8 },
                        // minHeight: "100vh",
                    }}
                >
                    <Container maxWidth={false} sx={{ maxWidth: "84.5%" }}>
                        {/* Header Section */}
                        <Box sx={{ textAlign: "center", mb: 6 }}>
                            <Typography
                                variant="h5"
                                // component="h2"
                                sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    mb: 2,
                                    fontSize: "26px",
                                }}
                            >
                                {header || "Latest Articles of Custom Report Solutions"}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#666",
                                    maxWidth: "600px",
                                    mx: "auto",
                                    lineHeight: 1.6,
                                    fontSize: { xs: "0.95rem", md: "1rem" },
                                }}
                            >
                                {description || ""}
                            </Typography>
                        </Box>

                        {/* Blog Cards Container - Responsive Grid/Horizontal Scroll */}
                        <Box
                            sx={{
                                // Grid layout for screens 1020px and above, horizontal scroll below 1020px
                                display: {
                                    xs: "flex", // Horizontal scroll for mobile
                                    sm: "flex", // Horizontal scroll for small tablets
                                    md: "grid", // Grid for medium screens (768px-1020px)
                                    lg: "grid", // Grid for large screens (1020px+)
                                },
                                gridTemplateColumns: {
                                    xs: "none",
                                    sm: "none",
                                    md: "repeat(3, 1fr)", // 3 columns from 1020px+
                                    lg: "repeat(3, 1fr)", // 3 columns for large screens
                                },
                                gap: {
                                    xs: 0, // No gap for horizontal scroll
                                    sm: 0, // No gap for horizontal scroll
                                    md: 3, // Gap for grid layout
                                    lg: 3, // Gap for grid layout
                                },
                                justifyItems: {
                                    xs: "flex-start",
                                    sm: "flex-start",
                                    md: "center", // Center items in grid
                                    lg: "center", // Center items in grid
                                },
                                // Horizontal scroll styles for below 1020px
                                overflowX: {
                                    xs: "auto", // Enable horizontal scroll for mobile
                                    sm: "auto", // Enable horizontal scroll for small tablets
                                    md: "visible", // No horizontal scroll for medium+
                                    lg: "visible", // No horizontal scroll for large screens
                                },
                                overflowY: "visible",
                                scrollBehavior: "smooth",
                                // Hide horizontal scrollbar
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                // For Firefox
                                scrollbarWidth: "none",
                                // For IE and Edge
                                msOverflowStyle: "none",
                                // Prevent flex items from shrinking in horizontal scroll
                                "& > *": {
                                    flexShrink: {
                                        xs: 0, // Prevent shrinking in horizontal scroll
                                        sm: 0, // Prevent shrinking in horizontal scroll
                                        md: "initial", // Allow normal behavior in grid
                                        lg: "initial", // Allow normal behavior in grid
                                    },
                                },
                            }}
                        >
                            {pageBlogArticle.map((news, index) => {
                                const formattedDate = news?.blogId?.publishDate && format(new Date(news?.blogId?.publishDate), "MMM dd, yyyy");

                                return (
                                    <Card
                                        key={index}
                                        sx={{
                                            // Responsive card width - horizontal scroll below 1020px, grid above 1020px
                                            maxWidth: {
                                                xs: 464, // Fixed width for horizontal scroll
                                                sm: 464, // Fixed width for horizontal scroll
                                                md: 345, // Grid layout width
                                                lg: 464, // Grid layout width for large screens (1920px design)
                                            },
                                            width: {
                                                xs: "464px", // Fixed width for horizontal scroll
                                                sm: "464px", // Fixed width for horizontal scroll
                                                md: "100%", // Full width in grid
                                                lg: "100%", // Full width in grid
                                            },
                                            minWidth: {
                                                xs: "464px", // Minimum width for horizontal scroll
                                                sm: "464px", // Minimum width for horizontal scroll
                                                md: "auto", // Auto for grid layout
                                                lg: "auto", // Auto for grid layout
                                            },
                                            borderRadius: 3,
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "#fff",
                                            border: "1px solid #f0f0f0",
                                            marginRight: {
                                                xs: 3, // Add margin for horizontal scroll spacing
                                                sm: 3, // Add margin for horizontal scroll spacing
                                                md: 0, // No margin in grid
                                                lg: 0, // No margin in grid
                                            },
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height={{
                                                xs: 230, // 230px height for horizontal scroll
                                                sm: 230, // 230px height for horizontal scroll
                                                md: 200, // Standard height for grid
                                                lg: 230, // 230px height for large grid (1920px design)
                                            }}
                                            image={news?.blogId?.image || "/placeholder.svg?height=230&width=464"}
                                            alt={"Blog image"}
                                            sx={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "230px",
                                                maxWidth: {
                                                    xs: "464px", // Max width for horizontal scroll
                                                    sm: "464px", // Max width for horizontal scroll
                                                    md: "100%", // Full width in grid
                                                    lg: "464px", // Max width for large grid
                                                },
                                                maxHeight: {
                                                    xs: "230px", // Max height for horizontal scroll
                                                    sm: "230px", // Max height for horizontal scroll
                                                    md: "200px", // Standard height for grid
                                                    lg: "230px", // Max height for large grid
                                                },
                                            }}
                                        />
                                        <CardContent sx={{ p: 3, pb: 2 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#888",
                                                    fontSize: "16px",
                                                    fontWeight: 500,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                    mb: 1.5,
                                                    display: "block",
                                                }}
                                            >
                                                {formattedDate}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#1a1a1a",
                                                    lineHeight: 1.4,
                                                    fontSize: "1.1rem",
                                                    mb: 2,
                                                }}
                                            >
                                                {truncateText(news?.blogId?.blogTitle, 45) || "No title available"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ p: 3, pt: 0 }}>
                                            <Button
                                                onClick={() => redirect(`blog/${news?.blogId?._id}`)}
                                                size="small"
                                                sx={{
                                                    color: "#1a1a1a",
                                                    fontWeight: 600,
                                                    fontSize: "0.875rem",
                                                    textTransform: "none",
                                                    p: 0,
                                                    minWidth: "auto",
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                        color: "#0066cc",
                                                    },
                                                }}
                                                endIcon={<ArrowRight className="w-4 h-4" />}
                                            >
                                                Read More
                                            </Button>
                                        </CardActions>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Container>
                </Box>
            )}
        </>
    );
};

export default CommonBlog;
