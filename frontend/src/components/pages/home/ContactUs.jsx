"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";
import { BASE_URL } from "../../../../config";
import { MuiTelInput } from "mui-tel-input";
import { countriesArray } from "@/data/countries";

// Generate random 4-digit captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Validation schema
const createSchema = (captchaCode) =>
    Yup.object().shape({
        fullName: Yup.string().required("Full Name is required"),
        companyName: Yup.string().required("Company Name is required"),
        email: Yup.string().required("Business Email is required").email("Enter a valid email address"),
        jobRole: Yup.string().required("Job Role is required"), // Added jobRole
        phone: Yup.string().required("Contact Number is required"),
        message: Yup.string().required("Message is required"),
        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", function (value) {
                return value === captchaCode;
            }),
    });

const ContactUs = ({ pageName }) => {
    // Captcha state - initialize as null to prevent hydration mismatch
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        code: "us",
        name: "U.S.A.",
        phoneCode: "+1",
        flag: "/icons/country-flags-svg/us.svg",
    });

    // Generate captcha only on client side after hydration
    useEffect(() => {
        setIsClient(true);
        setCaptchaCode(generateCaptcha());
    }, []);

    // Memoize the schema to prevent unnecessary re-renders
    const schema = useMemo(() => {
        return createSchema(captchaCode || "0000");
    }, [captchaCode]);

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            companyName: "",
            email: "",
            jobRole: "",
            phone: "",
            message: "",
            captcha: "",
        },
    });

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
    };

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        setValue("captcha", "", { shouldValidate: false });
    };

    // Watch phone field to handle country code prefix
    const phoneValue = watch("phone");

    // useEffect(() => {
    //     if (phoneValue && selectedCountry.phoneCode) {
    //         const phoneCodePattern = new RegExp(`^\\${selectedCountry.phoneCode}\\s*`);
    //         const cleanedValue = phoneValue.replace(phoneCodePattern, "");
    //         if (cleanedValue !== phoneValue) {
    //             setValue("phone", cleanedValue, { shouldValidate: false });
    //         }
    //     }
    // }, [phoneValue, selectedCountry.phoneCode, setValue]);

    const onSubmit = async (data) => {
        console.log("data<><><", data);

        const payload = {
            reportId: "",
            type: "Other",
            firstName: data.fullName,
            lastName: "",
            companyName: data.companyName,
            businessEmail: data.email,
            contactCode: data.phoneCode,
            contactNo: data.phone,
            jobRole: data.jobRole,
            message: data.message,
            planType: "",
            subTotal: "",
            discount: "",
            internetHandlingCharge: "",
            GST: "",
            companyAddress: "",
            city: "",
            state: "",
            country: selectedCountry.name.toLowerCase(),
            zipCode: "",
            pageName: pageName,
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
                // Reset form and generate new captcha
                reset();
                handleRefreshCaptcha();
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
                    icon: <X />,
                },
            });
        }
    };

    return (
        <div className="contact-us-section" data-section="contact-us">
            {/* Toast setup */}
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
            {/* Background curved section */}
            <div className="contact-us-background">
                <Image src="/images/Contact-bg.webp" alt="" className="contact-us-bg-img" width={100} height={100} priority quality={100} />
            </div>

            {/* Contact form container */}
            <div className="contact-us-form-container">
                <div className="contact-us-form-content">
                    {/* Header section */}
                    <div className="contact-us-header">
                        <h2 className="contact-us-title">Connect With Our Experts</h2>
                        {/* //Start your growth journey with Kaiso Research & Consulting */}
                        {/* <p className="text-gray-600 text-sm sm:text-base whitespace-nowrap md:text-lg">We're always ready to deal with you.</p> */}
                        <p className="text-black text-xs sm:text-sm md:text-sm lg:text-md xl:text-md whitespace-normal sm:whitespace-nowrap">
                            Start your growth journey with Kaiso Research and Consulting
                        </p>
                    </div>

                    {/* Form section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full max-w-2xl  mx-auto">
                        <div>
                            {/* Full Name */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Full Name <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        {...register("fullName")}
                                        placeholder="Enter your full name"
                                        className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white ${
                                            errors.fullName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.fullName && <span className="text-red-500 text-[10px] mt-1">{errors.fullName.message}</span>}
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Company Name <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        {...register("companyName")}
                                        placeholder="Enter your company name"
                                        className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white ${
                                            errors.companyName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.companyName && <span className="text-red-500 text-[10px] mt-1">{errors.companyName.message}</span>}
                                </div>
                            </div>

                            {/* Business Email ID */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Business Email ID <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="Enter your business Email ID"
                                        className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white ${
                                            errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email.message}</span>}
                                </div>
                            </div>

                            {/* Job Role */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Job Role <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        {...register("jobRole")}
                                        placeholder="Enter your job role"
                                        className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white ${
                                            errors.jobRole ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.jobRole && <span className="text-red-500 text-[10px] mt-1">{errors.jobRole.message}</span>}
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Contact Number <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{ required: "Phone number is required" }}
                                        render={({ field, fieldState }) => (
                                            <MuiTelInput
                                                {...field}
                                                fullWidth
                                                onlyCountries={countriesArray}
                                                defaultCountry="US"
                                                placeholder="Enter phone number"
                                                variant="outlined"
                                                forceCallingCode
                                                size="small"
                                                value={`${watch("phoneCode") || ""}${watch("phone") || ""}`}
                                                sx={{
                                                    "& .MuiInputBase-root": {
                                                        height: 38,
                                                        fontSize: "14px",
                                                    },
                                                    "& input": {
                                                        padding: "6px 8px",
                                                    },
                                                }}
                                                error={!!fieldState.error}
                                                onChange={(value, info) => {
                                                    const nationalNumber = info?.nationalNumber || "";
                                                    const countryCode = `+${info?.countryCallingCode || ""}`;
                                                    setValue("phone", nationalNumber, { shouldValidate: true });
                                                    setValue("phoneCode", countryCode, { shouldValidate: true });
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.phone && <span className="text-red-500 text-[10px] mt-1">{errors.phone.message}</span>}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center my-2 gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Message <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <textarea
                                        {...register("message")}
                                        placeholder="Your Message"
                                        className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white h-[82px] resize-none ${
                                            errors.message ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.message && <span className="text-red-500 text-[10px] mt-1">{errors.message.message}</span>}
                                </div>
                            </div>

                            {/* Captcha Section */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Verification code <span className="text-orange-600">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 sm:flex-wrap">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register("captcha")}
                                                placeholder="Enter captcha"
                                                className={`w-full text-[14px] p-1.5 sm:p-1.5 border rounded-md bg-white ${
                                                    errors.captcha ? "border-red-500" : "border-gray-300"
                                                }`}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md px-4 py-3 min-w-[100px] h-[34px]">
                                                {isClient && captchaCode ? (
                                                    <span className="text-md font-bold text-gray-800 tracking-wider select-none">{captchaCode}</span>
                                                ) : (
                                                    <span className="text-md font-bold text-gray-400 tracking-wider select-none">----</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRefreshCaptcha}
                                                disabled={!isClient}
                                                className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
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
                                    {errors.captcha && <span className="text-red-500 text-[10px] mt-1">{errors.captcha.message}</span>}
                                </div>
                            </div>

                            <div className="text-center pt-2 sm:pt-3 md:pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#17306E] text-white py-2 px-6 sm:px-8 md:px-12 rounded-md font-medium hover:bg-[#1b387c] transition-colors text-[15px]"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
