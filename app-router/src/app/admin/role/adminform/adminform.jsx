"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Switch,
    FormControlLabel,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { ChevronRight, Trash2 } from "lucide-react";
import { styled } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import CommonButton from "../../../../components/shared/CommonButton";
import DeleteModal from "../../../../components/shared/modal/DeleteModal";
import { createAdminThunk, fetchAdminById, updateAdminThunk, deleteAdminThunk, clearSelectedAdmin } from "../../../../redux/adminSlice";
import { fetchMenus } from "../../../../api/pages";
import { changeAdminStatus } from "../../../../api/admin";
import { useAccess } from "@/utils/constants/accessContext";
import { useGetAllMenuQuery } from "@/api/menu";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
    padding: theme.spacing(2.5),
    backgroundColor: "#fff",
    maxWidth: "1670px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.5),
        gap: theme.spacing(1.5),
    },
}));

const FormRow = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(2),
    width: "100%",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        gap: theme.spacing(1.5),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    flex: "1 0 0",
    "& .MuiInputBase-root": {
        backgroundColor: "#fff",
        borderRadius: "4px",
        border: "0.5px solid rgba(0, 0, 0, 0.3)",
    },
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.5),
        fontSize: "14px",
        color: "#71717a",
    },
    "& .MuiInputLabel-root": {
        color: "#71717a",
        fontSize: "16px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
        },
    },
    "& .MuiInputBase-input::placeholder": {
        color: "#71717a",
        opacity: 1,
    },
}));

const StyledTable = styled(Table)(({ theme }) => ({
    border: "0.5px solid rgba(0, 0, 0, 0.3)",
    width: "100%",
    "& th, & td": {
        borderRight: "0.5px solid rgba(0, 0, 0, 0.3)",
        padding: theme.spacing(1.5),
        textAlign: "",
        "&:last-child": {
            borderRight: "none",
        },
    },
    "& tr": {
        borderBottom: "0.5px solid rgba(0, 0, 0, 0.3)",
        "&:last-child": {
            borderBottom: "none",
        },
    },
}));

const RolePermissionsForm = () => {
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { createLoading, selectedAdmin, fetchAdminLoading, updateLoading, deleteLoading } = useSelector((state) => state.admin);
    const { isButtonDisabled } = useAccess();
    // Check if we're in edit mode
    const adminId = searchParams.get("id");
    const isEditMode = Boolean(adminId);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contactNo: "",
        whatsappNo: "",
        assignRole: "",
        defaultPassword: "",
    });

    const [adminStatus, setAdminStatus] = useState(true);
    const [menus, setMenus] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch modules dynamically from API
    const { data: menuData, isLoading: menuLoading, error: menuError } = useGetAllMenuQuery();

    // Debug logging for menu data
    useEffect(() => {
        if (menuData) {
            console.log("Menu API Response:", menuData);
        }
        if (menuError) {
            console.error("Menu API Error:", menuError);
        }
    }, [menuData, menuError]);

    // Default menu IDs based on the API structure provided
    const defaultMenuIds = [
        "66ab26b6b2e3cfb8c8153d70",
        "66ab26b6b2e3cfb8c8153d71",
        "66ab26b6b2e3cfb8c8153d72",
        "66ab26b6b2e3cfb8c8153d73",
        "66ab26b6b2e3cfb8c8153d74",
        "66ab26b6b2e3cfb8c8153d75",
        "66ab26b6b2e3cfb8c8153d76",
        "66ab26b6b2e3cfb8c8153d77",
        "68b581c5accc125abe438816",
        // "66ab26b6b2e3cfb8c8153d78",
    ];

    // Get dynamic modules from API response with fallback
    const modules = React.useMemo(() => {
        if (menuData?.data && Array.isArray(menuData.data)) {
            const moduleNames = menuData.data.map((menu) => menu.name || "Unnamed Module").filter(Boolean);
            if (moduleNames.length > 0) {
                return moduleNames;
            }
        }
        // Fallback to default modules if API data is not available or empty
        console.warn("Using fallback modules - API data not available or empty");
        return [
            "Home",
            "Master",
            "Inquires",
            "Reports",
            "Articles",
            "Role",
            "Pages",
            "Reviews",
            "Career",
            // "Settings"
        ];
    }, [menuData]);

    // Get dynamic menu IDs from API response with fallback
    const dynamicMenuIds = React.useMemo(() => {
        if (menuData?.data && Array.isArray(menuData.data)) {
            const menuIds = menuData.data.map((menu) => menu._id).filter(Boolean);
            if (menuIds.length > 0) {
                return menuIds;
            }
        }
        // Fallback to default menu IDs if API data is not available or empty
        console.warn("Using fallback menu IDs - API data not available or empty");
        return defaultMenuIds;
    }, [menuData]);

    // Validate that modules and menu IDs have the same length
    React.useEffect(() => {
        if (modules.length !== dynamicMenuIds.length) {
            console.error("Modules and Menu IDs length mismatch:", {
                modulesLength: modules.length,
                menuIdsLength: dynamicMenuIds.length,
                modules,
                dynamicMenuIds,
            });
        }
    }, [modules, dynamicMenuIds]);

    const [permissions, setPermissions] = useState({});

    // Initialize permissions when dynamicMenuIds changes
    const initialPermissions = React.useMemo(() => {
        const permissions = {};
        dynamicMenuIds.forEach((menuId) => {
            permissions[menuId] = {
                create: false,
                read: false,
                update: false,
                delete: false,
            };
        });
        return permissions;
    }, [dynamicMenuIds]);

    // Update permissions when dynamicMenuIds changes
    useEffect(() => {
        setPermissions(initialPermissions);
    }, [initialPermissions]);

    const actions = ["Create", "Read", "Update", "Delete"];

    // Fetch menu data on component mount (optional - currently using hardcoded IDs)
    useEffect(() => {
        const loadMenus = async () => {
            try {
                const menuData = await fetchMenus();
                setMenus(menuData || []);
            } catch (error) {
                console.error("Error fetching menus:", error);
                // Continue with hardcoded menu IDs if API fails
            }
        };
        loadMenus();
    }, []);

    // Fetch admin data when in edit mode
    useEffect(() => {
        if (isEditMode && adminId) {
            dispatch(fetchAdminById(adminId));
        }

        // Clear selected admin when component unmounts or switches to create mode
        return () => {
            if (!isEditMode) {
                dispatch(clearSelectedAdmin());
            }
        };
    }, [dispatch, adminId, isEditMode]);

    // Populate form when admin data is loaded
    useEffect(() => {
        if (selectedAdmin && isEditMode) {
            setFormData({
                fullName: selectedAdmin.profile?.name || "",
                email: selectedAdmin.email || "",
                contactNo: selectedAdmin.profile?.mobileNumber?.toString() || "",
                whatsappNo: selectedAdmin.profile?.whatsappNumber?.toString() || "",
                assignRole: selectedAdmin.role || "",
                defaultPassword: "", // Don't populate password for security
            });

            setAdminStatus(selectedAdmin.isActive || false);

            // Populate permissions
            if (selectedAdmin.accessArray) {
                const newPermissions = { ...initialPermissions }; // Start with initial permissions
                selectedAdmin.accessArray.forEach((access) => {
                    const rawMenuId = access?.menuId;
                    const menuId = typeof rawMenuId === "object" ? rawMenuId?._id : rawMenuId;
                    if (!menuId) {
                        return; // skip entries with removed/missing menu
                    }
                    if (newPermissions.hasOwnProperty(menuId)) {
                        newPermissions[menuId] = {
                            create: access.create || false,
                            read: access.read || false,
                            update: access.update || false,
                            delete: access.delete || false,
                        };
                    }
                });
                setPermissions(newPermissions);
            }
        }
    }, [selectedAdmin, isEditMode, initialPermissions]);

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleAdminStatusToggle = async () => {
        if (isEditMode && adminId) {
            // In edit mode, call the status change API
            const loadingToast = toast.loading("Updating admin status...");

            try {
                await changeAdminStatus(adminId);

                // Update local state
                setAdminStatus((prev) => !prev);

                toast.success("Admin status updated successfully!", { id: loadingToast });

                // Optionally refresh the admin data
                dispatch(fetchAdminById(adminId));
            } catch (error) {
                console.error("Error updating admin status:", error);

                let errorMessage = "Failed to update admin status";

                if (error.response?.status === 404) {
                    errorMessage = "Admin not found";
                } else if (error.response?.status === 403) {
                    errorMessage = "You do not have permission to update admin status";
                } else if (error.response?.status === 401) {
                    errorMessage = "Authentication required. Please login again.";
                } else if (error.response?.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                toast.error(errorMessage, { id: loadingToast });
            }
        } else {
            // In create mode, just toggle the local state
            setAdminStatus((prev) => !prev);
        }
    };

    const handlePermissionChange = (menuId, action) => {
        setPermissions((prev) => ({
            ...prev,
            [menuId]: {
                ...prev[menuId],
                [action.toLowerCase()]: !prev[menuId]?.[action.toLowerCase()],
            },
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validate required fields with specific error messages
        if (!formData.fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Email Address is required");
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!formData.contactNo.trim()) {
            toast.error("Contact Number is required");
            return;
        }

        // Phone number validation (basic)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.contactNo.replace(/\D/g, ""))) {
            toast.error("Please enter a valid 10-digit contact number");
            return;
        }

        if (!formData.whatsappNo.trim()) {
            toast.error("WhatsApp Number is required");
            return;
        }

        if (!phoneRegex.test(formData.whatsappNo.replace(/\D/g, ""))) {
            toast.error("Please enter a valid 10-digit WhatsApp number");
            return;
        }

        if (!formData.assignRole) {
            toast.error("Please select a role");
            return;
        }

        // Password validation - required for create, optional for update
        if (!isEditMode) {
            if (!formData.defaultPassword.trim()) {
                toast.error("Default Password is required");
                return;
            }

            if (formData.defaultPassword.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }
        } else if (formData.defaultPassword && formData.defaultPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        // Check if at least one permission is selected
        const hasAnyPermission = dynamicMenuIds.some(
            (menuId) => permissions[menuId]?.create || permissions[menuId]?.read || permissions[menuId]?.update || permissions[menuId]?.delete
        );

        if (!hasAnyPermission) {
            toast.error("Please select at least one permission for the admin user");
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading(isEditMode ? "Updating admin..." : "Creating admin...");

        try {
            // Prepare access array from permissions
            const accessArray = dynamicMenuIds.map((menuId) => ({
                menuId,
                create: permissions[menuId]?.create || false,
                read: permissions[menuId]?.read || false,
                update: permissions[menuId]?.update || false,
                delete: permissions[menuId]?.delete || false,
            }));

            // Prepare API payload
            const payload = {
                email: formData.email,
                name: formData.fullName,
                role: formData.assignRole,
                mobileNumber: parseInt(formData.contactNo),
                whatsappNumber: parseInt(formData.whatsappNo),
                accessArray,
            };

            // Add password only if provided (for create mode it's required, for update it's optional)
            if (formData.defaultPassword) {
                payload.password = formData.defaultPassword;
            }

            // Add userId for update mode
            if (isEditMode) {
                payload.userId = adminId;
            }

            const result = await dispatch(isEditMode ? updateAdminThunk(payload) : createAdminThunk(payload)).unwrap();

            if (result) {
                toast.success(isEditMode ? "Admin updated successfully!" : "Admin created successfully!", { id: loadingToast });
                redirect("admin/role");
            }
        } catch (error) {
            console.error("Error creating admin:", error);

            // Handle different types of errors
            let errorMessage = isEditMode ? "Failed to update admin" : "Failed to create admin";

            if (typeof error === "string") {
                errorMessage = error;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error?.response?.data?.errors) {
                // Handle validation errors array
                const errors = error.response.data.errors;
                if (Array.isArray(errors) && errors.length > 0) {
                    errorMessage = errors.map((err) => err.message || err).join(", ");
                } else {
                    errorMessage = "Validation errors occurred";
                }
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.response?.status) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = "Invalid data provided. Please check all fields.";
                        break;
                    case 401:
                        errorMessage = "Unauthorized. Please login again.";
                        break;
                    case 403:
                        errorMessage = "You do not have permission to create admin users.";
                        break;
                    case 409:
                        errorMessage = "Admin with this email already exists.";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later.";
                        break;
                    default:
                        errorMessage = `Error: ${error.response.status}`;
                }
            }

            toast.error(errorMessage, { id: loadingToast });
        }
    };

    const handleCancel = () => {
        redirect("admin/role");
    };

    const handleDelete = () => {
        if (!isEditMode || !adminId) return;
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const loadingToast = toast.loading("Deleting admin...");

        try {
            await dispatch(deleteAdminThunk(adminId)).unwrap();
            toast.success("Admin deleted successfully!", { id: loadingToast });
            setShowDeleteModal(false);
            redirect("admin/role");
        } catch (error) {
            console.error("Error deleting admin:", error);
            let errorMessage = "Failed to delete admin";

            if (typeof error === "string") {
                errorMessage = error;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, { id: loadingToast });
            setShowDeleteModal(false);
        }
    };

    // Show loading when fetching admin data in edit mode
    if (isEditMode && fetchAdminLoading) {
        return (
            <StyledBox component="main">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography>Loading admin data...</Typography>
                </Box>
            </StyledBox>
        );
    }

    // Show loading when fetching menu data
    if (menuLoading) {
        return (
            <StyledBox component="main">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <Typography>Loading permissions data...</Typography>
                </Box>
            </StyledBox>
        );
    }

    return (
        <>
            <StyledBox component="main">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 } }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" } }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            Role & Permissions
                        </Typography>
                        <ChevronRight className="w-5 h-5 text-[#5AB1E0]" />
                        <Typography variant="h6" fontWeight="medium">
                            {isEditMode ? "Edit Admin" : "Add New Role"}
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={<Switch checked={adminStatus} onChange={handleAdminStatusToggle} color="primary" />}
                        label="Admin Status"
                        labelPlacement="start"
                        sx={{ color: "#71717a" }}
                    />
                </Box>

                <Box component="form" onSubmit={handleSave} display="flex" flexDirection="column" gap={2} width="100%">
                    <FormRow>
                        <StyledTextField
                            label="Full Name"
                            placeholder="Add Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange("fullName")}
                            type="text"
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="Email Address"
                            placeholder="Please write Email Address"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            type="email"
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="Contact No"
                            placeholder="Please write contact no"
                            value={formData.contactNo}
                            onChange={handleInputChange("contactNo")}
                            type="tel"
                            required
                            fullWidth
                        />
                        <StyledTextField
                            label="WhatsApp No"
                            placeholder="Please write WhatsApp no"
                            value={formData.whatsappNo}
                            onChange={handleInputChange("whatsappNo")}
                            type="tel"
                            required
                            fullWidth
                        />
                    </FormRow>

                    <FormRow>
                        <FormControl fullWidth required sx={{ flex: "1 0 0", maxWidth: { md: "400px" } }}>
                            <InputLabel sx={{ color: "#71717a", fontSize: "16px" }}>Assign Role</InputLabel>
                            <Select
                                value={formData.assignRole}
                                onChange={handleInputChange("assignRole")}
                                label="Assign Role"
                                sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                    border: "0.5px solid rgba(0, 0, 0, 0.3)",
                                    "& .MuiSelect-select": {
                                        padding: "12px",
                                        fontSize: "14px",
                                        color: "#71717a",
                                    },
                                }}
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Writer">Writer</MenuItem>
                                <MenuItem value="Sales">Sales</MenuItem>
                            </Select>
                        </FormControl>
                        <StyledTextField
                            label={isEditMode ? "New Password (Optional)" : "Default Password"}
                            placeholder="******"
                            value={formData.defaultPassword}
                            onChange={handleInputChange("defaultPassword")}
                            type="password"
                            required={!isEditMode}
                            sx={{ maxWidth: { md: "400px" }, width: "100%" }}
                        />
                    </FormRow>
                </Box>

                <Divider
                    sx={{
                        width: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.3)",
                        borderStyle: "dotted",
                        borderWidth: "1px 0 0 0",
                    }}
                />

                <Box component="section">
                    <Typography variant="h6" fontWeight="medium" mb={2}>
                        Permissions
                    </Typography>
                    {menuLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <Typography>Loading permissions...</Typography>
                        </Box>
                    ) : menuError ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <Typography color="error">Error loading permissions. Using default modules.</Typography>
                        </Box>
                    ) : (
                        <StyledTable aria-label="Permissions matrix">
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th" scope="col"></TableCell>
                                    {actions.map((action) => (
                                        <TableCell key={action} component="th" scope="col" align="center">
                                            <Typography variant="body1" fontWeight="medium">
                                                {action}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modules
                                    .map((module, index) => {
                                        const menuId = dynamicMenuIds[index];
                                        // Skip rendering if menuId is not available
                                        if (!menuId) {
                                            console.warn(`Menu ID not available for module ${module} at index ${index}`);
                                            return null;
                                        }
                                        return (
                                            <TableRow key={menuId}>
                                                <TableCell component="th" scope="row" align="left">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {module}
                                                    </Typography>
                                                </TableCell>
                                                {actions.map((action) => (
                                                    <TableCell key={`${menuId}-${action}`} align="center">
                                                        <input
                                                            type="checkbox"
                                                            checked={permissions[menuId]?.[action.toLowerCase()] || false}
                                                            onChange={() => handlePermissionChange(menuId, action)}
                                                            aria-label={`${action} permission for ${module}`}
                                                            style={{ width: "16px", height: "16px", border: "1.5px solid #71717a", borderRadius: "2px" }}
                                                        />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })
                                    .filter(Boolean)}
                            </TableBody>
                        </StyledTable>
                    )}
                </Box>

                <Box display="flex" gap={2} width="100%" sx={{ flexDirection: { xs: "column", md: "row" } }}>
                    <CommonButton
                        onClick={handleSave}
                        variant="primary"
                        className="!text-white !px-15 !bg-blue-950"
                        loading={isEditMode ? updateLoading : createLoading}
                        disabled={isEditMode ? updateLoading : createLoading || fetchAdminLoading || menuLoading}
                    >
                        {isEditMode ? (updateLoading ? "Updating..." : "Update") : createLoading ? "Creating..." : "Save"}
                    </CommonButton>
                    <CommonButton
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isEditMode ? updateLoading : createLoading || fetchAdminLoading || menuLoading}
                    >
                        Cancel
                    </CommonButton>
                    {isEditMode && (
                        <CommonButton
                            onClick={handleDelete}
                            variant="outline"
                            className="!text-red-600 !border-red-600 hover:!bg-red-50"
                            loading={deleteLoading}
                            disabled={deleteLoading || updateLoading || fetchAdminLoading || menuLoading || isButtonDisabled("delete")}
                            startIcon={<Trash2 className="w-5 h-5" />}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </CommonButton>
                    )}
                </Box>
            </StyledBox>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={formData.fullName || "this admin"}
                isLoading={deleteLoading}
                description="This action cannot be undone. The admin user will lose access to the system and all associated permissions will be removed."
                type="admin"
                title="Delete Admin User"
                confirmText="Delete Admin"
                cancelText="Cancel"
            />
        </>
    );
};

export default RolePermissionsForm;
