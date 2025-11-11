"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { actions } from "../../../redux/store";
import { useGetAllArticlesPaginationWiseQuery, useGetAllArticlesQuery } from "../../../api/blogs/blog";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Edit, ExternalLink } from "lucide-react";
import { API } from "@/utils/constants/api/schemas";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { format, isValid } from "date-fns";
import { useAccess } from "@/utils/constants/accessContext";
import { SearchHeader } from "@/components";
import { isValidArray } from "@/utils/validation/array";
import { isStatusInclude } from "@/utils/axiosInstance";

const { ARTICLE_CREATE_EDIT } = API;
const Articles = () => {
    const [searchData, setSearchData] = useState("");
    const [searchDataRes, setSearchDataRes] = useState([]);

    const { redirect } = useRouteRedirect();
    const { isButtonDisabled } = useAccess();
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

    const [allArticles, setAllArticles] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [sorting, setSorting] = useState({ sort: "-1", name: "createdAt" });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Adjust pageIndex for API (1-based indexing)
    const params = {
        page: pagination.pageIndex + 1, // Convert to 1-based for API
        limit: pagination.pageSize,
        sort: sorting?.sort,
        fieldName: sorting?.name,
        search: searchData,
    };

    const {
        data: getAllArticlesResponse,
        isLoading: isLoadingAllArticlesResponse,
        isFetching: isFetchingAllArticlesResponse,
        isError: isErrorAllArticlesResponse,
    } = useGetAllArticlesPaginationWiseQuery(params);

    const {
        data: getAllReportsCSVResponse,
        isLoading: isLoadingAllReportsCSVResponse,
        isFetching: isFetchingAllReportsCSVResponse,
        isError: isErrorAllReportsCSVResponse,
    } = useGetAllArticlesQuery(); // Adjust limit as needed

    useEffect(() => {
        if (!isStatusInclude(getAllArticlesResponse?.status)) return;
        const articles =
            isValidArray(getAllArticlesResponse?.data) &&
            getAllArticlesResponse?.data?.map((article) => ({
                ...article,
                id: article._id,
            }));
        searchData ? setSearchDataRes(articles) : setAllArticles(articles);
        setRowCount(getAllArticlesResponse?.totalRecordCount || 0);
    }, [getAllArticlesResponse, searchData]);

    const handleCreateEditArticle = (data) => {
        actions.modal.openCreateArticle({ data, open: true });
        if (data?._id) {
            actions?.articleForm?.createArticleForm({
                ...data,
                [ARTICLE_CREATE_EDIT?.CATEGORY_ID]: data?.[ARTICLE_CREATE_EDIT?.CATEGORY_ID]?._id,
                [ARTICLE_CREATE_EDIT?.SUBCATEGORY_ID]: data?.[ARTICLE_CREATE_EDIT?.SUBCATEGORY_ID]?._id,
            });
        }
    };

    const handleImportArticle = (data) => {
        actions.modal.openImportArticle({ data, open: true });
    };

    const truncateText = (text, maxLength) => {
        if (text?.length <= maxLength) {
            return text;
        }
        return text?.substring?.(0, maxLength) + "...";
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "blogTitle",
                header: "Article Name",
                enableSorting: true,
                Cell: ({ row }) => {
                    return (
                        <Tooltip title={row?.original?.blogTitle}>
                            <Typography component={"span"}>{truncateText(row?.original?.blogTitle, 40)}</Typography>
                        </Tooltip>
                    );
                },
            },
            {
                accessorKey: "type",
                header: "Article Type",
                enableSorting: true,
                Cell: ({ row }) => <Typography sx={{ padding: "5px", borderRadius: "4px" }}>{row.original?.type || "N/A"}</Typography>,
            },
            {
                accessorKey: "categoryUrl",
                header: "Domain",
                enableSorting: true,
                Cell: ({ row }) => <Typography sx={{ padding: "5px", borderRadius: "4px" }}>{row.original?.categoryId?.name || "N/A"}</Typography>,
            },
            {
                accessorKey: "subCategoryUrl",
                header: "Sub Domain",
                enableSorting: true,
                Cell: ({ row }) => <Typography sx={{ padding: "5px", borderRadius: "4px" }}>{row.original?.subCategoryId?.name || "N/A"}</Typography>,
            },
            {
                accessorKey: "createdAt",
                header: "Created Date",
                enableSorting: true,
                Cell: ({ row }) => (
                    <Typography sx={{ padding: "5px", borderRadius: "4px" }}>
                        {row?.original?.createdAt && isValid(new Date(row.original?.createdAt))
                            ? format(new Date(row.original?.createdAt), "hh:MMa  dd/MM/yyyy")
                            : "N/A"}
                        {/* {row.original?.createdAt || "N/A"} */}
                    </Typography>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                enableSorting: true,
                Cell: ({ row }) => <Typography sx={{ padding: "5px", borderRadius: "4px" }}>{row?.original?.status || "N/A"}</Typography>,
            },
            {
                accessorKey: "action",
                header: "Action",
                enableSorting: false,
                Cell: ({ row }) => (
                    <Box>
                        <IconButton onClick={() => handleCreateEditArticle(row?.original)} disabled={isButtonDisabled("update")}>
                            <Edit />
                        </IconButton>
                        {row?.original?.status === "Active" && (
                            <IconButton onClick={() => redirect(`blog/${row?.original?._id}`, false, true)}>
                                <ExternalLink />
                            </IconButton>
                        )}
                    </Box>
                ),
            },
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
        if (isValidArray(allArticles)) {
            return allArticles;
        }
        return []; // Fallback
    }, [searchData, allArticles, searchDataRes]);

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
        muiToolbarAlertBannerProps: isErrorAllArticlesResponse
            ? {
                  color: "error",
                  children: "Error loading data",
              }
            : undefined,
        state: { isLoading: isLoadingAllArticlesResponse || isFetchingAllArticlesResponse, ...{ pagination } },
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
                height: "calc(100vh - 225px)",
                overflow: "auto",
                whiteSpace: "nowrap",
                "& .MuiTableHead-root": { zIndex: 1 },
            },
        },
        muiTableFooterCellProps: {
            sx: { position: "sticky", bottom: 0, zIndex: 1 },
        },
    });

    const exportData = () => {
        if (!getAllReportsCSVResponse?.status) {
            console.error("Error occurred while exporting data");
            return;
        }

        const data = getAllReportsCSVResponse?.data || [];

        const headers = ["Articale Type", "categories", "Sub categories", "Blog Title", "Description"];

        const escapeCsvField = (field) => {
            if (field === null || field === undefined) return "";
            const str = String(field).replace(/"/g, '""').replace(/\n/g, " ");
            return `"${str}"`;
        };

        const csvRows = [
            headers.join(","),
            ...data.map((row) =>
                [
                    escapeCsvField(row?.type),
                    escapeCsvField(row?.categoryId?.name),
                    escapeCsvField(row?.subCategoryId?.name),
                    escapeCsvField(row?.blogTitle),
                    escapeCsvField(row?.Description),
                ].join(",")
            ),
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `blogs_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">Articles</Typography>
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
                        variant="contained"
                        sx={{ backgroundColor: "#D62035", borderRadius: "6px", fontWeight: 400, fontSize: "1rem" }}
                        onClick={() => handleCreateEditArticle({})}
                        disabled={isButtonDisabled("create")}
                    >
                        Add New Article
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleImportArticle({})}
                        sx={{ border: "1px solid #43464B4D", color: "#43464B", borderRadius: "6px", fontWeight: 400, fontSize: "1rem" }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={exportData}
                        sx={{ border: "1px solid #43464B4D", color: "#43464B", borderRadius: "6px", fontWeight: 400, fontSize: "1rem" }}
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

export default Articles;
