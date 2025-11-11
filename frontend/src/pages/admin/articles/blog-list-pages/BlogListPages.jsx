"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button, Select, MenuItem, IconButton } from "@mui/material";
import { Trash2, GripVertical } from "lucide-react";
import { useGetAllNewsCategoriesQuery } from "@/api/blogCategories";
import {
    useGetAllArticlesQuery,
    useGetPageBlogArticlesQuery,
    useAddPageBlogArticleMutation,
    useDeletePageBlogArticleMutation,
    useUpdatePageBlogArticleIndexMutation,
} from "@/api/blogs/blog";
import { categoriesApi } from "@/api/categories";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAccess } from "@/utils/constants/accessContext";

const BlogListPages = () => {
    const dispatch = useDispatch();
    const { isButtonDisabled } = useAccess();
    // State for form controls
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedSubDomain, setSelectedSubDomain] = useState("");
    const [selectedReport, setSelectedReport] = useState("");

    // State for selected blog list page category
    const [selectedCategory, setSelectedCategory] = useState("Syndicate Reports");

    // Memoize query parameters to prevent infinite re-renders
    const newsCategoriesParams = useMemo(() => ({ page: 1, limit: 100 }), []);
    const allArticlesParams = useMemo(() => ({ page: 1, limit: 1000 }), []);

    // Memoize default empty arrays to prevent recreation
    const emptyArray = useMemo(() => [], []);

    // API hooks
    const {
        data: newsCategories = emptyArray,
        isLoading: newsCategoriesLoading,
        error: newsCategoriesError,
    } = useGetAllNewsCategoriesQuery(newsCategoriesParams);
    const { data: allArticles = emptyArray, isLoading: allArticlesLoading, error: allArticlesError } = useGetAllArticlesQuery(allArticlesParams);
    const { data: pageBlogArticles = emptyArray, isLoading: pageArticlesLoading, refetch: refetchPageArticles } = useGetPageBlogArticlesQuery(selectedCategory);
    const [addPageBlogArticle] = useAddPageBlogArticleMutation();
    const [deletePageBlogArticle] = useDeletePageBlogArticleMutation();
    const [updatePageBlogArticleIndex] = useUpdatePageBlogArticleIndexMutation();

    // State for API data
    const [domains, setDomains] = useState([]);
    const [subDomains, setSubDomains] = useState([]);
    const [reports, setReports] = useState([]);
    const [blogList, setBlogList] = useState([]);

    // Drag and drop state
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    // Static data for Blog List Pages categories (these are fixed as per requirements)
    const staticCategories = [
        { id: 1, name: "Syndicate Reports" },
        { id: 2, name: "Custom Report Solutions" },
        { id: 3, name: "Full-Time Engagement Models" },
        { id: 4, name: "Strategic Growth Solutions" },
        { id: 5, name: "Consulting Services" },
        { id: 6, name: "Market Assessment" },
        { id: 7, name: "Market Intelligence" },
        { id: 8, name: "Competitive Positioning Analysis" },
        { id: 9, name: "Partner Identification" },
        { id: 10, name: "Technology Scouting & Monitoring" },
        { id: 11, name: "Strategic Analysis" },
        { id: 12, name: "Customer Intelligence" },
    ];

    // Load domains from API - prevent infinite loops during network issues
    useEffect(() => {
        // Only update domains when we have actual data or when not loading
        if (newsCategories?.data && Array.isArray(newsCategories.data) && !newsCategoriesLoading) {
            const formattedDomains = newsCategories.data.map((category) => ({
                id: category._id,
                name: category.name,
            }));
            setDomains(formattedDomains);
        } else if (!newsCategoriesLoading && newsCategoriesError) {
            // Only set empty array when we have a definitive error and not loading
            setDomains(emptyArray);
        }
        // Don't update during loading states to prevent infinite loops
    }, [newsCategories?.data, newsCategoriesLoading, newsCategoriesError, emptyArray]);

    // Load subdomains when domain is selected
    useEffect(() => {
        if (selectedDomain) {
            // Memoize the API call parameters to prevent object recreation
            const subCategoryParams = {
                categoryId: selectedDomain,
                type: "News Article",
                page: 1,
                limit: 100,
            };

            // Try to fetch subcategories from API first
            dispatch(categoriesApi.endpoints.getAllSubCategoriesPaginated.initiate(subCategoryParams))
                .then((result) => {
                    if (result.data?.data && result.data.data.length > 0) {
                        const formattedSubDomains = result.data.data.map((subCategory) => ({
                            id: subCategory._id,
                            name: subCategory.name,
                            domainId: selectedDomain,
                        }));
                        setSubDomains(formattedSubDomains);
                    } else {
                        // Fallback to empty array if API returns empty or fails
                        setSubDomains(emptyArray);
                    }
                })
                .catch(() => {
                    // Fallback to empty array if API fails
                    setSubDomains(emptyArray);
                });
        } else {
            setSubDomains(emptyArray);
        }
    }, [selectedDomain, dispatch, emptyArray]);

    // Static data for reports (for form dropdown)

    // Load reports (News Articles) from API with filtering based on domain/subdomain selection
    useEffect(() => {
        // Only update reports when we have actual data or when not loading
        if (allArticles?.data && Array.isArray(allArticles.data) && !allArticlesLoading) {
            let newsArticles = allArticles.data.filter((article) => article.type === "News Article");

            // Filter by domain (categoryId) if selected
            if (selectedDomain) {
                newsArticles = newsArticles.filter((article) => article.categoryId === selectedDomain);
            }

            // Filter by subdomain (subCategoryId) if selected
            if (selectedSubDomain) {
                newsArticles = newsArticles.filter((article) => article.subCategoryId === selectedSubDomain);
            }

            if (newsArticles.length > 0) {
                const formattedReports = newsArticles.map((article) => ({
                    id: article._id,
                    name: article.blogTitle || article.title,
                }));
                setReports(formattedReports);
            } else {
                // Show empty array when no articles match the filter criteria
                setReports(emptyArray);
            }
        } else if (!allArticlesLoading && allArticlesError) {
            // Only set empty array when we have a definitive error and not loading
            setReports(emptyArray);
        }
        // Don't update during loading states to prevent infinite loops
    }, [allArticles?.data, allArticlesLoading, allArticlesError, selectedDomain, selectedSubDomain, emptyArray]);

    // Load page blog articles when category changes
    useEffect(() => {
        if (pageBlogArticles?.data) {
            const formattedBlogList = pageBlogArticles.data.map((item) => ({
                id: item._id,
                title: item.blogId?.blogTitle || item.blogId?.title || "Untitled",
                description: item.blogId?.blogSubTitle || item.blogId?.description || "No description available",
                domain: item.blogId?.categoryId?.name || "",
                subdomain: item.blogId?.subCategoryId?.name || "",
                publishDate: item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "Unknown Date",
                position: item.position,
                pageBlogArticleId: item._id,
                blogId: item.blogId?._id,
            }));
            // Sort by position
            formattedBlogList.sort((a, b) => a.position - b.position);
            setBlogList(formattedBlogList);
        } else {
            setBlogList([]);
        }
        // Reset form when category changes
        setSelectedDomain("");
        setSelectedSubDomain("");
        setSelectedReport("");
    }, [pageBlogArticles, selectedCategory]);

    // Filter subdomains based on selected domain
    const filteredSubDomains = selectedDomain ? subDomains.filter((sub) => sub.domainId === selectedDomain) : [];

    // Handle category selection from sidebar
    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    // Handle form submission
    const handleAdd = async () => {
        if (selectedReport) {
            try {
                // Calculate next position
                const nextPosition = blogList.length > 0 ? Math.max(...blogList.map((b) => b.position || 0)) + 1 : 1;

                const payload = {
                    blogId: selectedReport,
                    pageTitle: selectedCategory,
                    position: nextPosition,
                };

                await addPageBlogArticle(payload).unwrap();
                // toast.success("Blog article added successfully!");                                   

                // Refetch the page blog articles
                refetchPageArticles();

                // Reset form
                setSelectedDomain("");
                setSelectedSubDomain("");
                setSelectedReport("");
            } catch (error) {
                // toast.error("Failed to add blog article. Please try again.");
            }
        } else {
            toast.error("Please select a report.");
        }
    };

    // Handle delete blog
    const handleDelete = async (blogItem) => {
        try {
            await deletePageBlogArticle(blogItem.pageBlogArticleId).unwrap();
            // toast.success("Blog article deleted successfully!");

            // Refetch the page blog articles
            refetchPageArticles();
        } catch (error) {
            toast.error("Failed to delete blog article. Please try again.");
        }
    };

    // Drag and drop handlers
    const handleDragStart = (id) => (e) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id.toString());
    };

    const handleDragOver = (e, id) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (id !== dragOverId) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOverId(null);
    };

    const handleDrop = async (e, targetId) => {
        e.preventDefault();

        if (!draggingId || draggingId === targetId) {
            setDragOverId(null);
            setDraggingId(null);
            return;
        }

        try {
            setIsReordering(true);

            // Create a new array with the updated order
            const currentIds = blogList.map((blog) => blog.pageBlogArticleId);
            const fromIndex = currentIds.indexOf(draggingId);
            const toIndex = currentIds.indexOf(targetId);

            if (fromIndex === -1 || toIndex === -1) {
                console.error("Invalid drag operation: indices not found");
                toast.error("Invalid drag operation. Please try again.");
                return;
            }

            // Reorder the array
            const newIds = [...currentIds];
            const [movedId] = newIds.splice(fromIndex, 1);
            newIds.splice(toIndex, 0, movedId);

            // Update backend with the new order
            await updatePageBlogArticleIndex({
                pageTitle: selectedCategory,
                pageBlogArticleIds: newIds,
            }).unwrap();

            toast.success("Blog articles reordered successfully!");

            // Refetch the page blog articles to get the updated order
            refetchPageArticles();
        } catch (error) {
            toast.error("Failed to reorder blog articles. Please try again.");
        } finally {
            setIsReordering(false);
            setDragOverId(null);
            setDraggingId(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Left Sidebar - Blog List Pages */}
            <div className="w-64 bg-[#F4F5F7] border-r border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Blog List Pages</h2>
                <ul className="space-y-2">
                    {staticCategories.map((category) => (
                        <li key={category.id}>
                            <button
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                    selectedCategory === category.name ? "bg-white text-black font-medium" : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => handleCategorySelect(category.name)}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white">
                {/* Custom Page Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-xl font-medium text-gray-900">Choose Blogs Menu</h1>
                    {/* <p className="text-sm text-gray-600 mt-1">Currently showing: <span className="font-medium text-blue-600">{selectedCategory}</span></p> */}
                </div>

                {/* Form Controls */}
                <div className="px-6 py-6">
                    <div className="flex items-center gap-6 mb-6">
                        {/* <div className="flex flex-col" style={{ width: "200px" }}>
                            <label className="text-sm text-gray-600 mb-2">Choose Domain</label>
                            <Select
                                value={selectedDomain}
                                onChange={(e) => {
                                    setSelectedDomain(e.target.value);
                                    setSelectedSubDomain(""); // Reset subdomain when domain changes
                                    setSelectedReport(""); // Reset report when domain changes
                                }}
                                displayEmpty
                                sx={{
                                    width: "100%",
                                    height: 40,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #e9ecef",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "8px 12px",
                                        color: selectedDomain ? "#333" : "#999",
                                    },
                                }}
                            >
                                <MenuItem value="" sx={{ color: "#999", fontSize: "14px" }}>
                                    Choose Domain
                                </MenuItem>
                                {domains.map((domain) => (
                                    <MenuItem key={domain.id} value={domain.id} sx={{ fontSize: "14px" }}>
                                        {domain.name && domain.name.length > 120 ? `${domain.name.substring(0, 120)}...` : domain.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col" style={{ width: "200px" }}>
                            <label className="text-sm text-gray-600 mb-2">Choose Sub Domain</label>
                            <Select
                                value={selectedSubDomain}
                                onChange={(e) => {
                                    setSelectedSubDomain(e.target.value);
                                    setSelectedReport(""); // Reset report when subdomain changes
                                }}
                                disabled={!selectedDomain}
                                displayEmpty
                                sx={{
                                    width: "100%",
                                    height: 40,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        backgroundColor: !selectedDomain ? "#f5f5f5" : "#f8f9fa",
                                        border: "1px solid #e9ecef",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "8px 12px",
                                        color: selectedSubDomain ? "#333" : "#999",
                                    },
                                }}
                            >
                                <MenuItem value="" sx={{ color: "#999", fontSize: "14px" }}>
                                    Choose Sub Domain
                                </MenuItem>
                                {filteredSubDomains.map((subdomain) => (
                                    <MenuItem key={subdomain.id} value={subdomain.id} sx={{ fontSize: "14px" }}>
                                        {subdomain.name && subdomain.name.length > 120 ? `${subdomain.name.substring(0, 120)}...` : subdomain.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div> */}

                        <div className="flex flex-col" style={{ width: "600px" }}>
                            <label className="text-sm text-gray-600 mb-2">
                                Choose Article<sup className="text-red-500 text-[15px]">*</sup>
                            </label>
                            <Select
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                displayEmpty
                                sx={{
                                    width: "100%",
                                    height: 40,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #e9ecef",
                                    },
                                    "& .MuiSelect-select": {
                                        padding: "8px 12px",
                                        color: selectedReport ? "#333" : "#999",
                                    },
                                }}
                            >
                                <MenuItem value="" sx={{ color: "#999", fontSize: "14px" }}>
                                    Choose Article
                                </MenuItem>
                                {reports.length === 0 && (selectedDomain || selectedSubDomain) ? (
                                    <MenuItem disabled sx={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
                                        No articles found for selected domain/subdomain
                                    </MenuItem>
                                ) : (
                                    reports.map((report) => (
                                        <MenuItem key={report.id} value={report.id} sx={{ fontSize: "14px" }}>
                                            {report.name && report.name.length > 85 ? `${report.name.substring(0, 85)}...` : report.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </div>

                        <div className="flex flex-col justify-end">
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#dc3545",
                                    borderRadius: "4px",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    px: 4,
                                    py: 1,
                                    minWidth: "150px",
                                    height: "40px",
                                    textTransform: "none",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#c82333",
                                        boxShadow: "none",
                                    },
                                    "&:disabled": {
                                        backgroundColor: "#ccc",
                                    },
                                }}
                                onClick={handleAdd}
                                disabled={isButtonDisabled("create") || !selectedReport}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Blog List */}
                    <div className="space-y-3 px-6 pb-6">
                        {blogList.map((blog) => (
                            <div
                                key={blog.id}
                                className={`bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                                    draggingId === blog.pageBlogArticleId ? "opacity-50" : "opacity-100"
                                } ${dragOverId === blog.pageBlogArticleId ? "scale-102 border-blue-400 border-2 border-dashed" : ""} ${
                                    isReordering ? "pointer-events-none" : ""
                                }`}
                                onDragOver={(e) => handleDragOver(e, blog.pageBlogArticleId)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, blog.pageBlogArticleId)}
                            >
                                <div className="flex justify-between items-start">
                                    {/* Drag Handle */}
                                    <IconButton
                                        disabled={isButtonDisabled("update")}
                                        draggable
                                        onDragStart={handleDragStart(blog.pageBlogArticleId)}
                                        onDragEnd={handleDragEnd}
                                        sx={{
                                            cursor: "grab",
                                            "&:active": {
                                                cursor: "grabbing",
                                            },
                                            marginRight: 1,
                                            padding: 1,
                                        }}
                                        aria-label="Drag to reorder"
                                    >
                                        <GripVertical className="text-[#9CA3AF] w-5 h-5" />
                                    </IconButton>

                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-3">
                                            <h3 className="text-base font-medium text-gray-900 leading-relaxed">
                                                {blog.title && blog.title.length > 120 ? `${blog.title.substring(0, 120)}...` : blog.title || ""}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed pl-6">
                                            {blog.description && blog.description.length > 120
                                                ? `${blog.description.substring(0, 120)}...`
                                                : blog.description || ""}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm pl-6">
                                            {blog.domain && blog.domain !== "" ? (
                                                <>
                                                    <span className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                                                        {blog.domain.length > 120 ? `${blog.domain.substring(0, 120)}...` : blog.domain}
                                                    </span>
                                                    {blog.subdomain && blog.subdomain !== "" && (
                                                        <span className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                                                            {blog.subdomain.length > 120 ? `${blog.subdomain.substring(0, 120)}...` : blog.subdomain}
                                                        </span>
                                                    )}
                                                </>
                                            ) : blog.subdomain && blog.subdomain !== "" ? (
                                                <span className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                                                    {blog.subdomain.length > 120 ? `${blog.subdomain.substring(0, 120)}...` : blog.subdomain}
                                                </span>
                                            ) : null}
                                            <span className="text-gray-500 text-xs">{blog.publishDate || ""}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(blog)}
                                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors ml-6 flex-shrink-0"
                                        aria-label="Delete"
                                        disabled={isButtonDisabled("delete") || isReordering}
                                    >
                                        <Trash2 className="text-gray-500 hover:text-red-600 w-5 h-5" />
                                    </button>
                                </div>

                                {/* Reordering overlay */}
                                {isReordering && (
                                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
                                        <span className="text-blue-600 font-medium">Reordering...</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {pageArticlesLoading && (
                            <div className="text-center py-12 text-gray-500">
                                <p>Loading blog articles...</p>
                            </div>
                        )}

                        {!pageArticlesLoading && blogList.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p>No blog entries found. Add some blogs using the form above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogListPages;
