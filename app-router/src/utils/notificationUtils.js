import { formatDistanceToNow } from "date-fns";
import { getSessionStorage } from "./localStorage";

/**
 * Get notification icon key based on notification title/type
 */
export const getNotificationIconKey = (title) => {
    if (!title) return "info";

    const titleLower = title.toLowerCase();

    if (titleLower.includes("inquiry") || titleLower.includes("contact")) {
        return "helpCircle";
    }
    if (titleLower.includes("email") || titleLower.includes("subscrib")) {
        return "mail";
    }
    if (titleLower.includes("user") || titleLower.includes("writer")) {
        return "user";
    }
    if (titleLower.includes("report") || titleLower.includes("csv")) {
        return "search";
    }
    if (titleLower.includes("career") || titleLower.includes("job")) {
        return "briefcase";
    }
    if (titleLower.includes("reseller") || titleLower.includes("business")) {
        return "briefcase";
    }
    if (titleLower.includes("checkout") || titleLower.includes("purchase")) {
        return "shoppingCart";
    }
    if (titleLower.includes("failed") || titleLower.includes("error")) {
        return "alertTriangle";
    }

    return "info";
};

/**
 * Format notification data from API response
 */
export const formatNotificationData = (notifications, currentUserId) => {
    if (!Array.isArray(notifications)) return [];

    return notifications.map((notification) => ({
        id: notification._id,
        title: notification.title,
        body: notification.body,
        time: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }),
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
        isRead: notification.readBy && notification.readBy.includes(currentUserId),
        readBy: notification.readBy || [],
        type: getNotificationType(notification.title),
        icon: getNotificationIconKey(notification.title),
    }));
};

/**
 * Get notification type based on title
 */
export const getNotificationType = (title) => {
    if (!title) return "info";

    const titleLower = title.toLowerCase();

    if (titleLower.includes("inquiry") || titleLower.includes("contact")) {
        return "inquiry";
    }
    if (titleLower.includes("email") || titleLower.includes("subscrib")) {
        return "email";
    }
    if (titleLower.includes("user") || titleLower.includes("writer")) {
        return "user";
    }
    if (titleLower.includes("report") || titleLower.includes("csv")) {
        return "report";
    }
    if (titleLower.includes("career")) {
        return "career";
    }
    if (titleLower.includes("reseller")) {
        return "business";
    }
    if (titleLower.includes("checkout")) {
        return "checkout";
    }
    if (titleLower.includes("failed") || titleLower.includes("error")) {
        return "error";
    }

    return "info";
};

/**
 * Get current user ID from localStorage token
 */
export const getCurrentUserId = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const token = getSessionStorage("adminToken");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return payload.userId || null;
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};
