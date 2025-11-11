"use client";
import { useState, useEffect } from 'react';
import { getServiceWorkerStatus, getCacheSize, clearAllCaches } from '@/utils/serviceWorker';

const ServiceWorkerStatus = ({ show = false }) => {
    const [status, setStatus] = useState('checking');
    const [cacheSize, setCacheSize] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const swStatus = getServiceWorkerStatus();
            setStatus(swStatus);
            
            getCacheSize().then(size => {
                setCacheSize(size);
            });
        };

        checkStatus();
        
        // Check status every 5 seconds
        const interval = setInterval(checkStatus, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const handleClearCache = async () => {
        if (confirm('Clear all cached data? This will require re-downloading resources.')) {
            await clearAllCaches();
            setCacheSize(0);
            alert('Cache cleared successfully!');
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-600';
            case 'not-active': return 'text-yellow-600';
            case 'not-registered': return 'text-red-600';
            case 'not-supported': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'not-active': return 'Installing';
            case 'not-registered': return 'Not Registered';
            case 'not-supported': return 'Not Supported';
            default: return 'Checking...';
        }
    };

    if (!show && process.env.NODE_ENV === 'production') {
        return null; // Hide in production
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
                <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                            status === 'active' ? 'bg-green-500' : 
                            status === 'not-active' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium">SW Status</span>
                    </div>
                    <span className={`text-xs ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                    </span>
                </div>
                
                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cache Size:</span>
                                <span className="font-medium">{formatBytes(cacheSize)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${getStatusColor(status)}`}>
                                    {getStatusText(status)}
                                </span>
                            </div>
                            
                            <button
                                onClick={handleClearCache}
                                className="w-full mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                                Clear Cache
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceWorkerStatus;
