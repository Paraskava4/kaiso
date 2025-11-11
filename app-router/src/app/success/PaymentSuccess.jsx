

import Image from "next/image";

export default function Success() {
    return (
        <div className="flex flex-col items-center justify-center h-[88vh]  bg-gradient-to-br from-blue-100 to-white p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-700 mb-6 max-w-md">Thank you for your payment. Your transaction has been completed successfully.</p>
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    onClick={() => (window.location.href = "/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
