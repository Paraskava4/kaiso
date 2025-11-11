import React from 'react';
import { Skeleton } from '@mui/material';

/**
 * Loading Skeleton Components for better UX
 */

// Card skeleton for report/blog cards
export const CardSkeleton = ({ count = 1, className = "" }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <Skeleton variant="rectangular" height={200} className="rounded-lg mb-4" />
                    <Skeleton variant="text" width="80%" height={32} className="mb-2" />
                    <Skeleton variant="text" width="60%" height={24} className="mb-4" />
                    <div className="flex space-x-2">
                        <Skeleton variant="text" width="30%" height={20} />
                        <Skeleton variant="text" width="25%" height={20} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// List skeleton for report/blog lists
export const ListSkeleton = ({ count = 5, className = "" }) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <Skeleton variant="rectangular" width={80} height={80} className="rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="70%" height={24} />
                        <Skeleton variant="text" width="50%" height={20} />
                        <Skeleton variant="text" width="40%" height={16} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Table skeleton for data tables
export const TableSkeleton = ({ rows = 5, columns = 4, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
            <div className="p-4 border-b">
                <Skeleton variant="text" width="30%" height={28} />
            </div>
            <div className="p-4">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-4 mb-3">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton key={colIndex} variant="text" width="100%" height={20} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Page skeleton for full page loading
export const PageSkeleton = ({ className = "" }) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Header skeleton */}
            <div className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto">
                    <Skeleton variant="text" width="20%" height={32} />
                </div>
            </div>

            {/* Main content skeleton */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <Skeleton variant="text" width="40%" height={40} className="mb-4" />
                    <Skeleton variant="text" width="60%" height={24} />
                </div>

                {/* Grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                            <Skeleton variant="rectangular" height={200} className="rounded-lg mb-4" />
                            <Skeleton variant="text" width="80%" height={24} className="mb-2" />
                            <Skeleton variant="text" width="60%" height={20} className="mb-4" />
                            <div className="flex justify-between items-center">
                                <Skeleton variant="text" width="30%" height={16} />
                                <Skeleton variant="text" width="25%" height={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Detail page skeleton
export const DetailPageSkeleton = ({ className = "" }) => {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            <div className="max-w-4xl mx-auto p-6">
                {/* Breadcrumb skeleton */}
                <div className="mb-6">
                    <Skeleton variant="text" width="40%" height={20} />
                </div>

                {/* Title skeleton */}
                <div className="mb-8">
                    <Skeleton variant="text" width="80%" height={48} className="mb-4" />
                    <Skeleton variant="text" width="60%" height={24} className="mb-2" />
                    <Skeleton variant="text" width="40%" height={20} />
                </div>

                {/* Image skeleton */}
                <Skeleton variant="rectangular" height={400} className="rounded-lg mb-8" />

                {/* Content skeleton */}
                <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} variant="text" width="100%" height={20} />
                    ))}
                </div>

                {/* Related content skeleton */}
                <div className="mt-12">
                    <Skeleton variant="text" width="30%" height={32} className="mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                <Skeleton variant="rectangular" height={150} className="rounded-lg mb-3" />
                                <Skeleton variant="text" width="80%" height={20} className="mb-2" />
                                <Skeleton variant="text" width="60%" height={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Search results skeleton
export const SearchResultsSkeleton = ({ count = 10, className = "" }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search header */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <Skeleton variant="text" width="25%" height={24} />
            </div>

            {/* Results */}
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                        <Skeleton variant="rectangular" width={120} height={120} className="rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton variant="text" width="70%" height={24} />
                            <Skeleton variant="text" width="90%" height={20} />
                            <Skeleton variant="text" width="60%" height={16} />
                            <div className="flex space-x-4 mt-3">
                                <Skeleton variant="text" width="20%" height={16} />
                                <Skeleton variant="text" width="15%" height={16} />
                                <Skeleton variant="text" width="25%" height={16} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Custom skeleton with animation
export const AnimatedSkeleton = ({ children, loading = true, className = "" }) => {
    if (!loading) return children;

    return (
        <div className={`animate-pulse ${className}`}>
            {children}
        </div>
    );
};

// Skeleton wrapper for any component
export const SkeletonWrapper = ({ loading, children, skeleton, className = "" }) => {
    if (loading) {
        return (
            <div className={className}>
                {skeleton}
            </div>
        );
    }

    return children;
};

export default {
    CardSkeleton,
    ListSkeleton,
    TableSkeleton,
    PageSkeleton,
    DetailPageSkeleton,
    SearchResultsSkeleton,
    AnimatedSkeleton,
    SkeletonWrapper,
};
