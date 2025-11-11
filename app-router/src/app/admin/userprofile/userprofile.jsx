"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchUserProfile, updateProfile, updateProfileWithImage } from "../../../redux/profileSlice";
import AvatarUpload from "../../../components/shared/modal/avatarupload";
import { BASE_URL } from "../../../../config";

const FormField = ({ label, required = false, children, className = "" }) => (
    <div className={`flex relative flex-col gap-2 justify-center items-center flex-[1_0_0] ${className}`}>
        <div className="flex relative items-start self-stretch">
            <label className="relative text-base leading-6 text-zinc-500 max-md:text-base max-sm:text-sm">{label}</label>
            {required && (
                <span className="relative text-base text-red-600" aria-label="required">
                    *
                </span>
            )}
        </div>
        {children}
    </div>
);

// Input field component
const InputField = ({ value, onChange, placeholder, disabled = false, type = "text", icon = null, className = "", ...props }) => (
    <div
        className={`flex relative gap-2.5 justify-center items-center self-stretch p-3 rounded-md border-solid border-[0.5px] border-zinc-700 border-opacity-30 max-sm:p-2.5 ${
            disabled ? "bg-gray-100 border-lime-900 border-opacity-30" : "bg-white"
        } ${className}`}
    >
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`relative text-sm leading-5 flex-[1_0_0] bg-transparent border-none outline-none max-md:text-sm max-sm:text-xs ${
                disabled ? "text-zinc-500" : "text-zinc-900"
            }`}
            {...props}
        />
        {icon && <div className="flex-shrink-0">{icon}</div>}
    </div>
);

// Textarea field component
const TextareaField = ({ value, onChange, placeholder, disabled = false, className = "", ...props }) => (
    <div
        className={`flex relative gap-2.5 items-start self-stretch p-3 rounded-md border-solid border-[0.5px] border-zinc-700 border-opacity-30 min-h-20 max-sm:p-2.5 ${
            disabled ? "bg-gray-100" : "bg-white"
        } ${className}`}
    >
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`relative text-sm leading-5 flex-[1_0_0] bg-transparent border-none outline-none resize-none max-md:text-sm max-sm:text-xs ${
                disabled ? "text-zinc-500" : "text-zinc-500"
            }`}
            rows={4}
            {...props}
        />
    </div>
);

// Custom Button component
const CustomButton = ({ children, variant = "primary", onClick, className = "", ...props }) => {
    const baseClasses =
        "flex relative gap-2.5 justify-center items-center px-5 py-2.5 rounded-md border-solid cursor-pointer border-[0.5px] border-zinc-700 border-opacity-30 min-w-[150px] max-md:px-4 max-md:py-2 max-md:min-w-[120px] max-sm:flex-1 max-sm:max-w-[150px] max-sm:min-w-[auto]";

    const variantClasses = variant === "primary" ? "bg-sky-900 text-white" : "bg-white text-zinc-700";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
            <div className="relative w-0 h-0" />
            <span className="relative text-base leading-6 text-center flex-[1_0_0]">{children}</span>
        </button>
    );
};

// UserDetailRow component
const UserDetailRow = ({ label, value }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                flex: 1,
                gap: 2,
                alignItems: "center",
                py: 2,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                minWidth: 240,
            }}
        >
            <Typography variant="body1" fontWeight="medium" color="text.primary" sx={{ flex: 1 }}>
                {label}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                {value}
            </Typography>
        </Box>
    );
};

// AboutSection component
const AboutSection = ({ userDetails }) => {
    return (
        <Paper elevation={0} sx={{ mt: 2, width: "100%", bgcolor: "background.paper" }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6" fontWeight="medium">
                    About Me
                </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%" }}>
                    <UserDetailRow label="Full Name" value={userDetails.fullName} />
                    <UserDetailRow label="Email Address" value={userDetails.email} />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1, width: "100%" }}>
                    <UserDetailRow label="Contact No" value={userDetails.contactNo || "Not provided"} />
                    <UserDetailRow label="Birth date" value={userDetails.birthDate || "Not provided"} />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1, width: "100%" }}>
                    <UserDetailRow label="Role" value={userDetails.role} />
                    <UserDetailRow label="User ID" value={userDetails.userId} />
                </Box>

                <Box sx={{ py: 2, mt: 1, borderBottom: "0.5px solid", borderColor: "divider", minHeight: 70 }}>
                    <Typography variant="body1" fontWeight="medium" color="text.primary">
                        Description About Me
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {userDetails.description || "No description provided"}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

const AboutMeForm = ({ userDetails, onSave, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        fullName: userDetails.fullName,
        email: userDetails.email,
        contactNo: userDetails.contactNo,
        role: userDetails.role,
        birthdate: userDetails.birthDate,
        userId: userDetails.userId,
        description: userDetails.description,
    });

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="flex relative flex-col items-start self-stretch bg-white">
            {/* Header Section */}
            <header className="box-border flex relative justify-between items-center self-stretch px-5 py-2.5 w-full border-b border-solid border-b-zinc-700 border-b-opacity-30 max-md:px-4 max-md:py-2 max-sm:flex-col max-sm:gap-3 max-sm:px-4 max-sm:py-3">
                <h1 className="relative text-base font-medium leading-6 text-zinc-900">About Me</h1>
                <div className="flex relative gap-2.5 items-center max-sm:justify-center max-sm:w-full">
                    <CustomButton variant="primary" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </CustomButton>
                    <CustomButton variant="secondary" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </CustomButton>
                </div>
            </header>

            {/* Form Section */}
            <main className="box-border flex relative flex-col gap-2.5 items-center self-stretch p-5 w-full max-md:gap-4 max-md:p-4 max-sm:px-4 max-sm:py-3">
                <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                    {/* First Row */}
                    <fieldset className="flex relative gap-8 items-start self-stretch w-full max-md:gap-5 max-sm:flex-col max-sm:gap-4 mb-2.5">
                        <legend className="sr-only">Personal Information</legend>

                        <FormField label="Full Name" required>
                            <InputField
                                value={formData.fullName}
                                onChange={handleInputChange("fullName")}
                                placeholder="Add Full Name"
                                aria-label="Full Name"
                                required
                            />
                        </FormField>

                        <FormField label="Email Address">
                            <InputField
                                value={formData.email}
                                onChange={handleInputChange("email")}
                                placeholder="johndoe@gmail.com"
                                disabled
                                type="email"
                                aria-label="Email Address"
                            />
                        </FormField>

                        <FormField label="Contact No" required>
                            <InputField
                                value={formData.contactNo}
                                onChange={handleInputChange("contactNo")}
                                placeholder="+91 958 958 958 5"
                                type="tel"
                                aria-label="Contact Number"
                                required
                            />
                        </FormField>
                    </fieldset>

                    {/* Second Row */}
                    <fieldset className="flex relative gap-8 items-start self-stretch w-full max-md:gap-5 max-sm:flex-col max-sm:gap-4 mb-2.5">
                        <legend className="sr-only">Professional Information</legend>

                        <FormField label="Role" required>
                            <InputField value={formData.role} onChange={handleInputChange("role")} placeholder="Writer" disabled aria-label="Role" />
                        </FormField>

                        <FormField label="Birthdate" required>
                            <InputField
                                value={formData.birthdate}
                                onChange={handleInputChange("birthdate")}
                                placeholder="Choose your birthdate"
                                type="date"
                                aria-label="Birthdate"
                                required
                            />
                        </FormField>

                        <FormField label="User ID" required>
                            <InputField value={formData.userId} onChange={handleInputChange("userId")} placeholder="#1" disabled aria-label="User ID" />
                        </FormField>
                    </fieldset>

                    {/* Third Row */}
                    <fieldset className="flex relative gap-8 items-start self-stretch w-full max-md:gap-5 max-sm:flex-col max-sm:gap-4">
                        <legend className="sr-only">Additional Information</legend>

                        <FormField label="Description About Me" required className="w-full">
                            <TextareaField
                                value={formData.description}
                                onChange={handleInputChange("description")}
                                placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur nostrum placeat quis ratione similique. A alias culpa debitis deserunt dicta earum eius excepturi, facere maiores quia quos saepe ullam ut!"
                                aria-label="Description About Me"
                                required
                            />
                        </FormField>
                    </fieldset>
                </form>
            </main>
        </div>
    );
};

// ProfileHeader component
const ProfileHeader = ({ user, backgroundImage, onEditProfile, isEditing, onEditAvatar, onDeleteAvatar, profileImagePreview }) => {
    
    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            <Box
                sx={{
                    position: "relative",
                    height: 200,
                    p: 2,
                    overflow: "hidden",
                }}
            >
                <Image src={backgroundImage} alt="Profile background" fill style={{ objectFit: "cover" }} priority />
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", color: "common.white" }}>
                        <Box
                            sx={{
                                position: "relative",
                                width: 180,
                                height: 180,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "3px solid",
                                borderColor: "common.white",
                            }}
                        >
                            <Image src={profileImagePreview || user.profileImage} alt={`${user.name}'s profile`} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            {!isEditing && (
                                <>
                                    <Typography variant="h5" fontWeight="semibold">
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {user.role}
                                    </Typography>
                                </>
                            )}
                            {isEditing && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit className="w-5 h-5" />}
                                        onClick={onEditAvatar}
                                        sx={{
                                            borderRadius: "99px",
                                            textTransform: "none",
                                            px: 2.5,
                                            py: 0.5,
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                            color: "#fff",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            boxShadow: "none",
                                            backdropFilter: "blur(4px)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Trash2 className="w-5 h-5" />}
                                        onClick={onDeleteAvatar}
                                        sx={{
                                            borderRadius: "99px",
                                            textTransform: "none",
                                            px: 2.5,
                                            py: 0.5,
                                            fontWeight: 500,
                                            fontSize: "0.9rem",
                                            color: "#fff",
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            boxShadow: "none",
                                            backdropFilter: "blur(4px)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                                boxShadow: "none",
                                            },
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Box>
                    {!isEditing && (
                        <Stack direction="row" spacing={1} sx={{ pb: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<EditOutlinedIcon />}
                                onClick={onEditProfile}
                                sx={{
                                    borderRadius: "99px",
                                    textTransform: "none",
                                    px: 2.5,
                                    py: 0.5,
                                    fontWeight: 500,
                                    fontSize: "0.9rem",
                                    color: "#fff",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    boxShadow: "none",
                                    backdropFilter: "blur(4px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

// Main UserProfile component
const UserProfile = () => {
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
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    const dispatch = useDispatch();
    const { data: profileData, loading: profileLoading, updateLoading, updateError } = useSelector((state) => state.profile);

    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [userDetails, setUserDetails] = useState({
        fullName: "",
        email: "",
        contactNo: "",
        birthDate: "",
        role: "",
        userId: "",
        description: "",
    });

    // Fetch profile data on component mount
    useEffect(() => {
        if (!profileData) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, profileData]);

    // Update local state when profile data is loaded
    useEffect(() => {
        if (profileData) {
            setUserDetails({
                fullName: profileData.name || "",
                email: profileData.userId?.email || "",
                contactNo: profileData.mobileNumber || "",
                birthDate: profileData.birthDate || "",
                role: profileData.userId?.role || "",
                userId: profileData.userId?._id || "",
                description: profileData.aboutMe || profileData.description || "",
            });
        }
    }, [profileData]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (profileImagePreview) {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImagePreview]);

    // Helper function to construct full image URL with cache busting
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return "/admin/Profile-Placeholder.webp";

        let fullUrl;
        if (imagePath.startsWith("http")) {
            fullUrl = imagePath;
        } else if (imagePath.startsWith("/")) {
            fullUrl = `${BASE_URL}${imagePath}`;
        } else {
            fullUrl = `${BASE_URL}/${imagePath}`;
        }

        // Add cache busting parameter to force image refresh
        const separator = fullUrl.includes("?") ? "&" : "?";
        return `${fullUrl}${separator}t=${Date.now()}`;
    };

    const user = {
        name: profileData?.name || "User",
        role: profileData?.userId?.role || "User",
        profileImage: getFullImageUrl(profileData?.profileImage),
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSave = async (updatedData) => {
        const loadingToast = toast.loading("Updating profile...");

        try {
            // If there's a selected profile image, use updateProfileWithImage
            if (selectedProfileImage) {
                const formData = new FormData();

                // Add the image file with proper filename
                formData.append("image", selectedProfileImage, selectedProfileImage.name);
                // Add other profile data - ensure all values are strings
                formData.append("name", String(updatedData.fullName || ""));
                formData.append("email", String(updatedData.email || ""));
                formData.append("mobileNumber", String(updatedData.contactNo || ""));
                formData.append("whatsappNumber", String(updatedData.contactNo || ""));
                formData.append("role", String(updatedData.role || ""));
                formData.append("birthDate", String(updatedData.birthdate || ""));
                formData.append("aboutMe", String(updatedData.description || ""));
                formData.append("isUpdate", String(true || ""));
                await dispatch(updateProfileWithImage(formData)).unwrap();
            } else {
                // Regular profile update without image
                const updateData = {
                    // Include existing profile data first to avoid missing field errors
                    ...profileData,
                    // Then override with updated values
                    name: updatedData.fullName,
                    email: updatedData.email,
                    mobileNumber: updatedData.contactNo,
                    whatsappNumber: updatedData.contactNo,
                    role: updatedData.role,
                    birthDate: updatedData.birthdate,
                    aboutMe: updatedData.description,
                };

                await dispatch(updateProfile(updateData)).unwrap();
            }

            setIsEditing(false);
            toast.success("Profile updated successfully!", { id: loadingToast });

            // Refresh profile data to show updated information
            await dispatch(fetchUserProfile());

            // Clear preview states after successful update and refresh
            setSelectedProfileImage(null);
            if (profileImagePreview) {
                URL.revokeObjectURL(profileImagePreview);
                setProfileImagePreview(null);
            }
        } catch (error) {

            // Handle different types of errors
            let errorMessage = "Failed to update profile";

            if (typeof error === "string") {
                errorMessage = error;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
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
                        errorMessage = "You do not have permission to update profile.";
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
        setIsEditing(false);
        // Clean up preview URL if cancelling
        if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
            setProfileImagePreview(null);
            setSelectedProfileImage(null);
        }
    };

    // Avatar modal handlers
    const handleOpenAvatarModal = () => {
        setIsAvatarModalOpen(true);
    };

    const handleCloseAvatarModal = () => {
        setIsAvatarModalOpen(false);
    };

    const handleAvatarSave = async (file) => {
        try {
            // Store the selected image file for later upload
            setSelectedProfileImage(file);

            // Create preview URL for immediate display
            const previewUrl = URL.createObjectURL(file);
            setProfileImagePreview(previewUrl);

            setIsAvatarModalOpen(false);
            toast.success("Profile picture selected! Click Save to update your profile.");
        } catch (error) {
            toast.error("Failed to process profile picture");
        }
    };

    const handleAvatarCancel = () => {
        setIsAvatarModalOpen(false);
    };

    const handleDeleteAvatar = async () => {
    const loadingToast = toast.loading("Deleting profile picture...");

    try {
        const updateData = {
            name: userDetails.fullName,
            email: userDetails.email,
            mobileNumber: userDetails.contactNo,
            whatsappNumber: userDetails.contactNo,
            role: userDetails.role,
            birthDate: userDetails.birthDate,
            aboutMe: userDetails.description,
            isUpdate: true,
            profileImage: null,
        };

        const formData = new FormData();
        for (let key in updateData) {
            formData.append(key, updateData[key] ?? '');
        }

        await dispatch(updateProfileWithImage(formData)).unwrap();

        // Clear any existing preview
        if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
            setProfileImagePreview(null);
        }
        setSelectedProfileImage(null);

        toast.success("Profile picture deleted successfully!", { id: loadingToast });

        // Reload the page as requested
        window.location.reload();
    } catch (error) {
        // Handle different types of errors
        let errorMessage = "Failed to delete profile picture";

        if (typeof error === "string") {
            errorMessage = error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (error?.response?.status) {
            switch (error.response.status) {
                case 400:
                    errorMessage = "Invalid request. Please try again.";
                    break;
                case 401:
                    errorMessage = "Unauthorized. Please login again.";
                    break;
                case 403:
                    errorMessage = "You do not have permission to delete profile picture.";
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

    return (
        <Box sx={{ typography: "body1" }}>
            <ProfileHeader
                user={user}
                backgroundImage="/images/ConsultingServicesHero-BG.webp"
                onEditProfile={handleEditProfile}
                isEditing={isEditing}
                onEditAvatar={handleOpenAvatarModal}
                onDeleteAvatar={handleDeleteAvatar}
                profileImagePreview={profileImagePreview}
            />
            {isEditing ? (
                <AboutMeForm userDetails={userDetails} onSave={handleSave} onCancel={handleCancel} loading={updateLoading} />
            ) : (
                <AboutSection userDetails={userDetails} />
            )}

            {/* Avatar Upload Modal */}
            <AvatarUpload isOpen={isAvatarModalOpen} onSave={handleAvatarSave} onCancel={handleAvatarCancel} title="Upload Profile Picture" />
        </Box>
    );
};

export default UserProfile;