"use client";

import React, { forwardRef, useImperativeHandle, useEffect, useState, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { countries, countriesArray } from "@/data/countries";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { ChevronDown } from "lucide-react";

export const STYLES = {
    fieldContainer: "flex flex-col gap-2 flex-1 max-md:w-full",
    labelContainer: "flex items-start w-full",
    label: "text-base text-zinc-900 max-sm:text-sm",
    required: "text-base text-orange-600 max-sm:text-sm",
    input: "w-full px-5 py-3  rounded-md border-[0.5px] border-zinc-700/30 text-base text-zinc-600 max-sm:px-4 max-sm:py-2.5 max-sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
    select: "appearance-none w-full pr-12",
};

// Generate random 4-digit captcha
const generateCaptcha = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const createSchema = (captchaCode) =>
    Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        // lastName: Yup.string().required("Last Name is required"),
        businessMail: Yup.string().required("Business Mail is required").email("Enter a valid email address"),
        companyName: Yup.string().required("Company Name is required"),
        jobRole: Yup.string().required("Job Role is required"),
        companyAddress: Yup.string().required("Company Address is required"),
        companyAddress2: Yup.string(),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
        zipCode: Yup.string().required("Zip code is required"),
        contactNo: Yup.string().required("Contact Number is required"),
        contactCode: Yup.string().required("Contact Code is required"),

        captcha: Yup.string()
            .required("Captcha code is required")
            .test("captcha-match", "Please enter the correct captcha code", function (value) {
                return value === captchaCode;
            }),
    });

const BillingDetailsForm = forwardRef((props, ref) => {
    const { initialValues = {}, onCountryChange } = props;

    // Captcha state - initialize as null to prevent hydration mismatch
    const [captchaCode, setCaptchaCode] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const inputRefs = useRef({});

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
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched",
        defaultValues: {
            firstName: initialValues.fullName ? initialValues.fullName.split(" ")[0] || "" : "",
            // lastName: initialValues.fullName ? initialValues.fullName.split(" ").slice(1).join(" ") || "" : "",
            businessMail: initialValues.email || "",
            companyName: initialValues.company || "",
            jobRole: initialValues.jobRole || "",
            companyAddress: initialValues.address ? initialValues.address.split(",")[0] : "",
            // companyAddress2: initialValues.address ? (initialValues.address.split(",")[1] || "").trim() : "",
            city: initialValues.address ? (initialValues.address.split(",")[2] || "").trim() : "",
            state: initialValues.address ? (initialValues.address.split(",")[3] || "").trim() : "",
            country: initialValues.address ? (initialValues.address.split(",")[3] || "").trim() : "us",
            zipCode: initialValues.address ? (initialValues.address.split("Pincode-")[1] || "").trim() : "",
            contactNo: initialValues.contactNo || "",
            contactCode: "+1", // Default to USA phone code
            captcha: "",
        },
    });

    const handleCountrySelect = (country) => {
        setValue("country", country.code, { shouldValidate: true });
        setValue("contactCode", country.phoneCode, { shouldValidate: true });
    };

    const handleRefreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptchaCode(newCaptcha);
        setValue("captcha", "", { shouldValidate: false });
    };

    const countryValue = watch("country");

    useEffect(() => {
        if (countryValue && onCountryChange) {
            onCountryChange(countryValue);
        }
    }, [countryValue, onCountryChange]);

    // Update form resolver when captcha code changes
    useEffect(() => {
        if (captchaCode && isClient) {
            // Re-trigger validation for captcha field if it has a value
            const currentCaptchaValue = getValues("captcha");
            if (currentCaptchaValue) {
                trigger("captcha");
            }
        }
    }, [captchaCode, isClient, trigger, getValues]);

    // useImperativeHandle(
    //     ref,
    //     () => ({
    //         async validateAndGetData() {
    //             const valid = await trigger();
    //             if (!valid) return { valid: false, data: null, errors };
    //             return { valid: true, data: getValues(), errors: null };
    //         },
    //     }),
    //     [trigger, getValues, errors]
    // );
    useImperativeHandle(
        ref,
        () => ({
            async validateAndGetData() {
                const valid = await trigger();
                if (!valid) {
                    const firstErrorField = Object.keys(errors)[0];
                    const element = inputRefs.current[firstErrorField];
                    if (element && element.scrollIntoView) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        element.focus();
                    }
                    return { valid: false, data: null, errors };
                }
                return { valid: true, data: getValues(), errors: null };
            },
        }),
        [trigger, getValues, errors]
    );

    return (
        // <form
        //     className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 lg:p-6 w-full bg-white border border-zinc-300 rounded-lg shadow-sm"
        //     role="form"
        //     aria-labelledby="billing-details-title"
        //     autoComplete="off"
        //     onSubmit={(e) => e.preventDefault()}
        // >
        //     <header>
        //         <h1 id="billing-details-title" className="text-lg sm:text-xl font-medium text-zinc-900">
        //             Billing Details
        //         </h1>
        //     </header>

        //     {/* <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"> */}
        //         <legend className="sr-only">Personal Information</legend>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="firstName" className={STYLES.label}>
        //                 Full Name <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="firstName"
        //                 {...register("firstName")}
        //                 placeholder="Enter full name"
        //                 className={`${STYLES.input} ${errors.firstName ? "border-red-600" : ""}`}
        //             />
        //             {errors.firstName && <span className="text-red-600 text-sm">{errors.firstName.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="businessMail" className={STYLES.label}>
        //                 Business Mail <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="email"
        //                 id="businessMail"
        //                 {...register("businessMail")}
        //                 placeholder="Enter Business Mail"
        //                 className={`${STYLES.input} ${errors.businessMail ? "border-red-600" : ""}`}
        //             />
        //             {errors.businessMail && <span className="text-red-600 text-sm">{errors.businessMail.message}</span>}
        //         </div>
        //         {/* <div className={STYLES.fieldContainer}>
        //             <label htmlFor="lastName" className={STYLES.label}>
        //                 Last Name <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="lastName"
        //                 {...register("lastName")}
        //                 placeholder="Enter last name"
        //                 className={`${STYLES.input} ${errors.lastName ? "border-red-600" : ""}`}
        //             />
        //             {errors.lastName && <span className="text-red-600 text-sm">{errors.lastName.message}</span>}
        //         </div> */}
        //     {/* </fieldset> */}

        //     {/* <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"> */}
        //         <div className={STYLES.fieldContainer}>
        //             <div className={STYLES.fieldContainer}>
        //                 <label htmlFor="country" className={STYLES.label}>
        //                     Contact Number <span className={STYLES.required}>*</span>
        //                 </label>

        //                 <div className="flex gap-4 items-start">
        //                     <CountryFlagDropdown
        //                         selectedCountry={countries.find(c => c.code === countryValue) || countries.find(c => c.code === "us")}
        //                         onCountrySelect={handleCountrySelect}
        //                     />

        //                     <input
        //                         type="tel"
        //                         id="contactNo"
        //                         {...register("contactNo")}
        //                         placeholder="Enter contact number"
        //                         className={`${STYLES.input} ${errors.contactNo ? "border-red-600" : ""}`}
        //                     />
        //                 </div>

        //                 {errors.country && <span className="text-red-600 text-sm">{errors.country.message}</span>}

        //                 {/* {countryValue && (
        //                     // <div className="text-sm text-zinc-600 mt-1">
        //                     //     Selected Country:{" "}
        //                     //     <span className="font-medium">
        //                     //         {countries.find(opt => opt.code === countryValue)?.name || countryValue}
        //                     //     </span>
        //                     // </div>
        //                 )} */}
        //             </div>
        //             {errors.contactNo && <span className="text-red-600 text-sm">{errors.contactNo.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="companyName" className={STYLES.label}>
        //                 Company Name <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="companyName"
        //                 {...register("companyName")}
        //                 placeholder="Enter company name"
        //                 className={`${STYLES.input} ${errors.companyName ? "border-red-600" : ""}`}
        //             />
        //             {errors.companyName && <span className="text-red-600 text-sm">{errors.companyName.message}</span>}
        //         </div>
        //     {/* </fieldset> */}

        //     {/* <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"> */}
        //         <legend className="sr-only">Company Information</legend>

        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="jobRole" className={STYLES.label}>
        //                 Job Role <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="jobRole"
        //                 {...register("jobRole")}
        //                 placeholder="Enter Job Role"
        //                 className={`${STYLES.input} ${errors.jobRole ? "border-red-600" : ""}`}
        //             />
        //             {errors.jobRole && <span className="text-red-600 text-sm">{errors.jobRole.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="companyAddress" className={STYLES.label}>
        //                 Company Address <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="companyAddress"
        //                 {...register("companyAddress")}
        //                 placeholder="Enter Address"
        //                 className={`${STYLES.input} ${errors.companyAddress ? "border-red-600" : ""}`}
        //             />
        //             {errors.companyAddress && <span className="text-red-600 text-sm">{errors.companyAddress.message}</span>}
        //         </div>
        //     {/* </fieldset> */}

        //     {/* <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        //         <legend className="sr-only">Address Information</legend>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="companyAddress2" className={STYLES.label}>
        //                 Address Line 2
        //             </label>
        //             <input type="text" id="companyAddress2" {...register("companyAddress2")} placeholder="Enter Address (optional)" className={STYLES.input} />
        //         </div>
        //     </fieldset> */}

        //     <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        //         <legend className="sr-only">Location Information</legend>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="city" className={STYLES.label}>
        //                 City <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="city"
        //                 {...register("city")}
        //                 placeholder="Enter City name"
        //                 className={`${STYLES.input} ${errors.city ? "border-red-600" : ""}`}
        //             />
        //             {errors.city && <span className="text-red-600 text-sm">{errors.city.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="state" className={STYLES.label}>
        //                 State <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="state"
        //                 {...register("state")}
        //                 placeholder="Enter your state"
        //                 className={`${STYLES.input} ${errors.state ? "border-red-600" : ""}`}
        //             />
        //             {errors.state && <span className="text-red-600 text-sm">{errors.state.message}</span>}
        //         </div>
        //     </fieldset>

        //     {/* <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"> */}
        //         <legend className="sr-only">Country and Postal Information</legend>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="country" className={STYLES.label}>
        //                 Country <span className={STYLES.required}>*</span>
        //             </label>
        //             <div className="relative w-full">
        //                 <select id="country" {...register("country")} className={`${STYLES.input} ${STYLES.select} ${errors.country ? "border-red-600" : ""}`}>
        //                     <option value="" disabled>
        //                         Choose your country
        //                     </option>
        //                     {countries.map(({ code, name }) => (
        //                         <option key={code} value={code}>
        //                             {name}
        //                         </option>
        //                     ))}
        //                 </select>
        //                 <Image
        //                     src="/icons/DropDown-Icon.webp"
        //                     alt="Dropdown icon"
        //                     className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 max-sm:right-4 pointer-events-none"
        //                     width={100}
        //                     height={100}
        //                     quality={100}
        //                 />
        //             </div>
        //             {errors.country && <span className="text-red-600 text-sm">{errors.country.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="zipCode" className={STYLES.label}>
        //                 Zip code <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="zipCode"
        //                 {...register("zipCode")}
        //                 placeholder="Enter your Zip code"
        //                 className={`${STYLES.input} ${errors.zipCode ? "border-red-600" : ""}`}
        //             />
        //             {errors.zipCode && <span className="text-red-600 text-sm">{errors.zipCode.message}</span>}
        //         </div>
        //     {/* </fieldset> */}

        //     {/* Captcha Section */}
        //     <fieldset className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        //         <legend className="sr-only">Security Verification</legend>
        //         <div className={STYLES.fieldContainer}>
        //             <label htmlFor="captcha" className={STYLES.label}>
        //                 Captcha Code <span className={STYLES.required}>*</span>
        //             </label>
        //             <input
        //                 type="text"
        //                 id="captcha"
        //                 {...register("captcha")}
        //                 placeholder="Enter the code shown"
        //                 className={`${STYLES.input} ${errors.captcha ? "border-red-600" : ""}`}
        //                 autoComplete="off"
        //             />
        //             {errors.captcha && <span className="text-red-600 text-sm">{errors.captcha.message}</span>}
        //         </div>
        //         <div className={STYLES.fieldContainer}>
        //             <label className={STYLES.label}>Verification Code</label>
        //             <div className="flex items-center gap-3">
        //                 <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md px-4 py-3 min-w-[100px] h-[50px]">
        //                     {isClient && captchaCode ? (
        //                         <span className="text-xl font-bold text-gray-800 tracking-wider select-none">{captchaCode}</span>
        //                     ) : (
        //                         <span className="text-xl font-bold text-gray-400 tracking-wider select-none">----</span>
        //                     )}
        //                 </div>
        //                 <button
        //                     type="button"
        //                     onClick={handleRefreshCaptcha}
        //                     disabled={!isClient}
        //                     className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
        //                     title="Refresh captcha"
        //                     aria-label="Refresh captcha code"
        //                 >
        //                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //                         <path
        //                             strokeLinecap="round"
        //                             strokeLinejoin="round"
        //                             strokeWidth={2}
        //                             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        //                         />
        //                     </svg>
        //                 </button>
        //             </div>
        //             <p className="text-sm text-gray-600 mt-1">Please enter the above code into the input box</p>
        //         </div>
        //     </fieldset>
        // </form>
        <form
            className="flex flex-col gap-3 p-3 sm:p-4 lg:p-5 w-full bg-white border border-zinc-300 rounded-lg shadow-sm "
            role="form"
            aria-labelledby="billing-details-title"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
        >
            <header>
                <h1 id="billing-details-title" className="text-sm sm:text-base font-medium text-zinc-900">
                    Billing Details
                </h1>
            </header>

            <legend className="sr-only">Personal Information</legend>
            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="firstName" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Full Name <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="firstName"
                        {...register("firstName")}
                        ref={(e) => {
                            register("firstName").ref(e);
                            inputRefs.current.firstName = e;
                        }}
                        placeholder="Enter full name"
                        className={`${STYLES.input} h-8 text-xs ${errors.firstName ? "border-red-600" : ""}`}
                    />
                    {errors.firstName && <span className="text-red-600 text-xs">{errors.firstName.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="businessMail" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Business Mail <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="email"
                        id="businessMail"
                        {...register("businessMail")}
                        ref={(e) => {
                            register("businessMail").ref(e);
                            inputRefs.current.businessMail = e;
                        }}
                        placeholder="Enter Business Mail"
                        className={`${STYLES.input} h-8 text-xs ${errors.businessMail ? "border-red-600" : ""}`}
                    />
                    {errors.businessMail && <span className="text-red-600 text-xs">{errors.businessMail.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="contactNo" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Contact Number <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <div className="flex items-center gap-4">
                        {/* <label className="w-1/4 text-[16px] font-medium text-gray-700">
                            Contact Number <span className="text-orange-600">*</span>
                        </label> */}
                        <div className="flex-1">
                            {isClient ? (
                                <PhoneInput
                                    country={"us"}
                                    enableSearch={true}
                                    value={`${watch("contactCode").slice(1)}${watch("contactNo")}`}
                                    onChange={(value, country) => {
                                        const phoneOnly = value.slice(country.dialCode.length);
                                        setValue("contactNo", phoneOnly, { shouldValidate: true });
                                        setValue("contactCode", `+${country.dialCode}`, { shouldValidate: true });
                                        const selectedCountry = countries.find((c) => c.phoneCode.replace(/\s/g, "") === `+${country.dialCode}`);
                                        if (selectedCountry) {
                                            setValue("country", selectedCountry.code, { shouldValidate: true });
                                        }
                                    }}
                                    containerClass={`flex-1 text-sm sm:text-base w-[100%] `}
                                    inputClass="w-full"
                                />
                            ) : (
                                <div className="w-full h-[34px] border border-gray-300 rounded-md bg-gray-50 flex items-center px-3">
                                    <span className="text-gray-500 text-sm">Loading phone input...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {errors.contactNo && <span className="text-red-600 text-xs">{errors.contactNo.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="companyName" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Company Name <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="companyName"
                        {...register("companyName")}
                        ref={(e) => {
                            register("companyName").ref(e);
                            inputRefs.current.companyName = e;
                        }}
                        placeholder="Enter company name"
                        className={`${STYLES.input} h-8 text-xs ${errors.companyName ? "border-red-600" : ""}`}
                    />
                    {errors.companyName && <span className="text-red-600 text-xs">{errors.companyName.message}</span>}
                </div>
            </div>

            <legend className="sr-only">Company Information</legend>
            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="jobRole" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Job Role <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="jobRole"
                        {...register("jobRole")}
                        ref={(e) => {
                            register("jobRole").ref(e);
                            inputRefs.current.jobRole = e;
                        }}
                        placeholder="Enter Job Role"
                        className={`${STYLES.input} h-8 text-xs ${errors.jobRole ? "border-red-600" : ""}`}
                    />
                    {errors.jobRole && <span className="text-red-600 text-xs">{errors.jobRole.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="companyAddress" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Company Address <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="companyAddress"
                        {...register("companyAddress")}
                        ref={(e) => {
                            register("companyAddress").ref(e);
                            inputRefs.current.companyAddress = e;
                        }}
                        placeholder="Enter Address"
                        className={`${STYLES.input} h-8 text-xs ${errors.companyAddress ? "border-red-600" : ""}`}
                    />
                    {errors.companyAddress && <span className="text-red-600 text-xs">{errors.companyAddress.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="companyAddress" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    City <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="city"
                        {...register("city")}
                        ref={(e) => {
                            register("city").ref(e);
                            inputRefs.current.city = e;
                        }}
                        placeholder="Enter City name"
                        className={`${STYLES.input} h-8 text-xs ${errors.city ? "border-red-600" : ""}`}
                    />
                    {errors.city && <span className="text-red-600 text-xs">{errors.city.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="companyAddress" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    State <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1 ">
                    <input
                        type="text"
                        id="state"
                        {...register("state")}
                        ref={(e) => {
                            register("state").ref(e);
                            inputRefs.current.state = e;
                        }}
                        placeholder="Enter your state"
                        className={`${STYLES.input} h-8 text-xs ${errors.state ? "border-red-600" : ""}`}
                    />
                    {errors.state && <span className="text-red-600 text-xs">{errors.state.message}</span>}
                </div>
            </div>
            {/* 
            <fieldset className="flex flex-col gap-3 w-full">
                <legend className="sr-only">Location Information</legend>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                    <div className="flex">
                        <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                            <label htmlFor="city" className={`${STYLES.label} w-full sm:w-1/4 text-sm`}>
                                City <span className={STYLES.required}>*</span>
                            </label>
                            <div className="w-full sm:flex-1 ms-5">
                                <input
                                    type="text"
                                    id="city"
                                    {...register("city")}
                                    ref={(e) => {
                                        register("city").ref(e);
                                        inputRefs.current.city = e;
                                    }}
                                    placeholder="Enter City name"
                                    className={`${STYLES.input} h-8 text-xs ${errors.city ? "border-red-600" : ""}`}
                                />
                                {errors.city && <span className="text-red-600 text-xs">{errors.city.message}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                            <label htmlFor="state" className={`${STYLES.label} w-full ms-5 sm:w-1/3 text-sm`}>
                                State <span className={STYLES.required}>*</span>
                            </label>
                            <div className="w-full sm:flex-1 ms-5">
                                <input
                                    type="text"
                                    id="state"
                                    {...register("state")}
                                    ref={(e) => {
                                        register("state").ref(e);
                                        inputRefs.current.state = e;
                                    }}
                                    placeholder="Enter your state"
                                    className={`${STYLES.input} h-8 text-xs ${errors.state ? "border-red-600" : ""}`}
                                />
                                {errors.state && <span className="text-red-600 text-xs">{errors.state.message}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset> */}

            <legend className="sr-only">Country and Postal Information</legend>
            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="country" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Country <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1 relative">
                    <select
                        id="country"
                        {...register("country", { required: "Please select a country" })}
                        className={`${STYLES.input} ${STYLES.select} h-10 text-xs ${errors.country ? "border-red-600" : ""}`}
                    >
                        <option value="" disabled>
                            Choose your country
                        </option>
                        {countries.map(({ code, name }) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <Image
                        src="/icons/DropDown-Icon.webp"
                        alt="Dropdown icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 max-sm:right-3 pointer-events-none"
                        width={80}
                        height={80}
                        quality={100}
                    />
                    {errors.country && <span className="text-red-600 text-xs">{errors.country.message}</span>}
                </div>
            </div>

            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="zipCode" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Zip code <span className={STYLES.required}>*</span>
                </label>
                <div className="w-full sm:flex-1">
                    <input
                        type="text"
                        id="zipCode"
                        {...register("zipCode")}
                        ref={(e) => {
                            register("zipCode").ref(e);
                            inputRefs.current.zipCode = e;
                        }}
                        placeholder="Enter your Zip code"
                        className={`${STYLES.input} h-8 text-xs ${errors.zipCode ? "border-red-600" : ""}`}
                    />
                    {errors.zipCode && <span className="text-red-600 text-xs">{errors.zipCode.message}</span>}
                </div>
            </div>

            {/* <fieldset className="flex flex-col gap-3 w-full"> */}
            <legend className="sr-only">Security Verification</legend>
            <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                <label htmlFor="captcha" className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>
                    Captcha Code <span className={STYLES.required}>*</span>
                </label>

                <div className={`${STYLES.fieldContainer} flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
                    {/* <label className={`${STYLES.label} w-full sm:w-1/3 text-sm`}>Verification Code</label> */}

                    <div className="w-full sm:flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <input
                                type="text"
                                id="captcha"
                                {...register("captcha")}
                                ref={(e) => {
                                    register("captcha").ref(e);
                                    inputRefs.current.captcha = e;
                                }}
                                placeholder="Enter captcha"
                                className={`${STYLES.input} h-8 text-xs ${errors.captcha ? "border-red-600" : ""}`}
                                autoComplete="off"
                            />
                            <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded-md px-2 py-2 min-w-[70px] h-8">
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
                                className="flex items-center justify-center w-12 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
                                title="Refresh captcha"
                                aria-label="Refresh captcha code"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
            </div>
            <div className="ms-[36%]"> {errors.captcha && <div className="text-red-600 text-xs">{errors.captcha.message}</div>}</div>
            <p className="text-xs text-black ms-[36%]">Please enter the above code into the input box</p>
            {/* </fieldset> */}
        </form>
    );
});

export default BillingDetailsForm;
