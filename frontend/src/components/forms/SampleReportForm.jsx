// "use client";
// import React from "react";

// const SampleReportForm = () => {
//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">Get Quick Sample Report</h2>
//       <form className="space-y-5">
//         {/* Name */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter Full name"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Company Name */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Company Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter company name"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Business Email ID */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Business Email ID<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             placeholder="Enter business email"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Contact Number */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Contact Number<span className="text-red-500">*</span>
//           </label>
//           <div className="flex flex-1 gap-3">
//             <select className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300">
//               <option>Code</option>
//               <option>+91</option>
//               <option>+1</option>
//               <option>+44</option>
//             </select>
//             <input
//               type="tel"
//               placeholder="Enter phone number"
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//             />
//           </div>
//         </div>

//         {/* Job Role */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Job Role<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter Job Role"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Message */}
//         <div className="flex items-start gap-4">
//           <label className="w-40 text-sm font-medium text-gray-700">
//             Message<span className="text-red-500">*</span>
//           </label>
//           <textarea
//             placeholder="Write your message"
//             rows="4"
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-center pt-4">
//           <button
//             type="submit"
//             className="bg-sky-400 text-white font-medium px-6 py-2 rounded-md hover:bg-sky-500 transition"
//           >
//             Request sample Report
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SampleReportForm;
"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";
import { BASE_URL } from "../../../config";
import * as Yup from "yup";
import { MuiTelInput } from "mui-tel-input";
// Generate random 4-digit captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const createSchema = (captchaCode) =>
    Yup.object().shape({
        fullName: Yup.string().required("Full Name is required"),
        companyName: Yup.string().required("Company Name is required"),
        email: Yup.string().required("Business Email is required").email("Enter a valid email address"),
        countryCode: Yup.string().required("Country code is required"),
        phone: Yup.string().required("Contact Number is required"),
        jobRole: Yup.string().required("Job Role is required"),
        message: Yup.string().required("Message is required"),
        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", function (value) {
                return value === captchaCode;
            }),
    });

const SampleReportForm = (props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reportId = props?.reportData?.report?._id || searchParams?.get("reportId");

    // Captcha state - initialize as null to prevent hydration mismatch
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // Generate captcha only on client side after hydration
    useEffect(() => {
        setIsClient(true);
        setCaptchaCode(generateCaptcha());
    }, []);

    // Memoize the schema to prevent unnecessary re-renders
    const schema = useMemo(() => {
        return createSchema(captchaCode || "0000");
    }, [captchaCode]);

    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        email: "",
        countryCode: "+1", // Default country code changed to USA
        phone: "",
        jobRole: "",
        message: "",
        captcha: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = useCallback(
        (field) => (e) => {
            setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        },
        []
    );

    const handleCountrySelect = (country) => {
        setFormData((prev) => ({ ...prev, countryCode: country.phoneCode }));
    };

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        setFormData((prev) => ({ ...prev, captcha: "" }));
        // Clear captcha error if it exists
        if (errors.captcha) {
            setErrors((prev) => ({ ...prev, captcha: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form data using Yup schema
            await schema.validate(formData, { abortEarly: false });
            setErrors({}); // Clear any previous errors

            const payload = {
                reportId: reportId,
                type: "Request For The Sample",
                firstName: formData.fullName.split(" ")[0] || "",
                lastName: formData.fullName.split(" ")[1] || "",
                companyName: formData.companyName,
                businessEmail: formData.email,
                contactCode: formData.countryCode,
                contactNo: formData.phone,
                jobRole: formData.jobRole,
                message: formData.message,
                planType: "N/A",
                subTotal: "$0.00",
                discount: "$0.00",
                internetHandlingCharge: "$0.00",
                GST: "$0.00",
                companyAddress: "N/A",
                city: "N/A",
                state: "N/A",
                country: formData.countryCode === "+1" ? "United States" : "N/A",
                zipCode: "N/A",
            };

            const res = await fetch(`${BASE_URL}/inquiry/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Sample report request submitted successfully!", {
                    duration: 3000,
                    style: {
                        background: "#4ade80",
                        color: "#fff",
                    },
                    icon: <Check />,
                });
                setFormData({
                    fullName: "",
                    companyName: "",
                    email: "",
                    countryCode: "+1",
                    phone: "",
                    jobRole: "",
                    message: "",
                    captcha: "",
                });
                // Generate new captcha after successful submission
                setCaptchaCode(generateCaptcha());
            } else {
                toast.error(result?.message || "Submission failed.", {
                    duration: 5000,
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            }
        } catch (validationError) {
            if (validationError.inner) {
                // Handle Yup validation errors
                const newErrors = {};
                validationError.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
                toast.error("Please fix the form errors and try again.", {
                    duration: 5000,
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            } else {
                // Handle network errors
                toast.error("Network error. Please try again later.", {
                    duration: 5000,
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                });
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white ">
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
            <header className="mb-6">
                <h3 className="text-xl sm:text-2xl items-center text-center font-bold text-zinc-900">Get A Quick Sample Report</h3>
            </header>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange("fullName")}
                        placeholder="Enter Full name"
                        className={`flex-1 px-3 text-[10px] sm:px-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                            errors.fullName ? "border-red-600" : ""
                        }`}
                        required
                    />
                    {errors.fullName && <span className="text-red-600 text-sm">{errors.fullName}</span>}
                </div>

                {/* Company Name */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Company Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange("companyName")}
                        placeholder="Enter company name"
                        className={`flex-1 px-3 sm:px-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                            errors.companyName ? "border-red-600" : ""
                        }`}
                        required
                    />
                    {errors.companyName && <span className="text-red-600 text-sm">{errors.companyName}</span>}
                </div>

                {/* Business Email ID */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Business Email ID<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        placeholder="Enter business email"
                        className={`flex-1 px-3 sm:px-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                            errors.email ? "border-red-600" : ""
                        }`}
                        required
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email}</span>}
                </div>

                {/* Contact Number */}
                {/* <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Contact Number<span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-1 gap-2 sm:gap-3">
                        <CountryFlagDropdown
                            selectedCountry={countries.find((c) => c.code === "us")}
                            onCountrySelect={handleCountrySelect}
                            className="w-24 sm:w-28" // Match the original width
                        />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange("phone")}
                            placeholder="Enter phone number"
                            className={`flex-1 px-3 sm:px-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                                errors.phone ? "border-red-600" : ""
                            }`}
                            required
                        />
                    </div>
                    {errors.phone && <span className="text-red-600 text-sm">{errors.phone}</span>}
                </div> */}

                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Contact Number<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[100%]">
                        <MuiTelInput
                            name="phone"
                            value={`${formData.countryCode || ""}${formData.phone || ""}`}
                            onChange={(value, info) => {
                                setFormData((prev) => ({ ...prev, phone: info?.nationalNumber, countryCode: `+${info?.countryCallingCode}` }));
                            }}
                            defaultCountry="US"
                            forceCallingCode
                            placeholder="Enter phone number"
                            variant="outlined"
                            size="small"
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 34,
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                    borderColor: errors.phone ? "#dc2626" : "#d1d5db",
                                },
                                "& input": { padding: "8px 12px" },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errors.phone ? "#dc2626" : "#d1d5db",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: errors.phone ? "#dc2626" : "#3b82f6",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                },
                            }}
                            className={`flex-1 text-sm sm:text-base w-[100%] ${errors.phone ? "border-red-600" : ""}`}
                        />
                        {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                    </div>
                </div>

                {/* Job Role */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Job Role<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.jobRole}
                        onChange={handleChange("jobRole")}
                        placeholder="Enter Job Role"
                        className={`flex-1 px-3 sm:px-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                            errors.jobRole ? "border-red-600" : ""
                        }`}
                        required
                    />
                    {errors.jobRole && <span className="text-red-600 text-sm">{errors.jobRole}</span>}
                </div>

                {/* Message */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                        Message<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.message}
                        onChange={handleChange("message")}
                        placeholder="Write your message"
                        className={`flex-1 px-3 sm:px-4 h-[82px] resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-vertical ${
                            errors.message ? "border-red-600" : ""
                        }`}
                        required
                    />
                    {errors.message && <span className="text-red-600 text-sm">{errors.message}</span>}
                </div>

                {/* Captcha Section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full ">
                    <div className="flex flex-col gap-2 ">
                        <label className="w-full sm:w-32 lg:w-40 text-[15px] font-[500] text-gray-700 flex-shrink-0">
                            Captcha Code <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <div className="flex flex-col gap-2  w-[100%] ">
                        <div className="flex items-center gap-3">
                            {/* Input field */}
                            <input
                                type="text"
                                value={formData.captcha}
                                onChange={handleChange("captcha")}
                                placeholder="Enter captcha"
                                className={`flex-1 px-3 sm:px-4 border w-[100%] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-10 ${
                                    errors.captcha ? "border-red-600" : ""
                                }`}
                                autoComplete="off"
                            />

                            {/* Captcha display */}
                            <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md min-w-[100px] h-10 px-3">
                                {isClient && captchaCode ? (
                                    <span className="text-base sm:text-lg font-bold text-gray-800 tracking-wider select-none">{captchaCode}</span>
                                ) : (
                                    <span className="text-base sm:text-lg font-bold text-gray-400 tracking-wider select-none">----</span>
                                )}
                            </div>

                            {/* Refresh button */}
                            <button
                                type="button"
                                onClick={handleRefreshCaptcha}
                                disabled={!isClient}
                                className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
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

                        {/* Error message */}
                        {errors.captcha && <span className="text-red-600 text-sm">{errors.captcha}</span>}
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#17306E] hover:bg-[#1b387c] text-white font-medium px-5 sm:px-8 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 text-sm"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SampleReportForm;
