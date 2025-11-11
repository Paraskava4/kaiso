"use client";
import { Suspense } from "react";
import { CheckoutPage } from "@/page-components";

/**
 * Checkout Route Component
 *
 * This is the Next.js pages router page component for the checkout route (/checkout).
 */
export default function Checkout_Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutPage />
        </Suspense>
    );
}
