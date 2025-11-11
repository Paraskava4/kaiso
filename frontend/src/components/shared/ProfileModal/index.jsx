"use client";
import React from "react";
import Image from "next/image";
import { Lock, LogOut, User } from "lucide-react";

const ProfileModal = ({
    name = "John Doe",
    email = "johndoe@example.com",
    profileImage = null,
    onProfileClick = () => console.log("Profile clicked"),
    onChangePasswordClick = () => console.log("Change password clicked"),
    onLogoutClick = () => console.log("Logout clicked"),
    className = "",
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg w-64 p-4 pt-0 ${className}`} role="dialog" aria-label="Profile menu">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-4">
                <Image
                    src={profileImage || "/images/profile_picture.webp"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    width={100}
                    height={100}
                    quality={100}
                    onError={(e) => {
                        e.target.src = "/images/profile_picture.webp";
                    }}
                />
                <h3 className="mt-2 font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{email}</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
                <button
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-gray-700"
                    onClick={(e) => {
                        e.preventDefault();
                        onProfileClick(e);
                    }}
                >
                    <User size={20} className="mr-3 text-gray-500" />
                    <span>Profile</span>
                </button>
                <MenuItem icon={Lock} label="Change Password" onClick={onChangePasswordClick} />
            </div>

            {/* Logout Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <MenuItem icon={LogOut} label="Logout" onClick={onLogoutClick} />
            </div>
        </div>
    );
};

// Reusable MenuItem component
const MenuItem = ({ icon: Icon, label, onClick, className = "" }) => {
    return (
        <button className={`flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-gray-700 ${className}`} onClick={onClick}>
            <Icon className="mr-3 text-gray-500" />
            <span>{label}</span>
        </button>
    );
};

export default ProfileModal;
