"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ProfileModal from "../ProfileModal";
import NotificationModal from "../NotificationModal";
import ViewAllModal from "../NotificationModal/ViewAllModal";
import { fetchUserProfile, resetProfile } from "../../../redux/profileSlice";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { getLocalStorage, getSessionStorage } from "@/utils/localStorage";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@mui/material";

// Dynamically import the ChangePassword modal to avoid SSR issues
const ChangePasswordModal = dynamic(() => import("../modal/changepassword"), { ssr: false });

function AdminHeader() {
    const dispatch = useDispatch();
    const { data: profileData, loading: profileLoading } = useSelector((state) => state.profile);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [sessionData, setSessionData] = useState();
    const profileRef = useRef(null);
    const modalRef = useRef(null);
    const notificationRef = useRef(null);
    const notificationModalRef = useRef(null);
    const { redirect } = useRouteRedirect();

    // Use notification hook
    const {
        unreadNotifications,
        allNotifications,
        unreadCount,
        isNotificationModalOpen,
        isViewAllModalOpen,
        hasUnreadNotifications,
        openNotificationModal,
        closeNotificationModal,
        openViewAllModal,
        closeViewAllModal,
        markAllAsRead,
        closeAllNotificationModals,
    } = useNotifications();

    // Initialize with cached data from localStorage (if available) but always fetch fresh data
    const [initialProfile, setInitialProfile] = useState(() => {
        if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem("userProfile");
            return storedProfile ? JSON.parse(storedProfile) : null;
        }
        return null;
    });

    const handleChangePasswordClick = () => {
        setIsProfileModalOpen(false);
        setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordModalOpen(false);
    };

    const toggleNotificationModal = () => {
        if (isNotificationModalOpen) {
            closeNotificationModal();
        } else {
            openNotificationModal();
        }
    };

    const handleViewAllClick = async () => {
        await openViewAllModal();
        // Mark all notifications as read when viewing all
        await markAllAsRead();
    };

    const handleCloseViewAllModal = () => {
        closeViewAllModal();
    };

    // Always fetch fresh profile data on component mount
    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    // Update localStorage when profileData changes
    useEffect(() => {
        if (profileData && typeof window !== "undefined") {
            localStorage.setItem("userProfile", JSON.stringify(profileData));
        }
    }, [profileData]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const session = JSON.parse(getLocalStorage("session"));
            console.log("session", session);
            setSessionData(session);
        }
    }, []);

    // Handle clicking outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle profile modal
            if (
                isProfileModalOpen &&
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileModalOpen(false);
            }

            // Handle notification modal
            if (
                isNotificationModalOpen &&
                notificationModalRef.current &&
                !notificationModalRef.current.contains(event.target) &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                closeNotificationModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileModalOpen, isNotificationModalOpen]);

    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
    };

    // Determine display name
    const displayName = profileLoading ? "Loading..." : profileData?.name || initialProfile?.name || "User";

    return (
        <header
            className="flex justify-between items-center w-full bg-white border-b border-gray-200 h-[70px] px-6 max-md:px-4 max-sm:px-3 max-sm:h-[60px]"
            role="banner"
            aria-label="Admin header navigation"
        >
            {/* Logo Section */}
            <div className="flex items-center">
                <div className="flex items-center justify-center h-[70px] w-[220px] max-md:w-[180px] max-sm:w-[150px]" role="img" aria-label="Company logo">
                    <Image
                        src="/images/loggo1.webp"
                        alt="Kaiso Logo"
                        width={0}
                        height={0}
                        className="h-10 w-[172px] object-contain max-md:h-8 max-md:w-[140px] max-sm:h-7 max-sm:w-[120px]"
                    />
                </div>
            </div>

            {/* Right Section */}
            <nav className="flex items-center gap-5 max-md:gap-4 max-sm:gap-3" aria-label="User navigation">
                {/* Notifications */}
                <div className="relative">
                    <button
                        ref={notificationRef}
                        className="flex items-center justify-center p-3 bg-gray-100 rounded-lg h-[50px] w-[50px] hover:bg-gray-200 focus:outline-none transition-colors"
                        aria-label="View notifications"
                        type="button"
                        onClick={toggleNotificationModal}
                    >
                        <Badge
                            badgeContent={hasUnreadNotifications ? unreadCount : 0}
                            color="error"
                            sx={{
                                "& .MuiBadge-badge": {
                                    right: -3,
                                    top: -3,
                                    fontSize: "0.75rem",
                                    minWidth: "18px",
                                    height: "18px",
                                },
                            }}
                        >
                            <Bell className="text-gray-700" size={20} />
                        </Badge>
                    </button>

                    {/* Notification Modal */}
                    {isNotificationModalOpen && (
                        <div ref={notificationModalRef} className="absolute right-0 top-full mt-2 z-50">
                            <NotificationModal onViewAllClick={handleViewAllClick} />
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative">
                    <div
                        ref={profileRef}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        onClick={toggleProfileModal}
                    >
                        <Image
                            src={profileData?.profileImage || initialProfile?.profileImage || "/images/profile_picture.webp"}
                            alt=""
                            width={0}
                            height={0}
                            className="border border-neutral-400 h-[50px] w-[50px] rounded-full object-cover max-md:h-[45px] max-md:w-[45px] max-sm:h-10 max-sm:w-10"
                        />
                        <span className="text-base font-medium text-zinc-900 max-md:text-sm max-md:w-[70px]">
                            {profileData?.name || initialProfile?.name || "User"}
                        </span>
                        <button
                            className="rounded p-1 focus:outline-none transition-colors"
                            aria-label="Open user menu"
                            aria-expanded={isProfileModalOpen}
                            aria-haspopup="true"
                            type="button"
                        >
                            <ChevronDown
                                className={`text-gray-700 transition-transform ${isProfileModalOpen ? "rotate-180" : ""}`}
                                size={20}
                            />
                        </button>
                    </div>

                    {/* Profile Modal */}
                    {isProfileModalOpen && (
                        <div ref={modalRef} className="absolute right-0 top-full mt-2 z-50">
                            <ProfileModal
                                name={profileData?.name || initialProfile?.name || "User"}
                                email={profileData?.userId?.email || initialProfile?.userId?.email || "user@example.com"}
                                profileImage={profileData?.profileImage || initialProfile?.profileImage}
                                onProfileClick={() => {
                                    setIsProfileModalOpen(false);
                                    redirect("/admin/userprofile");
                                }}
                                onChangePasswordClick={handleChangePasswordClick}
                                onLogoutClick={() => {
                                    // Clear all localStorage data
                                    getSessionStorage("adminToken");
                                    sessionStorage.removeItem("adminToken");
                                    localStorage.removeItem("refreshToken");
                                    localStorage.removeItem("session");
                                    localStorage.removeItem("userProfile");
                                    localStorage.removeItem("rememberMe");

                                    // Clear Redux profile state
                                    dispatch(resetProfile());

                                    redirect("/home");
                                    setIsProfileModalOpen(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </nav>

            {/* Change Password Modal */}
            <ChangePasswordModal open={isChangePasswordModalOpen} onClose={handleCloseChangePassword} />

            {/* View All Notifications Modal */}
            <ViewAllModal open={isViewAllModalOpen} onClose={handleCloseViewAllModal} />
        </header>
    );
}

export default AdminHeader;
