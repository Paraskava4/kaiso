"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Footer } from "@/components/layout";
import CountryFlagDropdown from "@/components/ui/CountryFlagDropdown";
import { toast, ToastBar, Toaster } from "react-hot-toast";
import { Check, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { countriesArray } from "@/data/countries";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import UniversalSEO from "@/utils/seo/universalSEO";
import { BASE_URL } from "../../../config";

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

export default function Contact_Us({ seoData }) {
    // Since Contact Us is a menu item under About Us page, we need to call it correctly
    // useNavbarSEO(pageName, menuName, subMenuName)
    // useNavbarSEO("About Us", "Contact Us");
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
    const messageRef = useRef(null);
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
            phoneCode: "+1",
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
        <>
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
                                    {isClient ? (
                                        <PhoneInput
                                            country={"us"}
                                            enableSearch={true}
                                            value={watch("phone")}
                                            onChange={(phone, countryData) => {
                                                setValue("phone", phone, { shouldValidate: true });
                                                setValue("phoneCode", `+${countryData.dialCode}`, { shouldValidate: false });
                                            }}
                                            containerClass={`flex-1 text-sm sm:text-base w-[100%] ${errors.phone ? "border-red-600" : ""}`}
                                            inputClass="w-full"
                                            inputProps={{
                                                onKeyDown: (e) => {
                                                    if (e.key === "Tab") {
                                                        e.preventDefault();
                                                        messageRef.current?.focus();
                                                    }
                                                },
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-[34px] border border-gray-300 rounded-md bg-gray-50 flex items-center px-3">
                                            <span className="text-gray-500 text-sm">Loading phone input...</span>
                                        </div>
                                    )}
                                    {errors.phone && <span className="text-red-500 text-[10px] mt-1">{errors.phone.message}</span>}
                                </div>
                            </div>
                            <div className="flex  flex-col sm:flex-row  items-start sm:items-center gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap mt-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1  w-full">
                                    {/* <textarea
                                        {...register("message")}
                                        placeholder="Add additional information"
                                        className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md h-[82px] resize-none bg-white ${
                                            errors.message ? "border-red-500" : "border-gray-300"
                                        }`}
                                    ></textarea> */}
                                     <Controller
                                        name="message"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <textarea
                                                {...field}
                                                ref={messageRef}
                                                placeholder="Add additional information"
                                                className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md h-[82px] resize-none bg-white ${
                                                    fieldState.error ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        )}
                                    />
                                    {errors.message && <span className="text-red-500 text-[10px] mt-1">{errors.message.message}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-10">
                                <label className="w-32 text-[15px] font-medium text-gray-600 whitespace-nowrap mt-2">
                                    Captcha Code <span className="text-red-500">*</span>
                                </label>

                                <div className="flex-1 w-full">
                                    {/* <label className="block w-32 text-[15px] font-medium text-gray-600 mb-1">Verification Code</label> */}
                                    <div className="flex items-center gap-3 sm:flex-wrap">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register("captcha")}
                                                placeholder="captcha code"
                                                className={`w-full p-1.5 sm:p-1.5 text-[14px] border rounded-md bg-white ${
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
                                    {/* <p className="text-xs text-black mt-1">Please enter the above code into the input box</p> */}
                                    {errors.captcha && <span className="text-red-500 text-[10px] mt-1">{errors.captcha.message}</span>}
                                </div>
                            </div>

                            <div className="text-center pt-2 sm:pt-3 md:pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#17306E] text-white py-2 px-6 sm:px-8 md:px-12 rounded-md font-medium hover:bg-[#1b387c] transition-colors text-[15px] "
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 🌍 Office Locations Section */}
                <div className="w-[83%] mx-auto px-4 pt-10">
                    <h2 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-semibold text-center mb-4 text-gray-800">
                        Our Business Locations
                    </h2>
                    <div className="grid grid-cols-1 mb-10 mt-10 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Asia-Pacific */}
                        <div className="border border-gray-200 p-6 bg-white hover:shadow-xl">
                            <div className="flex items-left gap-2 ">
                                <Image src="/icons/country1.png" alt="Asia-Pacific" width={0} height={0} className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-black">Asia-Pacific</h3>
                            </div>
                            <div className="w-[10%] bg-[#e42e4a]  my-2 h-[2px]"></div>
                            <div className="text-[15px] text-black leading-6">
                                <div className="text-left">
                                    <strong>India</strong>
                                </div>
                                <br />
                                Office No. 303, Atulya IT Park,
                                <br />
                                Indrapuri, Bhanwar Kuwa,
                                <br />
                                Indore, Madhya Pradesh 452014
                                <br />
                                <strong>Telephone:</strong> +1 872 219 0417
                                <br />
                                <strong>Email:</strong> help@kaisoresearch.com
                            </div>
                        </div>

                        {/* Americas */}
                        <div className="border border-gray-200 p-6 bg-white hover:shadow-xl">
                            <div className="flex items-left gap-2 ">
                                <Image src="/icons/country2.png" alt="Americas" width={0} height={0} className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-black">Americas</h3>
                            </div>
                            <div className="w-[10%] bg-[#e42e4a]  my-2  h-[2px]"></div>

                            <div className="text-[15px] text-black leading-6">
                                <div className="text-left">
                                    <strong>United States</strong>
                                </div>
                                <br />
                                Office 205 N Michigan Ave,
                                <br />
                                Chicago, Illinois 60601, USA
                                <br />
                                <strong>Telephone:</strong> +1 872 219 0417
                                <br />
                                <strong>Email:</strong> help@kaisoresearch.com
                            </div>
                        </div>

                        {/* Europe */}
                        <div className="border border-gray-200 p-6 bg-white hover:shadow-xl">
                            <div className="flex items-left gap-2 mb-0">
                                <Image src="/icons/country3.png" alt="Europe" width={0} height={0} className="w-5 h-5" />
                                <h3 className="text-lg font-semibold text-black">Europe</h3>
                            </div>
                            <div className="w-[10%] bg-[#e42e4a] h-[2px] my-2"></div>

                            <div className="text-[15px] text-black leading-6">
                                <div className="text-left">
                                    <strong>United Kingdom</strong>
                                </div>
                                <br />
                                713 The Lock Tower, Manchester
                                <br />
                                M1 5BD, United Kingdom
                                <br />
                                <strong>Telephone:</strong> +1 872 219 0417
                                <br />
                                <strong>Email:</strong> help@kaisoresearch.com
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}
