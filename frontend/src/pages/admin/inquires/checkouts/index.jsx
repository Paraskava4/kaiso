"use client";
import React, { useState, useEffect } from "react";
// import SearchBox from "../../../components/shared/PageHeader/SearchBox";
// import CommonButton from "../../../components/shared/CommonButton";
// import { DataTable } from "../../../components/shared/DataTable";
// import Pagination from "../../../components/shared/Pagination";
// import Loader from "../../../components/shared/Loader";
import { FormControl, Select, MenuItem, InputLabel, Box, Popover, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Calendar } from "lucide-react";
// import { fetchInquiries } from "../../../redux/inquirySlice";
import { useDispatch, useSelector } from "react-redux";
// import DetailsModal from "../../../components/shared/DetailsModal";
// import { filterByDateRange } from "../../../utils/dateFilters";
// import { exportToExcel } from "../../../utils/exportToExcel";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/shared/PageHeader";
import SearchHeader from "@/components/search/SearchHeader";
import CommonButton from "@/components/shared/CommonButton";
import { DataTable } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import { fetchInquiries, toggleInquiryLike } from "@/redux/inquirySlice";
import DetailsModal from "@/components/shared/DetailsModal";

import { exportToExcel } from "@/utils/exportToExcel";
import { formatInquiryDateTime } from "@/components/shared/dateFormat";

// Mapping between frontend column IDs and backend field names for Checkouts
const columnToFieldMapping = {
    id: "inquiryNo",
    clientName: "firstName",
    companyName: "companyName",
    reportName: "reportName",
    amount: "amount",
    time: "createdAt",
    starred: "isLiked", // Add mapping for star sorting
};

// Column definitions for Checkout Inquiries page
const initialColumns = [
    { id: "id", label: "Inquiry No", sortable: true },
    { id: "clientName", label: "Client Name", sortable: true },
    { id: "companyName", label: "Company Name", sortable: true },
    { id: "email", label: "Email Address" },
    { id: "contact", label: "Contact No", minWidth: 180 },
    { id: "reportName", label: "Report Name", sortable: true, maxWidth: 320 },
    { id: "amount", label: "Amount", sortable: true },
    { id: "time", label: "Time", minWidth: 180, sortable: true },
];

const Checkouts = () => {
    // Helper function to calculate date for server-side filtering
    const calculateDateFilter = (range) => {
        if (!range || range === "all") return "";

        const now = new Date();
        const days = parseInt(range, 10);

        if (isNaN(days)) return "";

        // Calculate the date N days ago
        const targetDate = new Date();
        targetDate.setDate(now.getDate() - days);

        // Return in ISO format as expected by the server
        return targetDate.toISOString();
    };

    // Add unhandled rejection prevention
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            // Prevent Next.js error panel for network-related errors
            if (
                event.reason?.response?.status === 404 ||
                event.reason?.code === "NETWORK_ERROR" ||
                event.reason?.message?.includes("Network Error") ||
                event.reason?.message?.includes("Failed to fetch")
            ) {
                event.preventDefault();
                console.error("Prevented unhandled promise rejection:", event.reason);
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    const [range, setRange] = useState("");
    const [customDate, setCustomDate] = useState(null);
    const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [columns, setColumns] = useState(initialColumns);
    // Main data & UI states
    const [rows, setRows] = useState([]); // data from API
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Sorting states
    const [sortField, setSortField] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState(-1); // -1 for desc, 1 for asc
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const [searchData, setSearchData] = useState("");
    // Header UI (after state definitions)
    const headerRight = (
        <div className="flex items-center gap-2">
            <Box>
                <SearchHeader
                    searchTerm={searchData}
                    onSearchChange={(e) => {
                        setSearchData(e);
                    }}
                    onClear={() => {
                        setSearchData("");
                    }}
                />
            </Box>
            <FormControl sx={{ width: 200 }} size="small">
                <InputLabel>Select Range</InputLabel>
                <Select
                    value={range}
                    onChange={(e) => {
                        const newRange = e.target.value;
                        setRange(newRange);

                        if (newRange === "custom") {
                            setShowCustomDatePicker(true);
                        } else {
                            setShowCustomDatePicker(false);
                            setCustomDate(null);
                            // Show loading immediately for non-custom selections
                            setIsLoadingData(true);
                        }

                        // Reset to page 1 when changing date filter
                        setCurrentPage(1);
                    }}
                    label="Select Range"
                >
                    <MenuItem value="">
                        <em>Select Range</em>
                    </MenuItem>
                    <MenuItem value="7">Last 7 days</MenuItem>
                    <MenuItem value="30">Last 30 days</MenuItem>
                    <MenuItem value="custom">Choose custom date</MenuItem>
                </Select>
            </FormControl>

            {/* Custom Date Picker */}
            {showCustomDatePicker && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        onClick={(event) => setCalendarAnchorEl(event.currentTarget)}
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: 1,
                            width: 40,
                            height: 40,
                        }}
                    >
                        <Calendar className="w-5 h-5" />
                    </IconButton>

                    <Popover
                        open={Boolean(calendarAnchorEl)}
                        anchorEl={calendarAnchorEl}
                        onClose={() => setCalendarAnchorEl(null)}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Select Custom Date"
                                    value={customDate}
                                    onChange={(newValue) => {
                                        setCustomDate(newValue);
                                        setCalendarAnchorEl(null);
                                        // Show loading immediately when custom date is selected
                                        if (newValue) {
                                            setIsLoadingData(true);
                                        }
                                        // Reset to page 1 when changing date
                                        setCurrentPage(1);
                                    }}
                                    maxDate={new Date()} // Don't allow future dates
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: { width: 250 },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Popover>

                    {customDate && (
                        <Box
                            sx={{
                                fontSize: "0.875rem",
                                color: "text.secondary",
                                ml: 1,
                            }}
                        >
                            Selected: {customDate.toLocaleDateString()}
                        </Box>
                    )}
                </Box>
            )}
            <CommonButton variant="outline" className="!text-white !px-15 !bg-blue-950" onClick={handleExport}>
                Export
            </CommonButton>
        </div>
    );

    // Reusable function to calculate amount from pricing data
    const calculateAmount = (item) => {
        const subTotal = item.subTotal || "0";
        const internetHandlingCharge = item.internetHandlingCharge || "0";
        const gst = item.GST || "0";

        // Remove currency symbols, commas, and parentheses, then parse as float
        const subTotalValue = parseFloat(subTotal.replace(/[$,]/g, "")) || 0;
        const internetHandlingChargeValue = parseFloat(internetHandlingCharge.replace(/[$,]/g, "")) || 0;
        // For GST, extract the dollar amount after the $ symbol (e.g., "(18%) $1,129.14" -> 1129.14)
        const gstMatch = gst.match(/\$([0-9,]+\.?[0-9]*)/);
        const gstValue = gstMatch ? parseFloat(gstMatch[1].replace(/,/g, "")) : 0;

      

        const totalAmount = subTotalValue + internetHandlingChargeValue + gstValue;
        return totalAmount > 0 ? `$${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-";
    };

    // Map API response -> table row structure
    const mapInquiryToRow = (item, index) => {
        const reportTitle = item.reportId?.reportTitle || "-";
        const truncatedReportName = reportTitle.length > 48 ? reportTitle.substring(0, 48) + "..." : reportTitle;

        return {
            id: item.inquiryNo ? item.inquiryNo : index + 1,
            clientName: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
            companyName: item.companyName || "-",
            email: item.businessEmail || "-",
            contact: `${item.contactCode || ""} ${item.contactNo || ""}`.trim(),
            reportName: truncatedReportName,
            amount: calculateAmount(item),
            time: item.createdAt ? formatInquiryDateTime(item.createdAt) : "-",
            starred: item.isLiked === true, // Map isLiked field to starred property
            // Store the original data for displaying in the modal
            rawData: item,
        };
    };

    // Fetch data from API whenever page or limit changes
    const dispatch = useDispatch();
    const { data: inquiryData, total: totalItems, status, error: inquiryError } = useSelector((state) => state.inquiry);
    const loading = status === "loading" || isLoadingData;
    const error = status === "failed" ? inquiryError : null;

    // Fetch inquiries whenever page, limit, sorting, search, or date range changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const dateFilter = calculateDateFilter(range, customDate);
                await dispatch(
                    fetchInquiries({
                        page: currentPage,
                        limit: itemsPerPage,
                        type: "Checkout",
                        fieldName: sortField,
                        sort: sortDirection,
                        search: searchData,
                        date: dateFilter,
                    })
                );
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, sortField, sortDirection, dispatch, searchData, range, customDate]);

    // Sync local rows when redux data changes
    useEffect(() => {
        const mapped = inquiryData.map(mapInquiryToRow);
        setRows(mapped);
    }, [inquiryData]);

    // Reset pagination to page 1 when search changes
    useEffect(() => {
        if (searchData !== "") {
            setCurrentPage(1);
        }
    }, [searchData]);

    // Sync column sorting state with current sort parameters
    useEffect(() => {
        setColumns((prevCols) => {
            return prevCols.map((col) => {
                // Find the column that matches current sort field
                const backendField = columnToFieldMapping[col.id];
                if (backendField === sortField) {
                    return { ...col, sortDirection: sortDirection === 1 ? "asc" : "desc" };
                }
                return { ...col, sortDirection: false };
            });
        });
    }, [sortField, sortDirection]);

    // Row selection handler
    const handleSelect = (ids) => {
        setSelectedIds(ids);
    };

    function handleExport() {
        if (selectedIds.length === 0) {
            toast.error("Please select at least 1 record to export");
            return;
        }
        const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
        exportToExcel(selectedRows, columns, "checkouts.xlsx");
    }

    // Star toggle handler - now calls API
    const handleStar = async (id) => {
        try {
            // Find the inquiry to get the actual inquiry ID from rawData
            const inquiry = rows.find((row) => row.id === id);
            if (!inquiry || !inquiry.rawData) {
                toast.error("Unable to find inquiry data");
                return;
            }

            const inquiryId = inquiry.rawData._id || inquiry.rawData.inquiryNo;
            if (!inquiryId) {
                toast.error("Invalid inquiry ID");
                return;
            }

            // Call the API to toggle like/dislike
            const result = await dispatch(toggleInquiryLike(inquiryId));

            if (toggleInquiryLike.fulfilled.match(result)) {
                // Show success toast with the message from backend
                toast.success(result.payload.message);

                // Optionally refresh the data to get updated state
                dispatch(
                    fetchInquiries({
                        page: currentPage,
                        limit: itemsPerPage,
                        type: "Checkout",
                        fieldName: sortField,
                        sort: sortDirection,
                    })
                );
            } else {
                // Show error toast
                toast.error(result.payload || "Failed to update inquiry status");
            }
        } catch (error) {
            console.error("Error toggling inquiry like status:", error);
            toast.error("Failed to update inquiry status");
        }
    };

    // Sort handler - now uses backend sorting
    const handleSort = (columnId) => {
        // Get the backend field name for this column
        const backendField = columnToFieldMapping[columnId];
        if (!backendField) return; // Skip if no mapping found

        setColumns((prevCols) => {
            const newCols = prevCols.map((col) => {
                if (col.id === columnId) {
                    const newDir = col.sortDirection === "asc" ? "desc" : "asc";
                    return { ...col, sortDirection: newDir };
                }
                return { ...col, sortDirection: false };
            });

            const clickedCol = newCols.find((c) => c.id === columnId);
            if (clickedCol?.sortDirection) {
                // Update sorting state to trigger API call
                const newSortDirection = clickedCol.sortDirection === "asc" ? 1 : -1;
                setSortField(backendField);
                setSortDirection(newSortDirection);
                setCurrentPage(1); // Reset to first page when sorting changes
            }
            return newCols;
        });
    };

    // Handle star sorting - sort by isLiked field
    const handleStarSort = () => {
        // Toggle between liked items first (-1) and not liked first (1)
        const newSortDirection = sortField === "isLiked" && sortDirection === -1 ? 1 : -1;
        setSortField("isLiked");
        setSortDirection(newSortDirection);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    // Handle row click to show details modal
    const handleRowClick = (row) => {
        setSelectedInquiry(row);
        setModalOpen(true);
    };

    // Format data for InfoTable
    const formatInquiryForInfoTable = (inquiry) => {
        if (!inquiry) return [];

        // Extract data from the raw inquiry data
        const rawData = inquiry.rawData || {};
        const reportData = rawData.reportId || {};

        // Truncate report title for modal content
        const reportTitle = reportData.reportTitle || "-";
        const truncatedReportTitle = reportTitle !== "-" && reportTitle.length > 80 ? reportTitle.substring(0, 80) + "..." : reportTitle;

        // Format plan type for display
        const formatPlanType = (planType) => {
            if (!planType) return "-";
            // Convert camelCase to readable format
            switch (planType) {
                case "singleUserPrice":
                    return "Single User Price";
                case "multiUserPrice":
                    return "Multi User Price";
                case "enterprisePrice":
                    return "Enterprise Price";
                default:
                    // Fallback: convert camelCase to Title Case
                    return planType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
            }
        };

        // Checkout specific fields
        return [
            {
                label: "Inquiry ID",
                value: `${rawData.inquiryNo}`,
            },
            { label: "Time", value: rawData.createdAt ? new Date(rawData.createdAt).toLocaleString() : inquiry.time },
            { label: "Report", value: truncatedReportTitle, isMultiline: true },
            { label: "Plan Type", value: Array.isArray(rawData.planType) ? rawData.planType.join(", ") : rawData.planType },
            { label: "Total Amount", value: calculateAmount(rawData) },
            { label: "Payment Type", value: rawData.paymentType || "-" },
            { label: "Client Name", value: inquiry.clientName },
            { label: "Company Name", value: rawData.companyName || "-" },
            { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
            { label: "Contact No", value: rawData.contactNo || inquiry.contact },
            { label: "Job Role", value: rawData.jobRole || "-" },
            { label: "Report ID", value: reportData.reportNo || "-" },
            { label: "Domain", value: reportData.categoryId?.name || reportData.categoryId || "-" },
            { label: "Sub-Domain", value: reportData.subCategoryId?.name || reportData.subCategoryId || "-" },
            { label: "Company Address", value: rawData.companyAddress || "-" },
            { label: "City", value: rawData.city || "-" },
            { label: "State", value: rawData.state || "-" },
            { label: "Country", value: rawData.country || "-" },
            { label: "Zip Code", value: rawData.zipCode || "-" },
            { label: "Message", value: rawData.message || "-", isMultiline: true },
            { label: "Note", value: "-" }, // No note field in current data structure
        ].filter((item) => item.value && item.value !== "-"); // Filter out empty values
    };

    // Use server data directly since pagination and filtering are handled server-side
    const paginatedRows = rows;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Page heading */}
            <PageHeader title="Checkout Inquiries" rightContent={headerRight} />

            {/* Data table */}
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <DataTable
                    data={paginatedRows}
                    columns={columns}
                    selectable
                    starable
                    onSelect={handleSelect}
                    onStar={handleStar}
                    onSort={handleSort}
                    onStarSort={handleStarSort}
                    onRowClick={handleRowClick}
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

            {/* Details Modal */}
            <DetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={(() => {
                    const reportTitle = selectedInquiry?.rawData?.reportId?.reportTitle;
                    if (reportTitle) {
                        const truncatedTitle = reportTitle.length > 50 ? reportTitle.substring(0, 50) + "..." : reportTitle;
                        return `Checkout - ${truncatedTitle}`;
                    }
                    return "Checkout Details";
                })()}
                data={formatInquiryForInfoTable(selectedInquiry)}
            />
        </div>
    );
};

export default Checkouts;
