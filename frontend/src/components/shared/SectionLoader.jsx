import React from 'react';

const SectionLoader = ({ 
    height = 'h-32', 
    spinnerSize = 'h-8 w-8',
    color = 'border-blue-600',
    message = null,
    className = ''
}) => (
    <div className={`w-full ${height} flex items-center justify-center flex-col ${className}`}>
        <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 ${color}`}></div>
        {message && (
            <p className="mt-2 text-sm text-gray-600">{message}</p>
        )}
    </div>
);

export default SectionLoader;
