
"use client";
import Image from "next/image";

export default function PaymentErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[88vh] bg-gradient-to-br from-red-100 to-white p-6">
            <div className="text-center">
                {/* <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80" // Replace with your error image URL or upload one
                    alt="Payment Error"
                    width={300}
                    height={200}
                    className="mb-6 rounded-lg shadow-lg"
                /> */}
                <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed!</h1>
                <p className="text-lg text-gray-700 mb-6 max-w-md">Unfortunately, your payment could not be processed. Please try again or contact support.</p>
                <div className="space-x-4">
                    <button
                        className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                        onClick={() => (window.location.href = "/")}
                    >
                        Back to Home
                    </button>
                    {/* <button
                        className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
                        onClick={() => window.location.reload()}
                    >
                        Pay Flow Success
                    </button> */}
                </div>
            </div>
        </div>
    );
}
