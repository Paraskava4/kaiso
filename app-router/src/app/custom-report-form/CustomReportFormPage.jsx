"use client";
import React, { Suspense } from "react";
import Head from "next/head";
import CustomReportForm from "@/components/pages/report-details/components/custom-report-form";

export default function CustomReportFormPage_page() {
    return (
        <>
            <Head>
                <title>Custom Report Request - KAISO Research</title>
                <meta
                    name="description"
                    content="Request a customized market research report tailored to your specific business needs. Get expert consultation and personalized insights."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Suspense fallback={<div>Loading...</div>}>
                <CustomReportForm />
            </Suspense>
        </>
    );
}
