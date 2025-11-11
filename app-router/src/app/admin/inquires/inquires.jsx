"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/shared/PageHeader";

import CommonButton from "../../../components/shared/CommonButton";
import { DataTable } from "../../../components/shared/DataTable";
import Pagination from "../../../components/shared/Pagination";
import { Loader } from "../../../components/shared/Loader";
import { FormControl, Select, MenuItem, InputLabel, Box, Popover, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Calendar } from "lucide-react";
import { fetchInquiries, toggleInquiryLike } from "../../../redux/inquirySlice";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "../../../components/shared/DetailsModal";
import { exportToExcel } from "../../../utils/exportToExcel";
import { toast } from "react-hot-toast";
import { formatInquiryDateTime } from "../../../components/shared/dateFormat";
import { useAccess } from "@/utils/constants/accessContext";
import { SearchHeader } from "@/components";

// Mapping between frontend column IDs and backend field names
const columnToFieldMapping = {
    id: "inquiryNo",
    clientName: "firstName",
    inquiryType: "type",
    reportName: "reportName",
    time: "createdAt",
    starred: "isLiked", // Add mapping for star sorting
};

// Table column definitions
const initialColumns = [
    { id: "id", label: "Inquiry No", sortable: true },
    { id: "clientName", label: "Client Name", sortable: true },
    { id: "inquiryType", label: "Inquiry Type", sortable: true },
    { id: "email", label: "Email Address" },
    { id: "contact", label: "Contact No", minWidth: 180 },
    { id: "reportName", label: "Report Name", sortable: true, minWidth: 250, maxWidth: 320 },
    { id: "time", label: "Time", minWidth: 180, sortable: true },
];

const Inquires = () => {
    // Helper function to calculate date for server-side filtering
    const calculateDateFilter = (range, customDateValue = null) => {
        if (!range) return "";

        if (range === "custom") {
            if (!customDateValue) return "";
            // For custom date, use the selected date
            return customDateValue.toISOString();
        }

        const now = new Date();
        const days = parseInt(range, 10);

        if (isNaN(days)) return "";

        // Calculate the date N days ago
        const targetDate = new Date();
        targetDate.setDate(now.getDate() - days);

        // Return in ISO format as expected by the server
        return targetDate.toISOString();
    };

    // Access control
    const { isButtonDisabled } = useAccess();

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

    const [inquiry, setInquiry] = useState("");
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
            {/* <SearchBox
                data={rows}
                onResults={(results) => {
                    setSearchFilteredRows(results);
                    // Apply both search and date filters
                    const dateFiltered = filterByDateRange(results, range);
                    setFilteredRows(dateFiltered);
                }}
            /> */}
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
                    disabled={isButtonDisabled("read")}
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
            <FormControl sx={{ width: 200, height: 45, mt: 0.6 }} size="small">
                <InputLabel>Select Inquiry Type</InputLabel>
                <Select
                    value={inquiry}
                    onChange={(e) => {
                        setInquiry(e.target.value);
                        setCurrentPage(1);
                        // Show loading immediately when inquiry type changes
                        setIsLoadingData(true);
                    }}
                    label="Select Inquiry Type"
                    disabled={isButtonDisabled("read")}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    <MenuItem value="Checkout">Checkout</MenuItem>
                    <MenuItem value="Request For The Sample">Request For The Sample</MenuItem>
                    <MenuItem value="Inquiry Before Buy">Inquiry Before Buy</MenuItem>
                    <MenuItem value="Career Inquiry">Career</MenuItem>
                    <MenuItem value="Become a Reseller">Become a Reseller</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>
            <CommonButton variant="outline" className="!text-white !px-15 !bg-blue-950" onClick={handleExport} disabled={isButtonDisabled("read")}>
                Export
            </CommonButton>
        </div>
    );

    // Map API response -> table row structure
    const mapInquiryToRow = (item, index) => {
        const reportTitle = item.reportId?.reportTitle || "-";
        const truncatedReportName = reportTitle.length > 48 ? reportTitle.substring(0, 48) + "..." : reportTitle;

        return {
            id: item.inquiryNo ? item.inquiryNo : index + 1,
            clientName: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
            inquiryType: item.type || "-",
            email: item.businessEmail || "-",
            contact: `${item.contactCode || ""} ${item.contactNo || ""}`.trim(),
            reportName: truncatedReportName,
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const dateFilter = calculateDateFilter(range, customDate);
                await dispatch(
                    fetchInquiries({
                        page: currentPage,
                        limit: itemsPerPage,
                        type: inquiry,
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
    }, [currentPage, itemsPerPage, inquiry, sortField, sortDirection, dispatch, searchData, range, customDate]);

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
        exportToExcel(selectedRows, columns, "inquiries.xlsx");
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
                // dispatch(
                //     fetchInquiries({
                //         page: currentPage,
                //         limit: itemsPerPage,
                //         type: inquiry,
                //         fieldName: sortField,
                //         sort: sortDirection,
                //     })
                // );
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
        const inquiryType = rawData.type;

        // Define fields based on inquiry type
        let fieldsToShow = [];

        if (inquiryType === "Request For The Sample") {
            const reportTitle = reportData.reportTitle || "-";
            const truncatedReportTitle = reportTitle !== "-" && reportTitle.length > 80 ? reportTitle.substring(0, 80) + "..." : reportTitle;

            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Report", value: truncatedReportTitle, isMultiline: true },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Job Role", value: rawData.jobRole || "-" },
                { label: "Report ID", value: reportData.reportNo || "-" },
                { label: "Domain", value: reportData.categoryId?.name || reportData.categoryId || "-" },
                { label: "Sub-Domain", value: reportData.subCategoryId?.name || reportData.subCategoryId || "-" },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
                { label: "Note", value: "-" }, // No note field in current data structure
            ];
        } else if (inquiryType === "Checkout") {
            const reportTitle = reportData.reportTitle || "-";
            const truncatedReportTitle = reportTitle !== "-" && reportTitle.length > 80 ? reportTitle.substring(0, 80) + "..." : reportTitle;

            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Report", value: truncatedReportTitle, isMultiline: true },
                { label: "Plan Type", value: rawData.planType || "-" },
                { label: "Price", value: rawData.price || "-" },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Job Role", value: rawData.jobRole || "-" },
                { label: "Report ID", value: reportData.reportNo || "-" },
                { label: "Domain", value: reportData.categoryId?.name || reportData.categoryId || "-" },
                { label: "Sub-Domain", value: reportData.subCategoryId?.name || reportData.subCategoryId || "-" },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
                { label: "Note", value: "-" }, // No note field in current data structure
                { label: "Payment Type", value: rawData.paymentType || "-" },
            ];
        } else if (inquiryType === "Inquiry Before Buy") {
            const reportTitle = reportData.reportTitle || "-";
            const truncatedReportTitle = reportTitle !== "-" && reportTitle.length > 80 ? reportTitle.substring(0, 80) + "..." : reportTitle;

            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Report", value: truncatedReportTitle, isMultiline: true },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Job Role", value: rawData.jobRole || "-" },
                { label: "Report ID", value: reportData.reportNo || "-" },
                { label: "Domain", value: reportData.categoryId?.name || reportData.categoryId || "-" },
                { label: "Sub-Domain", value: reportData.subCategoryId?.name || reportData.subCategoryId || "-" },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
                { label: "Note", value: "-" }, // No note field in current data structure
            ];
        } else if (inquiryType === "Contact Us" || inquiryType === "Become a Reseller") {
            // For Contact Us and Become a Reseller - remove Inquiry Type
            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Job Role", value: rawData.jobRole || "-" },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
            ];
        } else if (inquiryType === "Other") {
            // For Other inquiries - specific fields based on API response
            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Page Name", value: rawData.pageName || "Other" },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Country", value: rawData.country || "-" },
                { label: "City", value: rawData.city || "-" },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
            ];
        } else {
            // For other inquiry types (Career, etc.)

            fieldsToShow = [
                {
                    label: "Inquiry ID",
                    value: `${rawData.inquiryNo || inquiry.inquiryNo}`,
                },
                { label: "Client Name", value: inquiry.clientName },
                { label: "Company Name", value: rawData.companyName || "-" },
                { label: "Business Mail", value: rawData.businessEmail || inquiry.email },
                { label: "Contact No", value: rawData.contactNo || inquiry.contact },
                { label: "Inquiry Type", value: rawData.type || inquiry.inquiryType },
                { label: "Job Role", value: rawData.jobRole || "-" },
                { label: "Time", value: rawData.createdAt ? formatInquiryDateTime(rawData.createdAt) : inquiry.time },
                { label: "Message", value: rawData.message || "-", isMultiline: true },
            ];
        }

        return fieldsToShow.filter((item) => item.value && item.value !== "-"); // Filter out empty values
    };

    // Use server data directly since pagination and filtering are handled server-side
    const paginatedRows = rows;

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <div className="flex flex-col gap-4 w-full">
                {/* Page heading */}
                <PageHeader title="All Inquires" rightContent={headerRight} />

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
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        setIsLoadingData(true);
                    }}
                    onItemsPerPageChange={(size) => {
                        setItemsPerPage(size);
                        setCurrentPage(1);
                        setIsLoadingData(true);
                    }}
                />

                {/* Details Modal */}
                <DetailsModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={(() => {
                        const inquiryType = selectedInquiry?.inquiryType || "";
                        const reportTitle = selectedInquiry?.rawData?.reportId?.reportTitle;
                        const reportInquiryTypes = ["Checkout", "Request For The Sample", "Inquiry Before Buy"];

                        if (reportInquiryTypes.includes(inquiryType) && reportTitle) {
                            const truncatedTitle = reportTitle.length > 50 ? reportTitle.substring(0, 50) + "..." : reportTitle;
                            return `${inquiryType} Inquiry - ${truncatedTitle}`;
                        }
                        return `Inquiry Details - ${inquiryType}`;
                    })()}
                    data={formatInquiryForInfoTable(selectedInquiry)}
                />
            </div>
        </Box>
    );
};

export default Inquires;
