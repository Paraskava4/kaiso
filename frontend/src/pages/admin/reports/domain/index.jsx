"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
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
    useToggleCategoryStatusMutation,
    useToggleSubCategoryStatusMutation,
    useDeleteMultipleCategoryMutation,
    useDeleteMultipleSubCategoryMutation,
    useGetAllCategoryAndSubcategoryQuery,
} from "../../../../api/categories";
import AddDomainModal from "../../../../components/shared/modal/AddDomainModal";
import EditDomainModal from "../../../../components/shared/modal/EditDomainModal";
import DeleteDomainModal from "../../../../components/shared/modal/DeleteDomainModal";
import { useAccess } from "@/utils/constants/accessContext";
import { SearchHeader } from "@/components";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

// Table column definitions
const columns = [
    { id: "domain", label: "Domain", sortable: false },
    { id: "mainDomain", label: "Main Domain", sortable: false },
    { id: "urlSlug", label: "URL slug", sortable: false },
    { id: "reports", label: "Reports", sortable: false },
    { id: "status", label: "Status", sortable: false },
    { id: "action", label: "Action", sortable: false },
];

const Domain = () => {
    // Refs to track API call attempts and prevent infinite loops
    // const hasShownNetworkError = useRef(false);
    const { isButtonDisabled } = useAccess();

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

    // API call with pagination and search
    const {
        data: domainsResponse,
        isLoading: loadingDomains,
        error: domainsError,
        refetch: refetchDomains,
    } = useGetAllCategoryAndSubcategoryQuery({
        type: "Report",
        page: currentPage,
        limit: itemsPerPage,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    });

    const [toggleStatus] = useToggleCategoryStatusMutation();
    const [toggleSubStatus] = useToggleSubCategoryStatusMutation();
    const [deleteMultipleCategory] = useDeleteMultipleCategoryMutation();
    const [deleteMultipleSubCategory] = useDeleteMultipleSubCategoryMutation();

    // Map backend response to table data
    const allDomains = useMemo(() => {
        if (!domainsResponse) return [];

        // Debug logging


        const categories = domainsResponse.category?.data || [];
        const subCategories = domainsResponse.subCategory?.data || [];
        return [
            ...categories.map((cat) => ({ ...cat, type: "main", parentDomain: null })),
            ...subCategories.map((subCat) => ({
                ...subCat,
                type: "sub",
                parentDomain: subCat.categoryId?._id || subCat.categoryId,
                parentDomainName: subCat.categoryId?.name || null, // Store parent name for easy access
            })),
        ];
    }, [domainsResponse, searchTerm, currentPage]);

    // Handle search box
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching

        // Debug logging
        if (process.env.NODE_ENV === "development") {
        }
    };

    // Pagination controls - API handles pagination
    const totalItems = (domainsResponse?.category?.total || 0) + (domainsResponse?.subCategory?.total || 0);

    // Handle row selection
    const handleSelect = (selectedIds) => {
        setSelectedRows(selectedIds);
    };

    // Header right content
    const headerRight = (
        <div className="flex items-center gap-3">
            <SearchInput value={searchTerm} onChange={handleSearch} placeholder="Search domains..." className="mr-3" />
            <CommonButton
                variant="primary"
                className="!text-white !px-6 !bg-red-600 hover:!bg-red-700"
                onClick={() => setShowAddModal(true)}
                disabled={isButtonDisabled("create")}
            >
                Create Category
            </CommonButton>
            <CommonButton
                variant="danger"
                className="!text-red-700 !border-red-500 hover:!bg-red-50"
                onClick={() => setShowDeleteModal(true)}
                disabled={isButtonDisabled("delete") || selectedRows.length === 0}
            >
                Delete
            </CommonButton>
        </div>
    );

    // Handle status toggle
    const handleStatusToggle = async (domainId) => {
        try {
            // Find the domain to determine if it's main or sub
            const domain = allDomains.find((d) => d._id === domainId);

            if (domain?.type === "sub") {
                await toggleSubStatus(domainId).unwrap();
                // toast.success("Subdomain status updated successfully");
            } else {
                await toggleStatus(domainId).unwrap();
                // toast.success("Domain status updated successfully");
            }

            refetch(); // Refresh the data
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
            const selectedDomains = allDomains.filter((domain) => selectedRows.includes(domain._id));
            const mainDomainIds = selectedDomains.filter((domain) => domain.type === "main").map((domain) => domain._id);
            const subDomainIds = selectedDomains.filter((domain) => domain.type === "sub").map((domain) => domain._id);

            // Delete main domains if any
            if (mainDomainIds.length > 0) {
                await deleteMultipleCategory(mainDomainIds).unwrap();
            }

            // Delete subdomains if any
            if (subDomainIds.length > 0) {
                await deleteMultipleSubCategory(subDomainIds).unwrap();
            }

            toast.success(`${selectedRows.length} domain(s) deleted successfully`);
            setSelectedRows([]); // Clear selection
            setShowDeleteModal(false); // Close modal
            refetch(); // Refresh the data
        } catch (error) {
            toast.error(error?.data?.message );
        }
    };

    const handleEdit = (id) => {
        const domainToEdit = allDomains.find((domain) => domain._id === id);
        if (domainToEdit) {
            setEditingDomain(domainToEdit);
            setShowEditModal(true);
        }
    };

    const handleView = (id) => {
        // TODO: Implement view functionality
        // router.push(`/admin/reports/domain/view?id=${id}`);
    };

    // Map domain data to table row format
    const mapDomainToRow = (domain) => {
        let mainDomainName = "-";

        // If it's a subdomain, use the parent domain name directly from API response
        if (domain.type === "sub") {
            if (domain.parentDomainName) {
                // Use the parent name we stored during mapping
                mainDomainName = domain.parentDomainName;
            } else if (domain.parentDomain) {
                // Fallback: find parent domain in categories array
                const parentDomain = allDomains.find((cat) => cat.type === "main" && cat._id === domain.parentDomain);
                if (parentDomain) {
                    mainDomainName = parentDomain.name;
                } else {
                    mainDomainName = `[Invalid Parent]`;
                    if (process.env.NODE_ENV === "development") {
                        console.warn(`Parent domain not found for subdomain "${domain.name}" with parentId: ${domain.parentDomain}`);
                    }
                }
            } else {
                mainDomainName = `[No Parent]`;
            }
        }

        return {
            id: domain._id,
            domain: domain.name,
            mainDomain: mainDomainName,
            urlSlug: domain.url,
            reports: domain.reports || 0,
            statusActive: domain.isActive,
            rawData: domain,
        };
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <div className="flex flex-col gap-4 w-full">
                <PageHeader title="Domains" rightContent={headerRight} />
                {loadingDomains ? (
                    <Loader />
                ) : domainsError ? (
                    <div className="text-red-500 p-4 text-center">
                        <p className="mb-2">{domainsError.message || "Error loading data"}</p>
                    </div>
                ) : (
                    <DataTable
                        data={allDomains.map((domain) => {
                            const mappedRow = mapDomainToRow(domain);
                            return {
                                ...mappedRow,
                                status: (
                                    <StatusToggle
                                        checked={mappedRow.statusActive || false}
                                        onChange={() => handleStatusToggle(mappedRow.id)}
                                        disabled={false}
                                    />
                                ),
                                action: (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(mappedRow.id)}
                                            disabled={isButtonDisabled("update")}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Edit"
                                        >
                                            <Edit className="text-gray-600 w-5 h-5" />
                                        </button>
                                        <button
                                            // onClick={() => handleView(mappedRow.id)}
                                            onClick={() => {

                                                redirect(`report/${mappedRow?.domain}`, false, true);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="View"
                                        >
                                            <ExternalLink className="text-gray-600 w-5 h-5" />
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
                {/* Add Domain Modal */}
                <AddDomainModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        refetchDomains(); // Refresh the data after successful creation
                    }}
                    type="Report"
                />

                {/* Edit Domain Modal */}
                <EditDomainModal
                    open={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingDomain(null);
                    }}
                    onSuccess={() => {
                        refetchDomains(); // Refresh the data after successful update
                    }}
                    domainData={editingDomain}
                    type="Report"
                />

                {/* Delete Domain Modal */}
                <DeleteDomainModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleBulkDeleteConfirm}
                    selectedCount={selectedRows.length}
                    confirmationText="John Doe's"
                />
            </div>
        </Box>
    );
};

export default Domain;
