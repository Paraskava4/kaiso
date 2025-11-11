"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../../../components/shared/PageHeader";
import CommonButton from "../../../components/shared/CommonButton";
import { DataTable, StatusToggle } from "../../../components/shared/DataTable";
import { Loader } from "../../../components/shared/Loader";
import { Box } from "@mui/material";
import { Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdmins, updateAdminStatus } from "../../../redux/adminSlice";
import { toast } from "react-hot-toast";
import { useAccess } from "@/utils/constants/accessContext";

// Table column definitions
const initialColumns = [
    { id: "no", label: "No.", sortable: false },
    { id: "fullName", label: "Full Name", sortable: true },
    { id: "email", label: "Email Address", sortable: true },
    { id: "phoneNumber", label: "Phone Number", sortable: true },
    { id: "role", label: "Role", sortable: true },
    { id: "status", label: "Status", sortable: true },
    { id: "action", label: "Action", sortable: false },
];

const Role = () => {
    // Router
    const router = useRouter();
    const { isButtonDisabled } = useAccess();

    // Redux
    const dispatch = useDispatch();
    const { data: admins, total: totalItems, status, error, statusUpdateLoading } = useSelector((state) => state.admin);
    const loading = status === "loading";

    // Main data & UI states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [columns, setColumns] = useState(initialColumns);
    const [sortedAdmins, setSortedAdmins] = useState([]);

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchAllAdmins());
    }, [dispatch]);

    // Update sorted admins when admins data changes
    useEffect(() => {
        setSortedAdmins(admins);
    }, [admins]);

    // Sort handler
    const handleSort = (columnId) => {
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
                const dirMultiplier = clickedCol.sortDirection === "asc" ? 1 : -1;
                setSortedAdmins((prevAdmins) =>
                    [...prevAdmins].sort((a, b) => {
                        let aVal, bVal;

                        // Handle different column types
                        switch (columnId) {
                            case "fullName":
                                aVal = a.profile?.name || `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.email;
                                bVal = b.profile?.name || `${b.firstName || ""} ${b.lastName || ""}`.trim() || b.email;
                                break;
                            case "email":
                                aVal = a.email || "";
                                bVal = b.email || "";
                                break;
                            case "phoneNumber":
                                aVal = a.profile?.mobileNumber || "";
                                bVal = b.profile?.mobileNumber || "";
                                break;
                            case "status":
                                aVal = a.isActive ? "Active" : "Inactive";
                                bVal = b.isActive ? "Active" : "Inactive";
                                break;
                            default:
                                aVal = a[columnId] || "";
                                bVal = b[columnId] || "";
                        }

                        if (aVal > bVal) return dirMultiplier;
                        if (aVal < bVal) return -dirMultiplier;
                        return 0;
                    })
                );
            }
            return newCols;
        });
    };

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRows = sortedAdmins.slice(startIndex, endIndex);

    // Header right content
    const headerRight = (
        <CommonButton
            variant="primary"
            disabled={isButtonDisabled("create")}
            className="!text-white  !px-6 !bg-blue-950"
            onClick={() => {
                router.push("/admin/role/adminform");
            }}
        >
            Add admin
        </CommonButton>
    );

    // Handle status toggle
    const handleStatusToggle = async (userId) => {
        try {
            await dispatch(updateAdminStatus(userId)).unwrap();
            toast.success("Admin status updated successfully");
        } catch (error) {
            toast.error(error || "Failed to update admin status");
        }
    };

    const handleEdit = (id) => {
        router.push(`/admin/role/adminform?id=${id}`);
    };

    // Map admin data to table row format
    const mapAdminToRow = (admin, index) => ({
        id: admin._id,
        no: startIndex + index + 1,
        fullName: admin.profile?.name || `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || admin.email,
        email: admin.email,
        phoneNumber: admin.profile?.mobileNumber || "-",
        role: admin.role,
        statusActive: admin.isActive,
        rawData: admin,
    });

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <div className="flex flex-col gap-4 w-full">
                <PageHeader title="Role & Permissions" rightContent={headerRight} />

                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="text-red-500 p-4 text-center">{error}</div>
                ) : (
                    <DataTable
                        data={paginatedRows.map((admin, index) => {
                            const mappedRow = mapAdminToRow(admin, index);
                            return {
                                ...mappedRow,
                                status: (
                                    <StatusToggle
                                        checked={mappedRow.statusActive || false}
                                        onChange={() => handleStatusToggle(mappedRow.id)}
                                        disabled={statusUpdateLoading}
                                    />
                                ),
                                action: (
                                    <button
                                        onClick={() => handleEdit(mappedRow.id)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Edit"
                                        disabled={isButtonDisabled("update")}
                                    >
                                        <Edit className="text-gray-600" size={20} />
                                    </button>
                                ),
                            };
                        })}
                        columns={columns}
                        selectable={false}
                        starable={false}
                        onSort={handleSort}
                    />
                )}

                {/* Pagination controls */}
                {/* <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(size) => {
                        setItemsPerPage(size);
                        setCurrentPage(1);
                    }}
                /> */}
            </div>
        </Box>
    );
};

export default Role;
