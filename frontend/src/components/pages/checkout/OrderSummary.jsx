"use client";
import React, { useState, useRef, useEffect } from "react";
import BillingDetailsForm from "../../forms/BillingDetailsForm";
import { BASE_URL } from "../../../../config";
import { useSearchParams } from "next/navigation";
import { isStatusInclude } from "@/utils/axiosInstance";
import { showSuccessToast } from "@/utils/constants/api/toast";
import Link from "next/link";

// Utility function to format price with $ prefix
function formatPrice(price) {
    if (!price) return "$0";
    const priceStr = String(price);
    // If price already starts with $, return as is
    if (priceStr.startsWith("$")) {
        return priceStr;
    }
    // If price doesn't start with $, add it
    return `$${priceStr}`;
}

export default function OrderSummary({ onProceed, initialBillingInfo, initialCartItems }) {
    const [selectedLicenses, setSelectedLicenses] = useState(
        initialCartItems && initialCartItems.length > 0 ? initialCartItems.map((item) => item.licenseType || item.title) : ["businessPrice"]
    );
    const [licenses, setLicenses] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [country, setCountry] = useState(initialBillingInfo?.country || "");
    const formRef = useRef();
    const [formError, setFormError] = useState(null);

    // Fetch license prices from API
    // useEffect(() => {
    //     const fetchPrices = async () => {
    //         try {
    //             const urlParams = new URLSearchParams(window.location.search);
    //             let reportId = urlParams.get("id");

    //             if (!reportId) {
    //                 const savedReportData = localStorage.getItem("currentReportData");
    //                 if (savedReportData) {
    //                     try {
    //                         const parsedData = JSON.parse(savedReportData);
    //                         reportId = parsedData._id || parsedData.id;
    //                     } catch (e) {
    //                         console.error("Error parsing saved report data:", e);
    //                         reportId = "1";
    //                     }
    //                 } else {
    //                     reportId = "1";
    //                 }
    //             }

    //             console.log("Fetching report data for ID:", reportId);
    //             const response = await fetch(`${BASE_URL}/web/getReportById?reportId=${reportId}`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //             const result = await response.json();
    //             console.log("Report API response:", result);
    //             if (result.data) {
    //                 const report = result.data;
    //                 setReportData(report);
    //                 const parsePriceForCalc = (priceStr) => {
    //                     if (!priceStr) return 3098.0;
    //                     const numericString = priceStr.replace(/[^\d.-]/g, "");
    //                     return parseFloat(numericString) || 3098.0;
    //                 };

    //                 const newLicenses = [
    //                     {
    //                         title: "singleUserPrice",
    //                         label: "Excel Data Pack License",
    //                         // description: report.reportSubTitle || "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "Quantitative data is presented in Excel, including tables, charts, graphs, and numbers.",
    //                         currentPrice: formatPrice(report.singleUserPrice) || "$3,098.00",
    //                         originalPrice: `$${(parsePriceForCalc(report.singleUserPrice) * 1.4286).toFixed(2)}`,
    //                         // discount: "30% Discount",
    //                     },
    //                     {
    //                         title: "businessPrice",
    //                         label: "Single User License",
    //                         // description: report.reportSubTitle || "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "Single user to access and use the report PDF file at a time.",
    //                         currentPrice: formatPrice(report.businessPrice) || "$10,253.00",
    //                         originalPrice: `$${(parsePriceForCalc(report.businessPrice) * 1.4286).toFixed(2)}`,
    //                         // discount: "30% Discount",
    //                     },
    //                     {
    //                         title: "entrepreneurPrice",
    //                         label: "Enterprise User License",
    //                         // description: report.reportSubTitle || "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "Unlimited user access to PDF report for all authorized users within your organization.",
    //                         currentPrice: formatPrice(report.entrepreneurPrice) || "$15,653.00",
    //                         originalPrice: `$${(parsePriceForCalc(report.entrepreneurPrice) * 1.4286).toFixed(2)}`,
    //                         // discount: "30% Discount",
    //                     },
    //                 ];
    //                 setLicenses(newLicenses);
    //                 console.log("Loaded licenses:", newLicenses);
    //                 // Sync selected licenses with initialCartItems after loading licenses
    //                 if (initialCartItems && initialCartItems.length > 0) {
    //                     const validLicense = initialCartItems[0].licenseType || initialCartItems[0].title;
    //                     const matchingLicense = newLicenses.find((l) => l.title === validLicense || l.label === validLicense);
    //                     if (matchingLicense) {
    //                         setSelectedLicenses([matchingLicense.title]);
    //                     }
    //                 }
    //             } else {
    //                 console.error("No report data found, using defaults");
    //                 setLicenses([
    //                     {
    //                         title: "businessPrice",
    //                         label: "Excel Datapack",
    //                         // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "PDF",
    //                         currentPrice: "$10,253.00",
    //                         originalPrice: "$14,672.44",
    //                         // discount: "30% Discount",
    //                     },
    //                     {
    //                         title: "singleUserPrice",
    //                         label: "Single User License",
    //                         // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "PDF",
    //                         currentPrice: "$3,098.00",
    //                         originalPrice: "$4,425.00",
    //                         // discount: "30% Discount",
    //                     },
    //                     {
    //                         title: "entrepreneurPrice",
    //                         label: "Enterprise License",
    //                         // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                         deliveryFormat: "PDF",
    //                         currentPrice: "$15,653.00",
    //                         originalPrice: "$22,319.02",
    //                         // discount: "30% Discount",
    //                     },
    //                 ]);
    //                 if (initialCartItems && initialCartItems.length > 0) {
    //                     const validLicense = initialCartItems[0].licenseType || initialCartItems[0].title;
    //                     const matchingLicense = licenses.find((l) => l.title === validLicense || l.label === validLicense);
    //                     if (matchingLicense) {
    //                         setSelectedLicenses([matchingLicense.title]);
    //                     }
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error fetching prices:", error);
    //             setFormError("Failed to load prices. Using default values.");
    //             setLicenses([
    //                 {
    //                     title: "businessPrice",
    //                     label: "Excel Datapack",
    //                     // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                     deliveryFormat: "PDF",
    //                     currentPrice: "$10,253.00",
    //                     originalPrice: "$14,672.44",
    //                     // discount: "30% Discount",
    //                 },
    //                 {
    //                     title: "singleUserPrice",
    //                     label: "Single User License",
    //                     // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                     deliveryFormat: "PDF",
    //                     currentPrice: "$3,098.00",
    //                     originalPrice: "$4,425.00",
    //                     // discount: "30% Discount",
    //                 },
    //                 {
    //                     title: "entrepreneurPrice",
    //                     label: "Enterprise License",
    //                     // description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    //                     deliveryFormat: "PDF",
    //                     currentPrice: "$15,653.00",
    //                     originalPrice: "$22,319.02",
    //                     // discount: "30% Discount",
    //                 },
    //             ]);
    //             if (initialCartItems && initialCartItems.length > 0) {
    //                 const validLicense = initialCartItems[0].licenseType || initialCartItems[0].title;
    //                 const matchingLicense = licenses.find((l) => l.title === validLicense || l.label === validLicense);
    //                 if (matchingLicense) {
    //                     setSelectedLicenses([matchingLicense.title]);
    //                 }
    //             }
    //         }
    //     };

    //     fetchPrices();
    // }, [initialCartItems]); // Added initialCartItems as dependency to re-sync on changes
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                let reportId = urlParams.get("id");

                if (!reportId) {
                    const savedReportData = localStorage.getItem("currentReportData");
                    if (savedReportData) {
                        try {
                            const parsedData = JSON.parse(savedReportData);
                            reportId = parsedData._id || parsedData.id;
                        } catch {
                            reportId = "1";
                        }
                    } else {
                        reportId = "1";
                    }
                }

                const response = await fetch(`${BASE_URL}/web/getReportById?reportId=${reportId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const result = await response.json();

                if (result.data) {
                    const report = result.data;
                    setReportData(report);

                    const parsePriceForCalc = (priceStr) => {
                        if (!priceStr) return 3098.0;
                        const numericString = priceStr.replace(/[^\d.-]/g, "");
                        return parseFloat(numericString) || 3098.0;
                    };

                    const newLicenses = [
                        {
                            title: "singleUserPrice",
                            label: "Excel Data Pack License",
                            deliveryFormat: "Quantitative data is presented in Excel, including tables, charts, graphs, and numbers.",
                            currentPrice: formatPrice(report.singleUserPrice) || "$3,098.00",
                            originalPrice: `$${(parsePriceForCalc(report.singleUserPrice) * 1.4286).toFixed(2)}`,
                        },
                        {
                            title: "businessPrice",
                            label: "Single User License",
                            deliveryFormat: "Single user to access and use the report PDF file at a time.",
                            currentPrice: formatPrice(report.businessPrice) || "$10,253.00",
                            originalPrice: `$${(parsePriceForCalc(report.businessPrice) * 1.4286).toFixed(2)}`,
                        },
                        {
                            title: "entrepreneurPrice",
                            label: "Enterprise User License",
                            deliveryFormat: "Unlimited user access to PDF report for all authorized users within your organization.",
                            currentPrice: formatPrice(report.entrepreneurPrice) || "$15,653.00",
                            originalPrice: `$${(parsePriceForCalc(report.entrepreneurPrice) * 1.4286).toFixed(2)}`,
                        },
                    ];
                    setLicenses(newLicenses);

                    // ✅ Select only items from initialCartItems (planType)
                    if (initialCartItems && initialCartItems.length > 0) {
                        const matchedLicenses = initialCartItems
                            .map((item) => {
                                const validLicense = item.licenseType || item.title;
                                const match = newLicenses.find((l) => l.title === validLicense || l.label === validLicense);
                                return match ? match.title : null;
                            })
                            .filter(Boolean);

                        setSelectedLicenses(matchedLicenses);
                    }
                }
            } catch (error) {
                console.error("Error fetching prices:", error);
                setFormError("Failed to load prices. Using default values.");
            }
        };

        fetchPrices();
    }, [initialCartItems]);
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        const numericString = priceStr.replace(/[^\d.-]/g, "");
        return parseFloat(numericString) || 0;
    };

    const getOrderSummary = () => {
        let subtotal = 0;
        let totalDiscount = 0;

        console.log("Selected licenses:", selectedLicenses);

        selectedLicenses.forEach((licenseTitle) => {
            const license = licenses.find((l) => l.title === licenseTitle);
            if (license) {
                const currentPrice = parsePrice(license.currentPrice);
                const originalPrice = parsePrice(license.originalPrice);
                console.log(`Processing ${license.label}: Current Price = ${currentPrice}, Original Price = ${originalPrice}`);
                subtotal += currentPrice;
                totalDiscount += originalPrice - currentPrice;
            } else {
                console.warn(`License ${licenseTitle} not found in licenses array`);
            }
        });

        const handling = reportData?.internetHandlingCharge ? parseFloat(reportData.internetHandlingCharge) : 20.0;
        const gst = country === "in" ? (subtotal + handling) * 0.18 : 0;
        const payable = subtotal + handling + gst;

        return {
            subtotal,
            discount: totalDiscount,
            handling,
            gst,
            payable,
        };
    };

    // const handleLicenseSelect = (title) => {
    //     console.log("Selecting license:", title);
    //     setSelectedLicenses([title]); // Enforce single selection
    // };

    // const handleLicenseSelect = (title) => {
    //     setSelectedLicenses((prevSelected) => (prevSelected.includes(title) ? prevSelected.filter((t) => t !== title) : [...prevSelected, title]));
    // };
    const handleLicenseSelect = (title) => {
        // If the selected title is Single User License or Enterprise User License, enforce mutual exclusivity
        if (title === "businessPrice" || title === "entrepreneurPrice") {
            setSelectedLicenses((prevSelected) => {
                // If the title is already selected, remove it
                if (prevSelected.includes(title)) {
                    return prevSelected.filter((t) => t !== title);
                }
                // If selecting Single User License, remove Enterprise User License and vice versa
                const exclusiveTitles = ["businessPrice", "entrepreneurPrice"];
                const filtered = prevSelected.filter((t) => !exclusiveTitles.includes(t) || t === title);
                return [...filtered, title];
            });
        } else {
            // For other licenses (e.g., Excel Data Pack), allow multiple selections
            setSelectedLicenses((prevSelected) => (prevSelected.includes(title) ? prevSelected.filter((t) => t !== title) : [...prevSelected, title]));
        }
    };

    const handleKeyDown = (event, title) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleLicenseSelect(title);
        }
    };

    const searchParams = useSearchParams();
    const reportId = searchParams?.get("id");
    const handleCheckout = async () => {
        if (formRef.current && formRef.current.validateAndGetData) {
            const { valid, data, errors } = await formRef.current.validateAndGetData();
            if (valid) {
                setFormError(null);
                setCountry(data.country);
                const orderSummary = getOrderSummary();

                const payload = {
                    reportId: reportId,
                    type: "Checkout",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    companyName: data.companyName,
                    businessEmail: data.businessMail,
                    contactCode: data.contactCode || "+1",
                    contactNo: data.contactNo ? data.contactNo : "7984873134",
                    jobRole: data.jobRole,
                    message: "message for testing purpose",
                    planType: selectedLicenses,
                    subTotal: `$${orderSummary.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    discount: `-$${orderSummary.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    internetHandlingCharge: `$${orderSummary.handling.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    GST: orderSummary.gst ? `(18%) $${orderSummary.gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$0.00",
                    companyAddress: data.companyAddress,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    zipCode: data.zipCode,
                };
                console.log("payload", payload);

                try {
                    const response = await fetch(`${BASE_URL}/inquiry/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });

                    const result = await response.json();
                    console.log("Checkout result:", result);
                    if (isStatusInclude(result?.status)) {
                        showSuccessToast(result?.message);
                    }
                    if (response.ok) {
                        console.log("Inquiry created successfully:", result);
                        if (onProceed) {
                            console.log("customerPostalCodeData", data);

                            const mappedBillingInfo = {
                                fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
                                contactNo: data.contactNo || "Not provided",
                                email: data.businessMail,
                                company: data.companyName,
                                jobRole: data.jobRole,
                                address: `${data.companyAddress}${data.companyAddress2 ? ", " + data.companyAddress2 : ""}, ${data.city}, ${data.state}, ${
                                    data.country
                                }, Pincode-${data.zipCode}`,
                                customerPostalCode: data.zipCode,
                                customerCountry: data.country,
                                customerCity: data.city,
                                customerState: data.state,
                                inquiryId: result?.data?._id,
                            };

                            onProceed({
                                billingInfo: mappedBillingInfo,
                                cartItems: selectedLicenses.map((title) => {
                                    const license = licenses.find((l) => l.title === title);
                                    return {
                                        title: license?.label || title,
                                        price: license?.currentPrice || "$0.00",
                                        licenseType: license?.label || title,
                                        deliveryFormat: license?.deliveryFormat || "PDF",
                                    };
                                }),
                                orderSummary,
                            });
                        }
                    } else {
                        setFormError("Failed to create inquiry. Please try again.");
                    }
                } catch (error) {
                    console.error("Checkout error:", error);
                    setFormError("An error occurred during checkout. Please try again later.");
                }
            } else {
                setFormError(Object.values(errors)[0]?.message || "Please fill all required fields correctly.");
            }
        } else {
            setFormError("Form is not properly initialized.");
        }
    };

    const handleCheckoutKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCheckout();
        }
    };

    const orderSummary = getOrderSummary();

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-[100%] mt-[-1%]">
            <div className="w-full xl:w-2/2">
                <BillingDetailsForm ref={formRef} initialValues={initialBillingInfo} onCountryChange={setCountry} />
                {formError && <div className="text-red-600 mt-2">{formError}</div>}
            </div>
            <div className="w-full xl:w-2/2">
                <section className="p-5 border-solid border-[0.5px] border-[color:var(--Other-Border,rgba(67,70,75,0.30))] w-auto">
                    <h1 className="text-md font-medium leading-relaxed text-zinc-900">Order Summary</h1>

                    {/* <div className="mt-5">
                        <h2 className="text-lg font-medium leading-loose capitalize text-zinc-700">License Options</h2>
                        <div className="mt-4 space-y-4">
                            {licenses.length === 0 ? (
                                <p className="text-gray-500">Loading prices...</p>
                            ) : (
                                licenses.map((license, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-md transition-all duration-200 ${
                                            selectedLicenses.includes(license.title) ? "border-red-500 bg-red-50 shadow-sm" : "border-gray-300"
                                        }`}
                                        onClick={() => handleLicenseSelect(license.title)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, license.title)}
                                        aria-label={`Select ${license.label}`}
                                    >
                                        <div className="flex justify-center p-1 w-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedLicenses.includes(license.title)}
                                                onChange={() => handleLicenseSelect(license.title)}
                                                className="w-5 h-5 cursor-pointer accent-red-500"
                                                aria-label={`Select ${license.label}`}
                                            />
                                        </div>
                                        <div className="flex flex-1 gap-3 items-center min-w-0">
                                            {selectedLicenses.includes(license.title) && (
                                                <Image
                                                    src="/images/Report.webp"
                                                    alt="Product thumbnail"
                                                    width={90}
                                                    height={110}
                                                    className="object-contain aspect-[0.82]"
                                                    quality={100}
                                                />
                                            )}
                                            <div className="flex-1 text-sm leading-snug text-zinc-600">
                                                <h3 className="text-base font-medium text-zinc-900">{license.label || license.title}</h3>
                                                <p className="mt-1.5 leading-5">
                                                    {license.description.slice(0, 55) + (license.description.length > 55 ? "..." : "")}
                                                </p>
                                                <p className="mt-1.5">Delivery Format: {license.deliveryFormat}</p>
                                            </div>
                                            <div className="w-20 text-right leading-none">
                                                <p className="text-base font-semibold text-red-600">{license.currentPrice}</p>
                                                <p className="mt-1.5 text-sm font-medium line-through text-neutral-400">{license.originalPrice}</p>
                                                <p className="mt-4 text-xs font-medium text-sky-900">{license.discount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div> */}
                    <div className="mt-2">
                        <h2 className="text-md font-medium leading-loose capitalize text-zinc-700">License Options</h2>
                        <div className="mt-4 space-y-4">
                            {licenses.length === 0 ? (
                                <p className="text-gray-500">Loading prices...</p>
                            ) : (
                                licenses.map((license, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col sm:flex-row cursor-pointer  gap-4 p-3 border rounded-md transition-all duration-200 ${
                                            selectedLicenses.includes(license.title) ? "border-red-500 bg-red-50 shadow-sm" : "border-gray-300"
                                        }`}
                                        onClick={() => handleLicenseSelect(license.title)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => handleKeyDown(e, license.title)}
                                        aria-label={`Select ${license.label}`}
                                    >
                                        <div className="flex  justify-center items-center p-1 w-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedLicenses.includes(license.title)}
                                                // onChange={() => handleLicenseSelect(license.title)}
                                                className="w-5 h-5 cursor-pointer accent-red-500"
                                                aria-label={`Select ${license.label}`}
                                            />
                                        </div>
                                        <div className="flex flex-1 gap-3 items-center min-w-0">
                                            <div className="flex-1 text-sm leading-snug text-zinc-600">
                                                <h3 className="text-sm font-semibold text-zinc-900">{license.label || license.title}</h3>
                                                {/* <p className="mt-1.5 leading-5">
                                                    {license.description.slice(0, 55) + (license.description.length > 55 ? "..." : "")}
                                                </p> */}
                                                <p className="mt-1.5 text-xs">{license.deliveryFormat}</p>
                                            </div>
                                            <div className="w-20 text-right leading-none">
                                                <p className="text-md font-semibold text-md text-red-600">{license.currentPrice}</p>
                                                {/* <p className="mt-1.5 text-sm font-medium line-through text-neutral-400">{license.originalPrice}</p> */}
                                                <p className="mt-4 text-xs font-medium text-sky-900">{license.discount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="mt-5 text-xs font-medium leading-snug text-zinc-700">
                        <div className="py-4 border-y-[0.5px] border-solid border-[color:var(--Other-Border,rgba(67,70,75,0.30))]">
                            <div className="flex flex-wrap gap-10 justify-between">
                                <span>Subtotal</span>
                                <span>${orderSummary.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            {/* <div className="flex flex-wrap gap-10 justify-between mt-2.5">
                                <span>Discount</span>
                                <span>-${orderSummary.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div> */}
                            <div className="flex flex-wrap gap-10 justify-between mt-2.5">
                                <span>Internet handling charges</span>
                                <span>${orderSummary.handling.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            {orderSummary.gst > 0 && (
                                <div className="flex flex-wrap gap-10 justify-between mt-2.5">
                                    <span>GST (18%)</span>
                                    <span>${orderSummary.gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-10 justify-between mt-2">
                            <span className="text-sm capitalize">Payable Amount</span>
                            <span className="text-sm text-right text-red-600">
                                ${orderSummary.payable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Optional Checkout Button */}

                    <div className="my-2">
                        <button
                            onClick={handleCheckout}
                            className="w-full px-5 py-3 text-md font-medium text-white bg-sky-900 rounded-md hover:bg-sky-800 transition"
                        >
                            Proceed to Checkout
                        </button>
                        <p className="mt-3 text-xs text-zinc-600">
                            By clicking "Proceed to Checkout", you agree to our{" "}
                            <Link href="/termsandcondition" className="text-sky-500 underline">
                                Terms & Conditions
                            </Link>
                            ,{" "}
                            <Link href="/retunpolicy" className="text-sky-500 underline">
                                Return Policy
                            </Link>
                            , and{" "}
                            <Link href="/privacypolicy" className="text-sky-500 underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
