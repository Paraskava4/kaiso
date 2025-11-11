import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    unreadNotifications: [],
    allNotifications: [],
    unreadCount: 0,
    isNotificationModalOpen: false,
    isViewAllModalOpen: false,
    loading: false,
    error: null,
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setUnreadNotifications: (state, action) => {
            state.unreadNotifications = action.payload;
            state.unreadCount = action.payload.length;
        },
        setAllNotifications: (state, action) => {
            state.allNotifications = action.payload;
        },
        setNotificationModalOpen: (state, action) => {
            state.isNotificationModalOpen = action.payload;
        },
        setViewAllModalOpen: (state, action) => {
            state.isViewAllModalOpen = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        markAllAsRead: (state) => {
            state.unreadNotifications = [];
            state.unreadCount = 0;
            // Update all notifications to mark them as read
            state.allNotifications = state.allNotifications.map(notification => ({
                ...notification,
                isRead: true
            }));
        },
        clearNotifications: (state) => {
            state.unreadNotifications = [];
            state.allNotifications = [];
            state.unreadCount = 0;
        },
        closeAllModals: (state) => {
            state.isNotificationModalOpen = false;
            state.isViewAllModalOpen = false;
        }
    },
});

export const {
    setUnreadNotifications,
    setAllNotifications,
    setNotificationModalOpen,
    setViewAllModalOpen,
    setLoading,
    setError,
    markAllAsRead,
    clearNotifications,
    closeAllModals
} = notificationSlice.actions;

export default notificationSlice.reducer;
