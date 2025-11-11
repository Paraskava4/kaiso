import React, { useState } from "react";
import { useGetDashboardDataQuery } from "@/api/dashboard";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { actions } from "@/redux/store";
import Image from "next/image";

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: profileData, loading: profileLoading } = useSelector((state) => state.profile);
    const router = useRouter();

    const { data: getDashboardData, isLoading } = useGetDashboardDataQuery({ search: searchQuery });

    const dashboardData = getDashboardData?.data;
    const report = dashboardData?.report || {};
    const inquiry = dashboardData?.inquiry || {};
    const checkoutInquiries = inquiry.checkoutInquiry?.slice(0, 5) || [];
    const otherInquiries = inquiry.otherInquiry?.slice(0, 5) || [];

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full gap-3">
            {/* Welcome + Actions */}
            <div className="flex justify-between items-center w-full">
                <h2 className="text-gray-700 font-medium">Welcome back, {profileData?.name || ""}</h2>

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full h-9.5 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>


                    <div className="flex gap-3">
                        {/* <Link href="/admin/reports"> */}
                        <button onClick={() => actions.modal.openCreateReport({ title: "Create Report", open: true })
                        } className="px-4 py-2 bg-[#D5003C] hover:bg-red-600 text-white rounded-md text-sm font-medium">
                            Add Report
                        </button>
                        {/* </Link> */}

                        {/* <Link href="/admin/articles"> */}
                        <button onClick={() => actions.modal.openCreateArticle({ title: "create Article", open: true })
                        } className="px-4 py-2 bg-[#5AB1E0] hover:bg-sky-500 text-white rounded-md text-sm font-medium">
                            Add Article
                        </button>
                        {/* </Link> */}
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-md p-4 shadow-sm animate-pulse">
                            <div className="bg-gray-200 h-8 w-8 rounded-full mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-5">
                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-start text-left shadow-sm">
                        <div className="bg-gray-100 p-2.5 rounded-full mb-2">
                            {/* <BarChart2 className="text-gray-500 text-lg" /> */}
                            <Image src="/icons/dashboard1.png" width={18} height={18} alt="" />
                        </div>
                        <p className="text-lg font-semibold leading-tight">{report.totalReport || 0}</p>
                        <p className="text-gray-600 text-xs">Total Reports</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-start text-left shadow-sm">
                        <div className="bg-gray-100 p-2 rounded-full mb-2">
                            <Image src="/icons/dashboard2.png" width={18} height={18} alt="" />
                        </div>
                        <p className="text-lg font-semibold leading-tight">{report.activeReport || 0}</p>
                        <p className="text-gray-600 text-xs">Active Reports</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-start text-left shadow-sm">
                        <div className="bg-gray-100 p-2.5 rounded-full mb-2">
                            <Image src="/icons/dashboard3.png" width={18} height={18} alt="" />
                        </div>
                        <p className="text-lg font-semibold leading-tight">{report.draftReport || 0}</p>
                        <p className="text-gray-600 text-xs">Draft Reports</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-start text-left shadow-sm">
                        <div className="bg-gray-100 p-2.5 rounded-full mb-2">
                            <Image src="/icons/dashboard4.png" width={18} height={18} alt="" />
                        </div>
                        <p className="text-lg font-semibold leading-tight">{report.archiveReport || 0}</p>
                        <p className="text-gray-600 text-xs">Archive Reports</p>
                    </div>
                </div>

            )}
            {/* Inquiry Tables */}
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-5">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-md shadow-sm p-4 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                            <div className="space-y-2">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-8 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-5">
                    {/* Checkout Inquires */}
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-gray-700 font-medium">Checkout Inquires</h3>
                            <button
                                onClick={() => router.push("/admin/inquires/checkouts")}
                                className="text-sm text-sky-600 hover:underline"
                            >
                                See All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Inquire No</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Client Name</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Email Address</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Price</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Time</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {checkoutInquiries.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="border-b border-gray-300 px-3 py-2 text-sky-600">{item.inquiryNo || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">{item.firstName || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">{item.businessEmail || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-blue-900 font-medium">{item.subTotal ? `${item.subTotal}` : "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit"
                                                    })
                                                    : "-"}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Custom Inquires */}
                    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-gray-700 font-medium">Custom Inquires</h3>
                            <button
                                onClick={() => router.push("/admin/inquires/need-customization")}
                                className="text-sm text-sky-600 hover:underline"
                            >
                                See All
                            </button>                    </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Inquire No</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Client Name</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Inquiry Type</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Email Address</th>
                                        <th className="border-b border-gray-300 px-3 py-2 text-left">Time</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {otherInquiries.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="border-b border-gray-300 px-3 py-2 text-sky-600">{item.inquiryNo || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">{item.firstName || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">{item.type || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">{item.businessEmail || "-"}</td>
                                            <td className="border-b border-gray-300 px-3 py-2 text-zinc-700">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit"
                                                    })
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Index;
