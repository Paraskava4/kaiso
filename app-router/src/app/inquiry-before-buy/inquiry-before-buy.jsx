"use client";
import React, { Suspense } from "react";
import InquireBeforeBuy from "@/page-components/inquiry-before-buy";

/**
 * Inquiry Before Buy Route Component
 *
 * This is the Next.js pages router page component for the inquiry-before-buy route (/inquiry-before-buy).
 */
export default function InquiryBeforeBuy_page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InquireBeforeBuy />
        </Suspense>
    );
}
