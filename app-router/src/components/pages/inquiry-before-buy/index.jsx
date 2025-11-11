"use client";
import React, { Suspense } from "react";
import Footer from "../../layout/Footer";
import InquireBeforeBuyHeader from "./InquireBeforeBuyHeader";
import { mockReports } from "../../../data/mockReports";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "../shared/Breadcrumb";

const InquireBeforeBuy = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const report = mockReports.find((r) => String(r.id) === String(id));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex flex-col">
                <div className="w-full px-38 text-sm text-gray-500">
                    <Breadcrumb items={[{ label: "Reports", href: "/report" }]} />
                </div>
                <InquireBeforeBuyHeader report={report} />
                <section className="flex flex-wrap md:flex-nowrap items-center gap-[30px] px-8 mt-8 mx-auto">
                    <div className="w-full md:w-full self-center">{/* <InquireForm /> */}</div>
                    <div className="w-full md:w-full self-center">{/* <InquireBeforeBuySidemenu /> */}</div>
                </section>

                <Footer />
            </div>
        </Suspense>
    );
};

export default InquireBeforeBuy;
