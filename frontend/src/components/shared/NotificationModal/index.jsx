"use client";
import React from "react";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationModal = ({
    onViewAllClick = () => console.log("View all clicked"),
    className = "",
}) => {
    const { unreadNotifications, unreadCount } = useNotifications();

    // Use actual notification data or show empty state
    const displayNotifications = unreadNotifications.slice(0, 3); // Show only first 3 notifications

    return (
        <div className={`bg-white rounded-lg shadow-lg w-80 ${className}`} role="dialog" aria-label="Notifications">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#61899F] text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {unreadCount > 0 ? `You Have ${unreadCount} New Notification${unreadCount > 1 ? 's' : ''}` : 'No New Notifications'}
                    </span>
                </div>
                <button
                    onClick={onViewAllClick}
                    className="text-sm text-white hover:underline"
                >
                    View All
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
                {displayNotifications.length > 0 ? (
                    displayNotifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className="flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
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
                        <p className="text-sm">No unread notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
