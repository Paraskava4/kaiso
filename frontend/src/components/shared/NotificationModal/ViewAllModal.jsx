"use client";
import React from "react";
import { IconButton } from "@mui/material";
import { X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const ViewAllModal = ({
    open = false,
    onClose = () => {},
}) => {
    const { allNotifications } = useNotifications();

    // Use actual notification data
    const displayNotifications = allNotifications;



    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 top-17 left-50"
                style={{ background: 'rgba(0, 0, 0, 0.60)' }}
                onClick={onClose}
            />

            {/* Sidebar Modal */}
            <div className="fixed top-17 right-0 h-full w-100 bg-white shadow-lg z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-[#61899F] text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">All Notifications</span>
                    </div>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <X size={24} />
                    </IconButton>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {displayNotifications.length > 0 ? (
                        displayNotifications.map((notification, index) => {
                            const IconComponent = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                                        index !== displayNotifications.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <IconComponent className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <p className="text-sm">No notifications available</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewAllModal;
