"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import SearchHeader from "@/components/search/SearchHeader";
import CommonButton from "@/components/shared/CommonButton";
import { DataTable } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import { FormControl, Select, MenuItem, InputLabel, Box, Popover, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Calendar } from "lucide-react";
import { fetchInquiries, toggleInquiryLike } from "@/redux/inquirySlice";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "@/components/shared/DetailsModal";

import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-hot-toast";
import { formatInquiryDateTime } from "@/components/shared/dateFormat";

const columnToFieldMapping = {
    id: "inquiryNo",
    clientName: "firstName",
    subject: "subject",
    time: "createdAt",
    starred: "isLiked", // Add mapping for star sorting
};

const initialColumns = [
    { id: "id", label: "Inquiry No", sortable: true },
    { id: "clientName", label: "Client Name", sortable: true },
    { id: "email", label: "Email Address" },
    { id: "contact", label: "Contact No", minWidth: 180 },
    { id: "subject", label: "Subject", sortable: true },
    { id: "time", label: "Time", minWidth: 180, sortable: true },
];

const NeedCustomization = () => {
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

    // Map API response -> table row structure
    const mapInquiryToRow = (item, index) => ({
        id: item.inquiryNo ? item.inquiryNo : index + 1,
        clientName: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        email: item.businessEmail || item.email || "-",
        contact: `${item.contactCode || ""} ${item.contactNo || ""}`.trim(),
        subject: item.subject || "-",
        time: item.createdAt ? formatInquiryDateTime(item.createdAt) : "-",
        starred: item.isLiked === true, // Map isLiked field to starred property
        // Store the original data for displaying in the modal
        rawData: item,
    });

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
                        type: "Need Customization",
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
        exportToExcel(selectedRows, columns, "contact_us.xlsx");
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
                //         type: "Contact Us",
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

        // Create an array of objects for InfoTable - contact us specific fields
        return [
            {
                label: "Inquiry ID",
                value: `${rawData.inquiryNo}`,
            },
            { label: "Client Name", value: inquiry.clientName },
            { label: "Email", value: rawData.email || inquiry.email },
            { label: "Contact No", value: rawData.contactNo || inquiry.contact },
            { label: "Subject", value: rawData.subject || inquiry.subject || "-" },
            { label: "Company Name", value: rawData.companyName || "-" },
            { label: "Time", value: rawData.createdAt ? new Date(rawData.createdAt).toLocaleString() : inquiry.time },
            { label: "Message", value: rawData.message || "-", isMultiline: true },
        ].filter((item) => item.value && item.value !== "-"); // Filter out empty values
    };

    // Use server data directly since pagination and filtering are handled server-side
    const paginatedRows = rows;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Page heading */}
            <PageHeader title="Need Customization" rightContent={headerRight} />

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
                title="Contact Us Inquiry Details"
                data={formatInquiryForInfoTable(selectedInquiry)}
            />
        </div>
    );
};

export default NeedCustomization;
