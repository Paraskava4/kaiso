"use client";
import React, { useState, useMemo, useEffect } from "react";
import PageHeader from "../../../../components/shared/PageHeader";
import SearchInput from "../../../../components/shared/SearchInput";
import CommonButton from "../../../../components/shared/CommonButton";
import { DataTable, StatusToggle } from "../../../../components/shared/DataTable";
import Pagination from "../../../../components/shared/Pagination";
import { Loader } from "../../../../components/shared/Loader";
import { Box } from "@mui/material";
import { Edit, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    useToggleBlogCategoryStatusMutation,
    useToggleBlogSubCategoryStatusMutation,
    useDeleteMultipleBlogCategoryMutation,
    useDeleteMultipleBlogSubCategoryMutation,
    useGetAllCategoryAndSubcategoryQuery,
} from "../../../../api/blogCategories";
import AddBlogDomainModal from "../../../../components/shared/modal/AddBlogDomainModal";
import EditBlogDomainModal from "../../../../components/shared/modal/EditBlogDomainModal";
import DeleteBlogDomainModal from "../../../../components/shared/modal/DeleteBlogDomainModal";
import { useAccess } from "@/utils/constants/accessContext";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

// Table column definitions for blog domain
const columns = [
    { id: "domain", label: "Domain", sortable: false },
    { id: "subdomain", label: "Subdomain", sortable: false },
    { id: "articleTypes", label: "Article Types", sortable: false },
    { id: "urlSlug", label: "URL slug", sortable: false },
    { id: "articles", label: "Articles", sortable: false },
    { id: "status", label: "Status", sortable: false },
    { id: "action", label: "Action", sortable: false },
];

const BlogDomain = () => {
    // Main data & UI states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDomain, setEditingDomain] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const { redirect } = useRouteRedirect();

    // Debounce search term to prevent too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            // Reset to first page when search term changes
            if (searchTerm !== debouncedSearchTerm) {
                setCurrentPage(1);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearchTerm]);

    const { isButtonDisabled } = useAccess();

    // API call for all categories and subcategories with pagination and search
    const {
        data: domainsResponse,
        isLoading: loadingDomains,
        error: domainsError,
        refetch: refetchDomains,
    } = useGetAllCategoryAndSubcategoryQuery({
        type: "Blog",
        page: currentPage,
        limit: itemsPerPage,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    });

    // Mutation hooks
    const [toggleBlogStatus] = useToggleBlogCategoryStatusMutation();
    const [toggleBlogSubStatus] = useToggleBlogSubCategoryStatusMutation();
    const [deleteMultipleBlogCategory] = useDeleteMultipleBlogCategoryMutation();
    const [deleteMultipleBlogSubCategory] = useDeleteMultipleBlogSubCategoryMutation();

    // Memoize the combined domains array to prevent infinite re-renders
    const allDomains = useMemo(() => {
        if (!domainsResponse) return [];

        // Debug logging
        if (process.env.NODE_ENV === "development") {
            // Debug article types
            const categories = domainsResponse.category?.data || [];
            const subCategories = domainsResponse.subCategory?.data || [];
      
        }

        const categories = domainsResponse.category?.data || [];
        const subCategories = domainsResponse.subCategory?.data || [];
        return [
            ...categories.map((cat) => ({
                ...cat,
                domainType: "main", // Keep for internal logic
                type: "main", // Add for modal compatibility
                parentDomain: null,
                articleType: cat.type, // Store original type as articleType for modal
            })),
            ...subCategories.map((subCat) => ({
                ...subCat,
                domainType: "sub", // Keep for internal logic
                type: "sub", // Add for modal compatibility
                parentDomain: subCat.categoryId?._id || subCat.categoryId,
                parentDomainName: subCat.categoryId?.name || null, // Store parent name for easy access
                articleType: subCat.type, // Store original type as articleType for modal
            })),
        ];
    }, [domainsResponse, debouncedSearchTerm, currentPage]);

    // Handle search box
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching

        // Debug logging
        if (process.env.NODE_ENV === "development") {
        }
    };

    // Pagination controls: total is sum of category.total and subCategory.total
    const totalItems = (domainsResponse?.category?.total || 0) + (domainsResponse?.subCategory?.total || 0);

    // Header right content
    const headerRight = (
        <div className="flex items-center gap-3">
            <SearchInput value={searchTerm} onChange={handleSearch} placeholder="Search domains..." className="mr-3" />
            <CommonButton
                variant="primary"
                className="!text-white !px-6 !bg-red-600 hover:!bg-red-700"
                disabled={isButtonDisabled("create")}
                onClick={() => setShowAddModal(true)}
            >
                Create Domain
            </CommonButton>
            <CommonButton
                variant="danger"
                className="!text-red-700 !border-red-500 hover:!bg-red-50"
                onClick={() => setShowDeleteModal(true)}
                disabled={selectedRows.length === 0 || isButtonDisabled("delete")}
            >
                Delete
            </CommonButton>
        </div>
    );

    // Handle status toggle
    const handleStatusToggle = async (domainId) => {
        try {
            // Find the domain to determine if it's main or sub and its type
            const domain = allDomains.find((d) => d._id === domainId);

            if (domain?.domainType === "sub") {
                await toggleBlogSubStatus(domainId).unwrap();
            } else {
                await toggleBlogStatus(domainId).unwrap();
            }

            refetchDomains(); // Refresh the data
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update domain status");
        }
    };

    // Handle bulk delete confirmation
    const handleBulkDeleteConfirm = async () => {
        if (selectedRows.length === 0) {
            toast.error("Please select domains to delete");
            return;
        }

        try {
            // Separate main domains and subdomains
            const mainDomainIds = [];
            const subDomainIds = [];

            selectedRows.forEach((id) => {
                const domain = allDomains.find((d) => d._id === id);
                if (domain?.domainType === "sub") {
                    subDomainIds.push(id);
                } else {
                    mainDomainIds.push(id);
                }
            });

            // Delete main domains if any
            if (mainDomainIds.length > 0) {
                await deleteMultipleBlogCategory(mainDomainIds).unwrap();
            }

            // Delete subdomains if any
            if (subDomainIds.length > 0) {
                await deleteMultipleBlogSubCategory(subDomainIds).unwrap();
            }

            toast.success(`${selectedRows.length} domain(s) deleted successfully`);
            setSelectedRows([]); // Clear selection
            setShowDeleteModal(false); // Close modal
            refetchDomains(); // Refresh the data
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete some domains");
        }
    };

    const handleEdit = (id) => {
        const domainToEdit = allDomains.find((domain) => domain._id === id);
        if (domainToEdit) {
            setEditingDomain(domainToEdit);
            setShowEditModal(true);
        }
    };

    // Handle row selection
    const handleSelect = (selectedIds) => {
        setSelectedRows(selectedIds);
    };

    // Map domain data to table row format
    const mapDomainToRow = (domain) => {
        let subdomainName = "-";
        let domainName = domain.name;

        // If it's a subdomain, show its name in subdomain column and find parent for domain column
        if (domain.domainType === "sub") {
            subdomainName = domain.name;

            // Use the parent name directly from API response
            if (domain.parentDomainName) {
                domainName = domain.parentDomainName;
            } else if (domain.parentDomain) {
                // Fallback: find parent domain in categories array
                const parentDomain = allDomains.find((cat) => cat.domainType === "main" && cat._id === domain.parentDomain);
                if (parentDomain) {
                    domainName = parentDomain.name;
                } else {
                    domainName = "[Invalid Parent]";
                    if (process.env.NODE_ENV === "development") {
                        console.warn(`Parent domain not found for subdomain "${domain.name}" with parentId: ${domain.parentDomain}`);
                    }
                }
            } else {
                domainName = "[No Parent]";
            }
        }

        return {
            id: domain._id,
            domain: domainName,
            subdomain: subdomainName,
            articleTypes: domain.articleType || "-", // Use articleType field for display
            urlSlug: domain.url,
            articles: domain.articles || 0,
            statusActive: domain.isActive,
            rawData: domain,
        };
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <div className="flex flex-col gap-4 w-full">
                <PageHeader title="Domains" rightContent={headerRight} />
                {/* Loading state */}
                {loadingDomains && (
                    <div className="flex justify-center items-center py-8">
                        <Loader />
                    </div>
                )}
                {/* Error state */}
                {domainsError && <div className="text-red-500 text-center py-4">Error: {domainsError.message || "Error loading data"}</div>}
                {/* Data table */}
                {!loadingDomains && !domainsError && (
                    <DataTable
                        data={allDomains.map((domain) => {
                            const mappedRow = mapDomainToRow(domain);
                            return {
                                ...mappedRow,
                                status: <StatusToggle checked={mappedRow.statusActive} onChange={() => handleStatusToggle(mappedRow.id)} disabled={isButtonDisabled("update")} />,
                                action: (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(mappedRow.id)}
                                            className="text-black-600"
                                            title="Edit"
                                            disabled={isButtonDisabled("update")}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            // onClick={() => handleView(mappedRow.id)}
                                            onClick={() => {

                                                redirect(`blogs/${mappedRow?.domain}`, false, true);
                                            }}
                                            className="text-vlack-600 hover:text-black-800"
                                            title="View"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </div>
                                ),
                            };
                        })}
                        columns={columns}
                        selectable={true}
                        starable={false}
                        onSelect={handleSelect}
                    />
                )}
                {/* Pagination controls */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(size) => {
                        setItemsPerPage(size);
                        setCurrentPage(1);
                    }}
                />
                {/* Add Blog Domain Modal */}
                <AddBlogDomainModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        refetchDomains(); // Refresh the data after successful creation
                    }}
                />

                {/* Edit Blog Domain Modal */}
                <EditBlogDomainModal
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingDomain(null);
                    }}
                    onSuccess={() => {
                        refetchDomains(); // Refresh the data after successful update
                    }}
                    domainData={editingDomain}
                />

                {/* Delete Blog Domain Modal */}
                <DeleteBlogDomainModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleBulkDeleteConfirm}
                    selectedCount={selectedRows.length}
                />
            </div>
        </Box>
    );
};

export default BlogDomain;
