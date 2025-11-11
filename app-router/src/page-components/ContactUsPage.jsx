"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Footer } from "@/components/layout";
import CountryFlagDropdown from "@/components/ui/CountryFlagDropdown";
import { toast, ToastBar, Toaster } from "react-hot-toast";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { countriesArray } from "@/data/countries";
import { MuiTelInput } from "mui-tel-input";
import { BASE_URL } from "../config";

// Generate random 4-digit captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Validation schema
const createSchema = (captchaCode) =>
    Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().required("Business Email is required").email("Enter a valid email address"),
        companyName: Yup.string().required("Company Name is required"),
        jobRole: Yup.string().required("Job Role is required"),
        phone: Yup.string().required("Phone Number is required"),
        message: Yup.string().required("Message is required"),
        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", function (value) {
                return value === captchaCode;
            }),
    });

const ContactUsPage = () => {
    // Captcha state - initialize as null to prevent hydration mismatch
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        code: "USA",
        name: "U.S.A.",
        phoneCode: "+1",
        flag: "/icons/country-flags-svg/us.svg",
    });

    const [statusMessage, setStatusMessage] = useState(null); // still retained if needed

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
            firstName: "",
            lastName: "",
            email: "",
            companyName: "",
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

    const onSubmit = async (data) => {
        const payload = {
            reportId: "",
            type: "Contact Us",
            firstName: data.firstName,
            lastName: data.lastName,
            companyName: data.companyName,
            businessEmail: data.email,
            contactCode: data.phoneCode,
            contactNo: data.phone,
            jobRole: data.jobRole,
            message: data.message,
            planType: "N/A",
            subTotal: "$0.00",
            discount: "$0.00",
            internetHandlingCharge: "$0.00",
            GST: "$0.00",
            companyAddress: "N/A",
            city: "N/A",
            state: "N/A",
            country: selectedCountry.name,
            zipCode: "N/A",
        };

        try {
            const res = await fetch(`${BASE_URL}/inquiry/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Contact request submitted successfully!", {
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
                toast.error(result?.message || "Submission failed.", {
                    duration: 5000,
                    style: {
                        background: "#ef4444",
                        color: "#fff",
                    },
                    icon: <X />,
                });
            }
        } catch (error) {
            toast.error("Network error. Please try again later.", {
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
        <main className="min-h-screen" style={{ background: "#ffffffff" }}>
            {/* Custom toast */}
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
            {/* bg-[url('/images/bgg.png')] */}
            {/* Form Section */}
            <div className="w-full py-8 sm:py-10 md:py-10 lg:py-10 bg-cover bg-center bg-no-repeat">
                <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <h1
                            className="text-[26px] md:text-[26px] font-semibold mb-3 md:mb-4 mt-2 md:mt-4"
                            style={{ fontWeight: "700", lineHeight: "120%" }}
                        >
                            Contact Us
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                            <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="Enter first name"
                                    className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
                                        errors.firstName ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.firstName && <span className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</span>}
                            </div>
                        </div>
                        <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                            <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Enter last name"
                                    className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
                                        errors.lastName ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.lastName && <span className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</span>}
                            </div>
                        </div>

                        <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                            <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                Business Email <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-1 w-full">
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="Enter email address"
                                    className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email.message}</span>}
                            </div>
                        </div>

                        <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                            <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    {...register("companyName")}
                                    placeholder="Enter your company name"
                                    className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
                                        errors.companyName ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.companyName && <span className="text-red-500 text-[10px] mt-1">{errors.companyName.message}</span>}
                            </div>
                        </div>

                        <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                            <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                Job Role <span className="text-red-500">*</span>
                            </label>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    {...register("jobRole")}
                                    placeholder="Enter your role"
                                    className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
                                        errors.jobRole ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.jobRole && <span className="text-red-500 text-[10px] mt-1">{errors.jobRole.message}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-10 w-full mt-3">
                            <label className="sm:w-32 text-[15px] font-medium text-gray-700 whitespace-nowrap">
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
                                            placeholder="Enter phone number"
                                            value={`${watch("phoneCode") || ""}${watch("phone") || ""}`} // ✅ combine code + number
                                            defaultCountry="US"
                                            variant="outlined"
                                            forceCallingCode
                                            size="small"
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    height: 38, // smaller height
                                                    fontSize: "14px",
                                                },
                                                "& input": {
                                                    padding: "6px 8px", // tighter padding
                                                },
                                            }}
                                            error={!!fieldState.error}
                                            // helperText={fieldState.error?.message}
                                            onChange={(value, info) => {
                                                const nationalNumber = info?.nationalNumber || "";
                                                const countryCode = `+${info?.countryCallingCode || ""}`;

                                                // ✅ store separately
                                                setValue("phone", nationalNumber, { shouldValidate: true });
                                                setValue("phoneCode", countryCode, { shouldValidate: true });

