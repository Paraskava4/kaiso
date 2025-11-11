import { toast } from "react-hot-toast";

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 * @param {object} options - Additional toast options
 */
export const showSuccessToast = (message, options = {}) => {
    return toast.success(message, {
        duration: 3000,
        style: {
            background: "#4ade80",
            color: "#fff",
        },
        ...options,
    });
};

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 * @param {object} options - Additional toast options
 */
export const showErrorToast = (message, options = {}) => {
    return toast.error(message, {
        duration: 5000,
        style: {
            background: "#ef4444",
            color: "#fff",
        },
        ...options,
    });
};

/**
 * Show loading toast notification
 * @param {string} message - Loading message to display
 * @param {object} options - Additional toast options
 */
export const showLoadingToast = (message, options = {}) => {
    return toast.loading(message, {
        style: {
            background: "#363636",
            color: "#fff",
        },
        ...options,
    });
};

/**
 * Show info toast notification
 * @param {string} message - Info message to display
 * @param {object} options - Additional toast options
 */
export const showInfoToast = (message, options = {}) => {
    return toast(message, {
        duration: 4000,
        style: {
            background: "#363636",
            color: "#fff",
        },
        ...options,
    });
};

/**
 * Dismiss a specific toast by ID
 * @param {string} toastId - ID of the toast to dismiss
 */
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
    toast.dismiss();
};
