"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { X, Check, ChevronDown } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { BASE_URL } from "../../../../config";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { countriesArray } from "@/data/countries";

// Generate random 4-digit captcha
const generateCaptcha = () => Math.floor(1000 + Math.random() * 9000).toString();

// Validation schema
const createValidationSchema = (captchaCode) =>
    Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        companyName: Yup.string().required("Company Name is required"),
        businessEmail: Yup.string().required("Business Email is required"),
        jobRole: Yup.string().required("Job Role is required"),
        phoneInput: Yup.string()
            .required("Contact number is required")
            .test("min-digits", "Phone Number must be at least 10 digits", (value) => {
                if (!value) return false;
                const digits = (value.match(/\d/g) || []).length;
                return digits >= 10;
            }),
        message: Yup.string().required("Message is required"),
        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", (value) => value === captchaCode),
    });

const OtherInquiryForm = ({
    title = "Submit Inquiry",
    type = "Other",
    isOpen,
    onClose,
    buttonText = "Submit Inquiry",
    successMessage = "Inquiry submitted successfully!",
    pageName = "",
    isExpandedView = false,
    onSuccess,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCaptchaCode(generateCaptcha());
    }, []);

    const validationSchema = useMemo(() => createValidationSchema(captchaCode || "0000"), [captchaCode]);

    const form = useForm({
        defaultValues: {
            firstName: "",
            companyName: "",
            businessEmail: "",
            countryCode: "+1",
            phoneNumber: "",
            phoneInput: "+1",
            jobRole: "",
            message: "",
            captcha: "",
            pageName: pageName,
        },
        resolver: yupResolver(validationSchema),
        mode: "onTouched",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
        watch,
    } = form;

    // Update form's pageName field when pageName prop changes
    useEffect(() => {
        if (pageName) {
            setValue("pageName", pageName);
        }
    }, [pageName, setValue]);

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        reset((prev) => ({ ...prev, captcha: "" }));
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        // derive country code and national number from phoneInput at submit time
        const rawPhone = (data.phoneInput || "").trim();
        let derivedCountryCode = "+1";
        let derivedNationalNumber = "";
        const match = rawPhone.match(/^\+(\d{1,4})\s*(.*)$/);
        if (match) {
            derivedCountryCode = `+${match[1]}`;
            derivedNationalNumber = (match[2] || "").replace(/\D/g, "");
        } else {
            // fallback: no plus detected, treat all digits as national number
            derivedNationalNumber = rawPhone.replace(/\D/g, "");
        }
        const payload = {
            reportId: "",
            type,
            firstName: data.firstName,
            companyName: data.companyName,
            contactCode: derivedCountryCode,
            businessEmail: data.businessEmail,
            contactNo: derivedNationalNumber,
            jobRole: data.jobRole,
            message: data.message,
            planType: "",
            pageName: data.pageName,
        };

        try {
            const res = await fetch(`${BASE_URL}/inquiry/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (res.ok) {
                toast.success(result?.message || successMessage, {
                    duration: 3000,
                    style: { background: "#4ade80", color: "#fff" },
                    icon: <Check />,
                });
                reset();
                handleRefreshCaptcha();
                if (onSuccess) onSuccess();
                else onClose();
            } else {
                toast.error(result?.message || "Something went wrong!", {
                    duration: 5000,
                    style: { background: "#ef4444", color: "#fff" },
                    icon: <X />,
                });
            }

            return;
        } catch (err) {
            toast.error("Network error. Try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const content = (
        <>
            <h3 className="mb-5 text-lg font-normal text-black text-center color-black " style={{ marginTop: "-5%" }}>
                {title}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
                {/* First Name */}
                <div className="space-y-3">
                    {/* Full Name */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Full Name <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                {...register("firstName")}
                                placeholder="Enter your full name"
                                className={`w-full text-[14px] px-4 py-2 border ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.firstName && <span className="text-red-500 text-[13px] mt-1">{errors.firstName.message}</span>}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Company Name <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                {...register("companyName")}
                                placeholder="Enter your company name"
                                className={`w-full text-[14px] px-4 py-2 border ${
                                    errors.companyName ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.companyName && <span className="text-red-500 text-[13px] mt-1">{errors.companyName.message}</span>}
                        </div>
                    </div>

                    {/* Business Email ID */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Business Email ID <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <input
                                type="businessEmail"
                                {...register("businessEmail")}
                                placeholder="Enter your business Email ID"
                                className={`w-full text-[14px] px-4 py-2 border ${
                                    errors.businessEmail ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.businessEmail && <span className="text-red-500 text-[13px] mt-1">{errors.businessEmail.message}</span>}
                        </div>
                    </div>

                    {/* Job Role */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Job Role <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                {...register("jobRole")}
                                placeholder="Enter your job role"
                                className={`w-full px-4 text-[14px] py-2 border ${
                                    errors.jobRole ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.jobRole && <span className="text-red-500 text-[13px] mt-1">{errors.jobRole.message}</span>}
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Contact Number <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            {isClient ? (
                                <PhoneInput
                                    country={"us"}
                                    enableSearch={true}
                                    value={watch("phoneInput")}
                                    onChange={(value, country) => {
                                        setValue("phoneInput", value, { shouldValidate: true });
                                        const phoneOnly = value.slice(country.dialCode.length);
                                        setValue("phoneNumber", phoneOnly, { shouldValidate: true });
                                        setValue("countryCode", `+${country.dialCode}`, { shouldValidate: true });
                                    }}
                                    containerClass={`flex-1 text-sm sm:text-base w-[100%] `}
                                    inputClass="w-full"
                                />
                            ) : (
                                <div className="w-full h-[40px] border border-gray-300 rounded-md bg-gray-50 flex items-center px-3">
                                    <span className="text-gray-500 text-sm">Loading phone input...</span>
                                </div>
                            )}
                            {errors.phoneInput && <span className="text-red-500 text-[13px] mt-1">{errors.phoneInput.message}</span>}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Message <span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <textarea
                                {...register("message")}
                                placeholder="Your Message"
                                className={`w-full px-4 text-[14px] py-2 border ${
                                    errors.message ? "border-red-500" : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none h-[82px]`}
                            />
                            {errors.message && <span className="text-red-500 text-[13px] mt-1">{errors.message.message}</span>}
                        </div>
                    </div>

                    {/* Captcha */}
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label className="w-full md:w-1/4 text-[15px] font-medium text-gray-700">
                            Verification code<span className="text-orange-600">*</span>
                        </label>
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 w-full">
                                <input
                                    type="text"
                                    {...register("captcha")}
                                    placeholder="Enter captcha"
                                    className={`w-full sm:w-auto flex-grow px-4 text-[14px] py-2 border ${
                                        errors.captcha ? "border-red-500" : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    autoComplete="off"
                                />
                                <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md px-4 py-2 min-w-[80px] h-[35px]">
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
                                    <svg className="w-7 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {errors.captcha && <span className="text-red-500 text-[13px] mt-1">{errors.captcha.message}</span>}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-center gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white bg-[#17306E] hover:bg-[#1b387c] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center justify-center px-6 py-2 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <CircularProgress size={16} sx={{ color: "white", marginRight: "8px" }} />}
                        Submit
                    </button>
                </div>
            </form>
        </>
    );

    if (isExpandedView) return content;

    return (
        <div className="flex mt-20 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full backdrop-blur-sm bg-white/30">
            <div className="relative p-4 w-full max-w-[800px]">
                <div className="bg-white rounded-lg shadow-sm">
                    <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-900" onClick={onClose}>
                        ✕
                    </button>
                    <div className="p-4">{content}</div>
                </div>
            </div>
        </div>
    );
};

export default OtherInquiryForm;
