import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    useGetUnreadNotificationsQuery,
    useLazyGetAllNotificationsQuery,
    useMarkAllAsReadMutation 
} from '../api/notification';
import {
    setUnreadNotifications,
    setAllNotifications,
    setNotificationModalOpen,
    setViewAllModalOpen,
    setLoading,
    setError,
    markAllAsRead as markAllAsReadAction,
    closeAllModals
} from '../redux/notificationSlice';
import { formatNotificationData, getCurrentUserId } from '../utils/notificationUtils';

export const useNotifications = () => {
    const dispatch = useDispatch();
    const currentUserId = getCurrentUserId();
    
    const {
        unreadNotifications,
        allNotifications,
        unreadCount,
        isNotificationModalOpen,
        isViewAllModalOpen,
        loading,
        error
    } = useSelector(state => state.notification);

    // API hooks
    const {
        data: unreadData,
        error: unreadError,
        isLoading: unreadLoading,
        refetch: refetchUnread
    } = useGetUnreadNotificationsQuery(undefined, {
        pollingInterval: 30000, // Poll every 30 seconds
        refetchOnFocus: true,
        refetchOnReconnect: true
    });

    const [getAllNotifications, {
        data: allData,
        error: allError,
        isLoading: allLoading
    }] = useLazyGetAllNotificationsQuery();

    const [markAllAsReadMutation, {
        isLoading: markingAsRead
    }] = useMarkAllAsReadMutation();

    // Update unread notifications when data changes
    useEffect(() => {
        if (unreadData?.status === 200 && unreadData?.data) {
            const formattedNotifications = formatNotificationData(unreadData.data, currentUserId);
            dispatch(setUnreadNotifications(formattedNotifications));
        }
    }, [unreadData, dispatch, currentUserId]);

    // Update all notifications when data changes
    useEffect(() => {
        if (allData?.status === 200 && allData?.data) {
            const formattedNotifications = formatNotificationData(allData.data, currentUserId);
            dispatch(setAllNotifications(formattedNotifications));
        }
    }, [allData, dispatch, currentUserId]);

    // Handle loading states
    useEffect(() => {
        dispatch(setLoading(unreadLoading || allLoading || markingAsRead));
    }, [unreadLoading, allLoading, markingAsRead, dispatch]);

    // Handle errors
    useEffect(() => {
        if (unreadError || allError) {
            dispatch(setError(unreadError?.message || allError?.message || 'Failed to fetch notifications'));
        } else {
            dispatch(setError(null));
        }
    }, [unreadError, allError, dispatch]);

    // Notification actions
    const openNotificationModal = useCallback(() => {
        dispatch(setNotificationModalOpen(true));
    }, [dispatch]);

    const closeNotificationModal = useCallback(() => {
        dispatch(setNotificationModalOpen(false));
    }, [dispatch]);

    const openViewAllModal = useCallback(async () => {
        dispatch(setViewAllModalOpen(true));
        dispatch(setNotificationModalOpen(false));
        
        // Fetch all notifications when opening view all modal
        try {
            await getAllNotifications().unwrap();
        } catch (error) {
            console.error('Failed to fetch all notifications:', error);
        }
    }, [dispatch, getAllNotifications]);

    const closeViewAllModal = useCallback(() => {
        dispatch(setViewAllModalOpen(false));
    }, [dispatch]);

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllAsReadMutation().unwrap();
            dispatch(markAllAsReadAction());
            // Refetch unread notifications to update the count
            refetchUnread();
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
            dispatch(setError('Failed to mark notifications as read'));
        }
    }, [markAllAsReadMutation, dispatch, refetchUnread]);

    const closeAllNotificationModals = useCallback(() => {
        dispatch(closeAllModals());
    }, [dispatch]);

    const refreshNotifications = useCallback(() => {
        refetchUnread();
    }, [refetchUnread]);

    return {
        // State
        unreadNotifications,
        allNotifications,
        unreadCount,
        isNotificationModalOpen,
        isViewAllModalOpen,
        loading,
        error,
        hasUnreadNotifications: unreadCount > 0,

        // Actions
        openNotificationModal,
        closeNotificationModal,
        openViewAllModal,
        closeViewAllModal,
        markAllAsRead,
        closeAllNotificationModals,
        refreshNotifications
    };
};
