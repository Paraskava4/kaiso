"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { X, Check } from "lucide-react";
import { BASE_URL } from "../../../config";
import { MuiTelInput } from "mui-tel-input";

// Generate random 4-digit captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const InquiryForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        businessEmail: "",
        countryCode: "+1",
        phoneNumber: "",
        jobRole: "",
        message: "",
        captcha: "",
    });

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    // Captcha state - initialize as null to prevent hydration mismatch
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [captchaError, setCaptchaError] = useState("");

    // Generate captcha only on client side after hydration
    useEffect(() => {
        setIsClient(true);
        setCaptchaCode(generateCaptcha());
    }, []);

    const countryCodes = [
        { code: "+1", country: "US" },
        { code: "+44", country: "UK" },
        { code: "+91", country: "IN" },
        { code: "+86", country: "CN" },
        { code: "+81", country: "JP" },
        { code: "+49", country: "DE" },
        { code: "+33", country: "FR" },
    ];

    const handleChange = useCallback(
        (field) => (e) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        },
        []
    );

    const handleCodeChange = (code) => {
        setFormData((prev) => ({ ...prev, countryCode: code }));
        setDropdownOpen(false);
    };

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        setFormData((prev) => ({ ...prev, captcha: "" }));
        setCaptchaError("");
    };

    const searchParams = useSearchParams();
    const reportId = searchParams?.get("id");
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate captcha
        if (!formData.captcha) {
            setCaptchaError("Captcha code is required");
            toast.error("Please enter the captcha code", {
                duration: 3000,
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
                icon: <X />,
            });
            return;
        }

        if (formData.captcha !== captchaCode) {
            setCaptchaError("Please enter the correct captcha code");
            toast.error("Incorrect captcha code", {
                duration: 3000,
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
                icon: <X />,
            });
            return;
        }

        setCaptchaError("");

        const payload = {
            reportId: reportId,
            type: "Inquiry Before Buy",
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            businessEmail: formData.businessEmail,
            contactCode: formData.countryCode,
            contactNo: formData.phoneNumber,
            jobRole: formData.jobRole,
            message: formData.message,
        };

        try {
            const res = await fetch(`${BASE_URL}/inquiry/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Inquiry submitted successfully!", {
                    duration: 3000,
                    style: {
                        background: "#4ade80",
                        color: "#fff",
                    },
                    icon: <Check />,
                });
                setFormData({
                    firstName: "",
                    lastName: "",
                    companyName: "",
                    businessEmail: "",
                    countryCode: "+1",
                    phoneNumber: "",
                    jobRole: "",
                    message: "",
                    captcha: "",
                });
                handleRefreshCaptcha(); // Generate new captcha after successful submission
            } else {
                toast.error(result?.message || "Something went wrong!", {
                    duration: 5000,
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                    icon: <X />,
                });
            }
        } catch (error) {
            toast.error("Network error. Please try again.", {
                duration: 5000,
                style: {
                    background: "#ef4444",
                    color: "#fff",
                },
                icon: <X />,
            });
        }
    };

    return (
        <main className="p-8 bg-white border border-gray-300 w-[100%] max-md:px-5 ">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: "#4ade80",
                            color: "#fff",
                        },
                        icon: <Check />,
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: "#ef4444",
                            color: "#fff",
                        },
                        icon: <X />,
                    },
                }}
            />
            <header className="flex flex-wrap justify-between items-start text-zinc-900 text-[16px] font-[500] text-lg font-medium">
                <h1>Inquiry Before Buy</h1>
                <button type="button" onClick={() => router.back()} className="hover:text-zinc-700 focus:outline-none rounded">
                    Back
                </button>
            </header>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-base w-[100%]">
                <div className="flex items-center gap-4  w-[100%]">
                    <label className="block w-[40%] text-zinc-900 text-[16px] font-[500]">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        required
                        className="w-full px-5 py-1 text-sm border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex items-center gap-4 w-[100%]">
                    <label className="block w-[40%]  text-zinc-900 text-[16px] font-[500]">Last Name</label>
                    <input
                        type="text"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex items-center gap-4  w-[100%]">
                    <label className="block  w-[40%]  text-zinc-900 text-[16px] font-[500]">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={handleChange("companyName")}
                        required
                        className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex items-center gap-4  w-[100%]">
                    <label className="block  w-[40%] text-zinc-900 text-[16px] font-[500]">
                        Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter business email"
                        value={formData.businessEmail}
                        onChange={handleChange("businessEmail")}
                        required
                        className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md"
                    />
                </div>

                {/* <div className="flex items-center gap-4  w-[100%]">
                    <label className="block w-[40%] mb-2 text-zinc-900 text-[16px] font-[500]">
                        Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="w-full px-5 py-3 border border-gray-300 rounded-md flex justify-between items-center"
                        >
                            {formData.countryCode}
                            <span className="ml-2">▾</span>
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {countryCodes.map(({ code, country }) => (
                                    <li key={code}>
                                        <button
                                            type="button"
                                            onClick={() => handleCodeChange(code)}
                                            className="w-full px-4 py-1 text-sm  text-left text-zinc-600 hover:bg-gray-100"
                                        >
                                            {code} ({country})
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div> */}
                <div className="flex items-center gap-4  w-[100%]">
                    {/* <label className="block w-[40%] text-zinc-900 text-[16px] font-[500]">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 w-[100%]">
                        <div className="">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                                className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md flex justify-between items-center"
                            >
                                {formData.countryCode}
                                <span className="ml-2">▾</span>
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {countryCodes.map(({ code, country }) => (
                                        <li key={code}>
                                            <button
                                                type="button"
                                                onClick={() => handleCodeChange(code)}
                                                className="w-full px-4 py-1 text-sm  text-left text-zinc-600 hover:bg-gray-100"
                                            >
                                                {code} ({country})
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange("phoneNumber")}
                            required
                            className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md"
                        />
                    </div> */}

                    <label className="w-[27.4%] text-[16px] font-[500] text-gray-700 flex-shrink-0">
                        Contact Number<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[100%]">
                        <MuiTelInput
                            name="phoneNumber"
                            value={`${formData.countryCode || ""}${formData.phoneNumber || ""}`}
                            onChange={(value, info) => {
                                const number = info?.nationalNumber || "";
                                setFormData((prev) => ({
                                    ...prev,
                                    phoneNumber: number,
                                    countryCode: `+${info?.countryCallingCode || ""}`,
                                }));
                            }}
                            defaultCountry="US"
                            forceCallingCode
                            placeholder="Enter phone number"
                            variant="outlined"
                            size="small"
                            className="w-[100%]"
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 36,
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                },
                                "& input": {
                                    padding: "8px 12px",
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4  w-[100%]">
                    <label className="block w-[40%] text-zinc-900 text-[16px] font-[500]">
                        Job Role <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Job Role"
                        value={formData.jobRole}
                        onChange={handleChange("jobRole")}
                        required
                        className="w-full px-5 py-1 text-sm  border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex items-center gap-4  w-[100%]">
                    <label className="block w-[40%] text-zinc-900 text-[16px] font-[500]">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Write your message"
                        value={formData.message}
                        onChange={handleChange("message")}
                        required
                        rows={5}
                        className="w-full px-5 py-1 text-sm  border border-gray-300 resize-none rounded-md"
                    />
                </div>

                {/* Captcha Section */}
                <div className="flex items-center gap-4 w-[100%]">
                    <label className="block w-[40%] text-zinc-900 text-[16px] font-[500]">
                        Verification Code <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                            <input
                                type="text"
                                placeholder="Enter captcha"
                                value={formData.captcha}
                                onChange={handleChange("captcha")}
                                required
                                className={`flex-1 px-5 py-1 text-sm w-full  border rounded-md focus:outline-none focus:ring-2 ${
                                    captchaError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                                }`}
                                autoComplete="off"
                            />
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md px-4 py-1 text-sm  min-w-[100px] h-[30px]">
                                    {isClient && captchaCode ? (
                                        <span className="text-md font-bold text-gray-800 tracking-wider select-none">{captchaCode}</span>
                                    ) : (
                                        <span className="text-md font-bold text-gray-400 tracking-wider">----</span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRefreshCaptcha}
                                    disabled={!isClient}
                                    className="flex items-center justify-center w-7 h-7 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
                                    title="Refresh captcha"
                                    aria-label="Refresh captcha code"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {captchaError && <span className="text-red-600 text-xs mt-1 block">{captchaError}</span>}
                        <p className="text-xs text-gray-600 mt-1">Please enter the code shown above</p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="px-8 py-2 min-w-[220px] text-sm bg-[#1f4a70] text-white rounded-md transition-colors">
                        Inquire Now
                    </button>
                </div>
            </form>
        </main>
    );
};

export default InquiryForm;
