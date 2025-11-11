"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, Toaster } from "react-hot-toast";
import { Check, X, Upload } from "lucide-react";
import { MuiTelInput } from "mui-tel-input";
import { Footer } from "@/components";
import { BASE_URL } from "../../config";
import { countriesArray } from "@/data/countries";
import UniversalSEO from "@/utils/seo/universalSEO";

// Generate captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Validation schema
const createSchema = (captchaCode) =>
    Yup.object().shape({
        fullName: Yup.string().required("Full Name is required"),
        email: Yup.string().required("Email is required").email("Enter a valid email address"),
        phone: Yup.string().required("Phone Number is required"),
        message: Yup.string().required("Message is required"),

        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", function (value) {
                return value === captchaCode;
            }),

        resume: Yup.mixed()
            .required("Resume is required")
            .test("fileType", "Only PDF, DOC, DOCX, PNG, and JPG are allowed", (value) => {
                if (!value || value.length === 0) return false;
                const allowedTypes = [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "image/png",
                    "image/jpeg",
                ];
                return allowedTypes.includes(value[0]?.type);
            })
            .test("fileSize", "File size must be less than 5MB", (value) => {
                if (!value || value.length === 0) return false;
                return value[0]?.size <= 5 * 1024 * 1024; // 5MB
            }),
    });

const Career = ({ seoData }) => {
    // Captcha state
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        code: "USA",
        name: "U.S.A.",
        phoneCode: "+1",
        flag: "/icons/country-flags-svg/us.svg",
    });

    // Generate captcha only on client side
    useEffect(() => {
        setIsClient(true);
        setCaptchaCode(generateCaptcha());
    }, []);

    // Memoize the schema
    const schema = useMemo(() => {
        return createSchema(captchaCode || "0000");
    }, [captchaCode]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
        defaultValues: {
            fullName: "", // Updated default value
            email: "",
            phone: "",
            phoneCode: selectedCountry.phoneCode, // Initialize phoneCode
            message: "",
            captcha: "",
            resume: null,
        },
    });

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        setValue("captcha", "", { shouldValidate: false });
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("contactCode", data.phoneCode || selectedCountry.phoneCode);
        formData.append("contactNo", data.phone);
        formData.append("message", data.message);
        if (data.resume && data.resume[0]) {
            formData.append("resume", data.resume[0]);
        }

        try {
            const res = await fetch(`${BASE_URL}/career/create`, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Career inquiry submitted successfully!", {
                    duration: 3000,
                    style: {
                        background: "#4ade80",
                        color: "#fff",
                    },
                    icon: <Check />,
                });
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
        <>
            <UniversalSEO seoData={seoData} />
            <div className="w-[81%] mx-auto flex justify-center items-center min-h-[85vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full sm:my-10">
                    {/* Left Section */}
                    <div className="flex flex-col justify-center items-start w-full md:w-[70%]">
                        <p className="text-[#262626] text-xs">Join our team</p>

                        <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-bold leading-tight">
                            Let’s get to work, together
                        </h1>

                        <p className="text-[#262626] text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] leading-relaxed mt-4">
                            The world of work needs, well, work. It needs us. And we need you. Our quest to offer a better employee experience to all is far
                            from being over Be part of it. Send you profile at
                            <a href="/join-us" className="text-blue-600 hover:underline ml-1">
                                hr@kaisoresearch.com
                            </a>
                        </p>

                        <button className="bg-[#163272] text-white px-6 py-2 rounded-lg text-sm sm:text-base mt-6 w-full sm:w-auto">See Available Jobs</button>
                    </div>

                    {/* Right Section (Image) */}
                    <div className="flex justify-center items-center rounded-lg overflow-hidden">
                        <Image src="/images/carre.webp" alt="Office team working together" width={478} height={300} className="rounded-lg object-cover" />
                    </div>
                </div>
            </div>
            <section>
                <div className="w-[81%] mx-auto py-8">
                    <div className="max-w-2xl mx-auto">
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
                        <h2 className="text-[24px] text-[#163272] font-semibold mb-6 text-center" style={{ fontWeight: "600", lineHeight: "120%" }}>
                            Share Your Profile
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        {...register("fullName")}
                                        placeholder="Enter full name"
                                        className={`w-full p-1.5 text-[14px] border rounded-md bg-white ${
                                            errors.fullName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.fullName && <span className="text-red-500 text-[10px] mt-1">{errors.fullName.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Email ID <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="Enter email address"
                                        className={`w-full p-1.5 text-[14px] border rounded-md bg-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.email && <span className="text-red-500 text-[10px] mt-1">{errors.email.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-3">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap">
                                    Contact Number <span className="text-red-500">*</span>
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
                                                value={`${watch("phoneCode") || ""}${watch("phone") || ""}`}
                                                defaultCountry="US"
                                                variant="outlined"
                                                forceCallingCode
                                                size="small"
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap mt-2">
                                    Resume <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <div className="relative flex flex-col items-center justify-center w-full p-4 text-[14px] border rounded-md bg-white border-gray-300 gap-2 cursor-pointer hover:bg-gray-50 transition">
                                        <Upload className="text-gray-600 w-8 h-8" />
                                        <p className="text-gray-600 text-sm">{watch("resume")?.[0]?.name || "Upload resume"}</p>
                                        <input
                                            type="file"
                                            {...register("resume")}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </div>
                                    {errors.resume && <span className="text-red-500 text-[10px] mt-1">{errors.resume.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap mt-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <textarea
                                        {...register("message")}
                                        placeholder="Add additional information"
                                        className={`w-full p-1.5 text-[14px] border rounded-md h-[82px] resize-none bg-white ${
                                            errors.message ? "border-red-500" : "border-gray-300"
                                        }`}
                                    ></textarea>
                                    {errors.message && <span className="text-red-500 text-[10px] mt-1">{errors.message.message}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap mt-2">
                                    Captcha Code <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 sm:flex-wrap">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register("captcha")}
                                                placeholder="captcha code"
                                                className={`w-full p-1.5 text-[14px] border rounded-md bg-white ${
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
                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#17306E] text-white py-2 px-10 rounded-md font-medium hover:bg-[#1b387c] transition-colors text-[15px]"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export async function getStaticProps() {
    const res = await fetch(`${BASE_URL}/web/getNavbar`);
    const seoData = await res.json();

    const seoItem = seoData?.data?.find((item) => item?.name === "About Us")?.siteMenu?.find((sub) => sub?.url === "career") || {};

    return {
        props: {
            seoData: {
                seoTitle: seoItem?.seoTitle || "Kaiso Research",
                metaDescription: seoItem?.metaDescription || "Kaiso Research",
                ogTitle: seoItem?.seoTitle || "Kaiso Research",
                ogDescription: seoItem?.metaDescription || "Kaiso Research",
            },
        },
        // Removed revalidate for static export compatibility
    };
}

export default Career;
