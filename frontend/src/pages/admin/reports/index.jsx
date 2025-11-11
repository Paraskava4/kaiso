import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { actions } from "../../../redux/store";
import { useDeleteReportMutation, useGetAllReportPaginationWiseQuery } from "../../../api/reports/report";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Edit, ExternalLink } from "lucide-react";
import { API } from "@/utils/constants/api/schemas";
import { isValid } from "date-fns";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { useAccess } from "@/utils/constants/accessContext";
import { SearchHeader } from "@/components";
import { isValidArray } from "@/utils/validation/array";
import Swal from "sweetalert2";
import { format } from "date-fns-tz";
import { Trash2, Filter } from "lucide-react";

const { REPORT_CREATE_EDIT } = API;
const Reports = () => {
    const { redirect } = useRouteRedirect();
    const { isButtonDisabled } = useAccess();

    // Filter state
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [lastModifiedDate, setLastModifiedDate] = useState(null);

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

    const [allReports, setAllReports] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [searchData, setSearchData] = useState("");
    const [searchDataRes, setSearchDataRes] = useState([]);
    const [sorting, setSorting] = useState({ sort: "-1", name: "createdAt" });
    const [pagination, setPagination] = useState({
        pageIndex: 0, // Material React Table uses 0-based indexing
        pageSize: 10,
    });

    const truncateText = (text, maxLength) => {
        if (text?.length <= maxLength) {
            return text;
        }
        return text?.substring?.(0, maxLength) + "...";
    };

    // Status options for filter
    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Draft", label: "Draft" },
        { value: "Archived", label: "Archived" },
    ];

    // Filter handlers
    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleDateFilterChange = (date) => {
        setLastModifiedDate(date);
    };

    const handleClearFilters = () => {
        setStatusFilter("");
        setLastModifiedDate(null);
    };

    const handleApplyFilters = () => {
        // Apply filters logic here
        handleFilterClose();
    };

    // Adjust pageIndex for API (1-based indexing)
    const params = {
        page: pagination.pageIndex + 1, // Convert to 1-based for API
        limit: pagination.pageSize,
        sort: sorting?.sort,
        fieldName: sorting?.name,
        search: searchData,
        status: statusFilter, // Add status filter
        lastModifiedDate: lastModifiedDate ? format(lastModifiedDate, "yyyy-MM-dd") : "", // Add date filter
    };

    const {
        data: getAllReportsResponse,
        isLoading: isLoadingAllReportsResponse,
        isFetching: isFetchingAllReportsResponse,
        isError: isErrorAllReportsResponse,
    } = useGetAllReportPaginationWiseQuery(params, { refetchOnMountOrArgChange: true });

    // Fetch all data for CSV export (adjust limit if API supports it)`
    const {
        data: getAllReportsCSVResponse,
        isLoading: isLoadingAllReportsCSVResponse,
        isFetching: isFetchingAllReportsCSVResponse,
        isError: isErrorAllReportsCSVResponse,
    } = useGetAllReportPaginationWiseQuery({}); // Adjust limit as needed

    const [deleteReport] = useDeleteReportMutation();

    useEffect(() => {
        if (!getAllReportsResponse?.status) return; // Check for valid response
        setRowCount(getAllReportsResponse?.totalRecordCount || 0);
        searchData ? setSearchDataRes(getAllReportsResponse?.data || 0) : setAllReports(getAllReportsResponse?.data || []);
    }, [getAllReportsResponse, searchData]);

    const handleCreateEditReport = (data) => {
        actions.modal.openCreateReport({ data, open: true });
        if (data?._id) {
            actions?.reportForm?.createReportForm({
                ...data,
                [REPORT_CREATE_EDIT?.CATEGORY_ID]: data?.[REPORT_CREATE_EDIT?.CATEGORY_ID]?._id,
                [REPORT_CREATE_EDIT?.SUBCATEGORY_ID]: data?.[REPORT_CREATE_EDIT?.SUBCATEGORY_ID]?._id,
            });
        }
    };

    const handleDelete = (data) => {
        if (data?._id) {
            Swal.fire({
                title: "Are you sure?",
                text: "You are about to delete this report.",
                icon: "error",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                background: "#FFFFFF",
                color: "#333333",
                customClass: {
                    confirmButton: "delete-button",
                    cancelButton: "cancel-button",
                },
                confirmButtonColor: "#F27474",
                background: "#fff",
                color: "#333",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await deleteReport({ reportId: data?._id });
                }
            });
        } else {
            showErrorToast("Error deleting leave");
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "reportTitle",
                header: "Report Name",
                enableSorting: true,
                Cell: ({ row }) => {
                    return (
                        <Tooltip title={row?.original?.reportTitle}>
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: 12,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2, // limits to 2 lines
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {row?.original?.reportTitle}
                            </Typography>
                        </Tooltip>
                    );
                },
            },
            {
                accessorKey: "categoryUrl",
                header: "Domain",
                enableSorting: false,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontSize: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // limits to 2 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.original?.categoryId?.name || "N/A"}
                    </Typography>
                ),
            },
            {
                accessorKey: "subCategoryUrl",
                header: "Sub Domain",
                enableSorting: false,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontSize: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // limits to 2 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.original?.subCategoryId?.name || "N/A"}
                    </Typography>
                ),
            },
            {
                accessorKey: "publishDate",
                header: "Publish Date",
                enableSorting: true,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontSize: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // limits to 2 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row.original?.publishDate && isValid(new Date(row.original?.publishDate))
                            ? format(new Date(row.original?.publishDate), "hh:MMa  dd/MM/yyyy")
                            : "N/A"}
                    </Typography>
                ),
            },
            {
                accessorKey: "updatedAt",
                header: "Last Updated",
                enableSorting: true,
                Cell: ({ row }) => {
                    return (
                        <Typography
                            sx={{
                                fontSize: 12,
                                display: "-webkit-box",
                                WebkitLineClamp: 2, // limits to 2 lines
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {row?.original?.updatedAt && isValid(new Date(row?.original?.updatedAt))
                                ? format(new Date(row?.original?.updatedAt), "hh:mma, dd/MM/yyyy", {
                                      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                  })
                                : "N/A"}
                        </Typography>
                    );
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                enableSorting: true,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontSize: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // limits to 2 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {row?.original?.status || "N/A"}
                    </Typography>
                ),
            },
            {
                accessorKey: "action",
                header: "Action",
                enableSorting: false,
                Cell: ({ row }) => {
                    console.log("row?.original", row?.original?.url);

                    return (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton size="small" onClick={() => handleCreateEditReport(row?.original)} disabled={isButtonDisabled("update")}>
                                <Edit size={16} /> {/* smaller icon */}
                            </IconButton>

                            <IconButton size="small" color="error" onClick={() => handleDelete(row?.original)}>
                                <Trash2 className="w-5 h-5" />
                            </IconButton>

                            {row?.original?.status === "Active" && (
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        redirect(
                                            row?.original?.url ? `report-store/${row?.original?.url}` : `report-details?reportId=${row?.original?._id}`,
                                            false,
                                            true
                                        )
                                    }
                                >
                                    <ExternalLink size={16} /> {/* smaller icon */}
                                </IconButton>
                            )}
                        </Box>
                    );
                },
            },

            // {
            //     accessorKey: "action",
            //     header: "DELETE",
            //     enableSorting: false,
            //     Cell: ({ row }) => (
            //         <Box>
            //             <Button
            //                 variant="outlined"
            //                 color="error"
            //                 onClick={() => {
            //                     handleDelete(row?.original);
            //                 }}
            //                 sx={{ display: "flex", alignItems: "center" }}
            //             >
            //                 <DeleteOutlineOutlinedIcon /> <Typography>Delete</Typography>
            //             </Button>
            //         </Box>
            //     ),
            // },
        ],
        []
    );

    const dataToDisplay = useMemo(() => {
        if (searchData && !isValidArray(searchDataRes)) {
            return [];
        }
        if (isValidArray(searchDataRes) && searchData) {
            return searchDataRes;
        }
        if (isValidArray(allReports)) {
            return allReports;
        }
        return []; // Fallback
    }, [searchData, allReports, searchDataRes]);

    const table = useMaterialReactTable({
        columns,
        data: dataToDisplay,
        enableRowSelection: false,
        enableSorting: true,
        enableColumnActions: false,
        enableTopToolbar: false,
        initialState: { showColumnFilters: false },
        manualSorting: true,
        manualPagination: true,
        onPaginationChange: (updater) => {
            const newState = typeof updater === "function" ? updater(pagination) : updater;
            setPagination(newState); // Update local state
            return newState.pageSize; // If the function needs to return pageSize
        },
        onSortingChange: (e) => {
            const sortDirection = sorting.sort === "1" ? "-1" : "1";
            const fieldName = e()?.[0]?.id;
            return setSorting({ sort: sortDirection, name: fieldName });
        },
        muiToolbarAlertBannerProps: isErrorAllReportsResponse
            ? {
                  color: "error",
                  children: "Error loading data",
              }
            : undefined,
        state: { isLoading: isLoadingAllReportsResponse, ...{ pagination } },
        rowCount: rowCount,
        muiCircularProgressProps: {
            color: "primary",
            thickness: 5,
            size: 55,
        },
        muiTableBodyCellProps: {
            sx: { fontWeight: 600 },
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: "#F3F4F6",
                color: "#495057",
                fontWeight: 600,
                fontSize: "0.875rem",
                position: "sticky",
                top: 0,
            },
        },
        muiTableContainerProps: {
            sx: {
                height: "calc(100vh - 240px)",
                overflow: "auto",
                whiteSpace: "nowrap",
                "& .MuiTableHead-root": { zIndex: 1 },
            },
        },
        muiTableFooterCellProps: {
            sx: { position: "sticky", bottom: 0, zIndex: 1 },
        },
    });
    const handleImportReport = (data) => {
        actions.modal.openImportReport({ data, open: true });
    };

    const exportData = () => {
        if (!getAllReportsCSVResponse?.status) {
            return;
        }

        const data = getAllReportsCSVResponse?.data || [];

        const headers = [
            "Single User Price (Email PDF/ View Only)",
            "Busoiness Price (Global Site License) (Email PDF  + Printable + Downloadable)",
            "Enterprisewide Price (Global Site License) (Email PDF  + Printable + Downloadable)",
            "Pages",
            "Release Date",
            "Report Domain",
            "Report Subdomain",
            "Report Title",
            "Report Summary",
            "Table of Contents",
            "Available In",
            "Internet Handling Charge",
        ];

        const escapeCsvField = (field) => {
            if (field === null || field === undefined) return "";
            const str = String(field).replace(/"/g, '""').replace(/\n/g, " ");
            return `"${str}"`;
        };

        const csvRows = [
            headers.join(","),
            ...data.map((row) =>
                [
                    escapeCsvField(row?.singleUserPrice),
                    escapeCsvField(row?.businessPrice),
                    escapeCsvField(row?.entrepreneurPrice),
                    escapeCsvField(row?.pages),
                    escapeCsvField(row?.publishDate),
                    escapeCsvField(row?.categoryId?.name || ""),
                    escapeCsvField(row?.subCategoryId?.name || ""),
                    escapeCsvField(row?.reportTitle),
                    escapeCsvField(row?.reportOverview),
                    escapeCsvField(row?.tableOfContent),
                    escapeCsvField(row?.availableIn),
                    escapeCsvField(row?.internetHandlingCharge),
                ].join(",")
            ),
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reports_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Reports</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
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

                    <Button
                        disabled={isButtonDisabled("create")}
                        variant="contained"
                        sx={{ backgroundColor: "#D62035", borderRadius: "6px", fontWeight: 400, fontSize: "12px", height: 40, mt: 1 }}
                        onClick={() => handleCreateEditReport({})}
                    >
                        Add New Report
                    </Button>

                    {/* Filter Button */}
                    <Button
                        variant="outlined"
                        startIcon={<Filter className="w-5 h-5" />}
                        onClick={handleFilterClick}
                        sx={{
                            border: "1px solid #43464B4D",
                            color: "#43464B",
                            borderRadius: "6px",
                            fontWeight: 500,
                            fontSize: "12px",
                            backgroundColor: statusFilter || lastModifiedDate ? "#f0f8ff" : "transparent",
                            position: "relative",
                            height: 40,
                            mt: 1,
                        }}
                    >
                        Filter
                        {(statusFilter || lastModifiedDate) && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    backgroundColor: "#D62035",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {[statusFilter, lastModifiedDate].filter(Boolean).length}
                            </Box>
                        )}
                    </Button>

                    {/* Filter Menu */}
                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 300,
                                p: 1,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Filter Reports
                        </Typography>

                        {/* Status Filter */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} label="Status" onChange={handleStatusFilterChange}>
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Last Modified Date Filter */}
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Last Modified Date"
                                value={lastModifiedDate}
                                onChange={handleDateFilterChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        sx: { mb: 2 },
                                    },
                                }}
                            />
                        </LocalizationProvider> */}

                        {/* Filter Actions */}
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClearFilters}
                                sx={{
                                    border: "1px solid #43464B4D",
                                    color: "#43464B",
                                    borderRadius: "6px",
                                    fontWeight: 400,
                                    fontSize: "0.875rem",
                                }}
                            >
                                Clear
                            </Button>
                            {/* <Button
                                variant="contained"
                                onClick={handleApplyFilters}
                                sx={{
                                    backgroundColor: "#D62035",
                                    borderRadius: "6px",
                                    fontWeight: 400,
                                    fontSize: "0.875rem",
                                    "&:hover": {
                                        backgroundColor: "#B71C1C",
                                    },
                                }}
                            >
                                Apply
                            </Button> */}
                        </Box>

                        {/* Active Filters Summary */}
                        {(statusFilter || lastModifiedDate) && (
                            <Box sx={{ mt: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 500, color: "#666" }}>
                                    Active Filters:
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    {statusFilter && (
                                        <Typography variant="caption" sx={{ display: "block", color: "#333" }}>
                                            Status: {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                                        </Typography>
                                    )}
                                    {lastModifiedDate && (
                                        <Typography variant="caption" sx={{ display: "block", color: "#333" }}>
                                            Last Modified: {format(lastModifiedDate, "MMM dd, yyyy")}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Menu>
                    <Button
                        variant="outlined"
                        onClick={() => handleImportReport({})}
                        sx={{ border: "1px solid #43464B4D", color: "#43464B", borderRadius: "6px", fontWeight: 500, fontSize: "13px", height: 40, mt: 1 }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ border: "1px solid #43464B4D", color: "#43464B", borderRadius: "6px", fontWeight: 500, fontSize: "13px", height: 40, mt: 1 }}
                        onClick={exportData}
                    >
                        Export
                    </Button>
                </Box>
            </Box>
            <Box mt={2}>
                <MaterialReactTable table={table} />
            </Box>
        </Box>
    );
};

export default Reports;
