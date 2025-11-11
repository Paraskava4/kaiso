"use client";

import React from "react";
import Image from "next/image";

export default function PaymentSuccessPopup({
    email = "user@example.com",
    onContact = () => console.log("Contact Us clicked"),
    onCheckEmail = () => console.log("Email checked clicked"),
}) {
    return (
        <main className="flex min-h-[500px] w-full max-w-[500px] mx-auto flex-col items-center gap-8 bg-white rounded-lg p-6 sm:p-8 md:gap-10">
            <h1 className="text-center text-2xl font-bold text-blue-900 sm:text-3xl">Payment Successful</h1>

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
                <Image src="/icons/Sucess.webp" alt="Success checkmark" width={80} height={80} className="object-contain" quality={100} />
            </div>

            <section className="flex w-full flex-col items-center gap-4" aria-label="confirmation details">
                <div className="flex flex-col gap-3 text-center">
                    <p id="confirmation-details" className="text-sm font-medium text-gray-800 sm:text-base">
                        Your payment has been verified! We'll send the report to {email} soon.
                    </p>
                    <p className="text-sm text-gray-600 sm:text-base">Thank you for your purchase. You'll receive a detailed report in your email shortly.</p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
                    <button
                        className="w-full rounded-md bg-blue-600 py-2.5 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:text-base"
                        onClick={onContact}
                        aria-label="Contact customer support"
                    >
                        Contact Us
                    </button>
                    <button
                        className="w-full rounded-md border border-gray-300 py-2.5 px-4 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:text-base"
                        onClick={onCheckEmail}
                        aria-label="Check your email for the report"
                    >
                        Check Email
                    </button>
                </div>
            </section>
        </main>
    );
}
