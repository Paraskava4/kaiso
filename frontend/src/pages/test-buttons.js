import React from 'react';
import { useButtonNames } from '../hooks/useButtonNames';

const TestButtonsPage = () => {
    const { buttonNames, loading, error } = useButtonNames();

    if (loading) {
        return <div className="p-8">Loading button names...</div>
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Button Names Test</h1>
            
            <div className="space-y-4">
                <div className="p-4 border rounded">
                    <h2 className="font-semibold">Buy Button:</h2>
                    <p>"{buttonNames.buyButton}"</p>
                </div>
                
                <div className="p-4 border rounded">
                    <h2 className="font-semibold">Request Button:</h2>
                    <p>"{buttonNames.requestButton}"</p>
                </div>
                
                <div className="p-4 border rounded">
                    <h2 className="font-semibold">Inquiry Button:</h2>
                    <p>"{buttonNames.inquiryButton}"</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">Test Buttons:</h2>
                <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-sky-900 text-white rounded">
                        {buttonNames.buyButton}
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded">
                        {buttonNames.requestButton}
                    </button>
                    <button className="w-full px-4 py-2 bg-red-600 text-white rounded">
                        {buttonNames.inquiryButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestButtonsPage;
