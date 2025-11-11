"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CommonButton from "@/components/shared/CommonButton";
import { DataTable } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import { Loader } from "@/components/shared/Loader";
import { fetchCareerInquiries } from "@/redux/careerSlice";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "@/components/shared/DetailsModal";

import { exportToExcel } from "@/utils/exportToExcel";
import { toast } from "react-hot-toast";
import { formatInquiryDateTime } from "@/components/shared/dateFormat";

const Career = () => {
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
    const [isLoadingData, setIsLoadingData] = useState(false);
    // Main data & UI states
    const [rows, setRows] = useState([]); // data from API
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Function to handle resume opening in new tab
    const handleResumeOpen = (resumeUrl) => {
        if (!resumeUrl) return;
        
        window.open(resumeUrl, '_blank');
    };

    // Column definitions for Career Inquiries page with custom render for resume
    const columns = [
        { id: "inquiryNo", label: "Inquiry No" },
        { id: "clientName", label: "Client Name" },
        { id: "email", label: "Email Address" },
        { 
            id: "resume", 
            label: "Resume",
            render: (value) => {
                if (!value) return "Not Available";
                
                // Extract filename from URL
                const filename = value.split('/').pop();
                
                return (
                    <span
                        className="text-blue-600 cursor-pointer hover:text-blue-800 underline"
                        onClick={() => handleResumeOpen(value)}
                    >
                        {filename}
                    </span>
                );
            }
        },
        { id: "contact", label: "Contact No", minWidth: 180 },
        { id: "time", label: "Time", minWidth: 180 },
    ];

    // Header UI (after state definitions)
    const headerRight = (
        <div className="flex items-center gap-2">
            <CommonButton variant="outline" className="!text-white !px-15 !bg-blue-950" onClick={handleExport}>
                Export
            </CommonButton>
        </div>
    );

    // Map API response -> table row structure
    const mapCareerToRow = (item, index) => ({
        id: item._id ? item.inquiryNo : index + 1,
        inquiryNo: item._id ? item._id.substring(0, 4) : (index + 1).toString().substring(0, 4),
        clientName: item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        email: item.email || "-",
        contact: `${item.contactCode || ""} ${item.contactNo || ""}`.trim(),
        resume: item.resume || null,
        time: item.createdAt ? formatInquiryDateTime(item.createdAt) : "-",
        // Store the original data for displaying in the modal
        rawData: item,
    });

    // Fetch data from API whenever page or limit changes
    const dispatch = useDispatch();
    const { data: careerData, total: totalItems, status, error: careerError } = useSelector((state) => state.career);
    const loading = status === "loading" || isLoadingData;
    const error = status === "failed" ? careerError : null;

    // Fetch career inquiries whenever page, limit, or date range changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const dateFilter = calculateDateFilter(range, customDate);
                await dispatch(
                    fetchCareerInquiries({
                        page: currentPage,
                        limit: itemsPerPage,
                        fieldName: "createdAt",
                        sort: -1,
                        search: "",
                        date: dateFilter,
                    })
                );
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, dispatch, range, customDate]);

    // Sync local rows when redux data changes
    useEffect(() => {
        const mapped = careerData.map(mapCareerToRow);
        setRows(mapped);
    }, [careerData]);

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
        exportToExcel(selectedRows, columns, "career_inquiry.xlsx");
    }

    // Handle row click to show details modal
    const handleRowClick = (row) => {
        setSelectedInquiry(row);
        setModalOpen(true);
    };

    // Format data for InfoTable
    const formatCareerForInfoTable = (career) => {
        if (!career) return [];

        // Extract data from the raw career inquiry data
        const rawData = career.rawData || {};

        // Create an array of objects for InfoTable - career-specific fields
        return [
            {
                label: "Inquiry ID",
                value: `${(rawData._id || career.id).substring(0, 8)}`,
            },
            { label: "Client Name", value: career.clientName },
            { label: "Business Mail", value: rawData.email || career.email },
            { 
                label: "Resume", 
                value: rawData.resume ? (
                    <span
                        className="text-blue-600 cursor-pointer hover:text-blue-800 underline"
                        onClick={() => handleResumeOpen(rawData.resume)}
                    >
                        {rawData.resume.split('/').pop()}
                    </span>
                ) : "Not Available"
            },
            { label: "Contact No", value: rawData.contactNo || career.contact },
            { label: "Experience", value: rawData.experience || "-" },
            { label: "Skills", value: rawData.skills || "-" },
            { label: "Time", value: rawData.createdAt ? new Date(rawData.createdAt).toLocaleString() : career.time },
            { label: "Cover Letter", value: rawData.coverLetter || "-", isMultiline: true },
            { label: "Message", value: rawData.message || "-", isMultiline: true },
        ].filter((item) => item.value && item.value !== "-"); // Filter out empty values
    };

    // Use server data directly since pagination and filtering are handled server-side
    const paginatedRows = rows;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Page heading */}
            <PageHeader title="Career Inquiries" rightContent={headerRight} />

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
                    onSelect={handleSelect}
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
                title="Career Inquires"
                data={formatCareerForInfoTable(selectedInquiry)}
            />
        </div>
    );
};

export default Career;
