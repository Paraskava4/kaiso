
"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

import AuthCommanForm from "@/components/shared/AuthCommanForm";
import { InputItem } from "@/components/shared/forms";
import CommonButton from "@/components/shared/CommonButton";
import { defaultVerifyCodeValues } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { compareCode } from "@/api/auth/compareCode";
import { sendForgotPasswordEmail } from "@/api/auth";

const VerifyCode = ({ email: propEmail }) => {
    // Add unhandled rejection prevention
    useEffect(() => {
        const handleUnhandledRejection = (event) => {
            // Prevent Next.js error panel for network-related errors
            if (
                event.reason?.response?.status === 404 ||
                event.reason?.code === "NETWORK_ERROR" ||
                event.reason?.message?.includes("Network Error") ||
                event.reason?.message?.includes("Failed to fetch")
            ) {
                event.preventDefault();
                console.error("Prevented unhandled promise rejection:", event.reason);
            }
        };

        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [email, setEmail] = useState("");

    const { redirect } = useRouteRedirect();

    // Get email from localStorage or props
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedEmail = localStorage.getItem("authEmail");
            if (storedEmail) {
                setEmail(storedEmail);
            } else if (propEmail) {
                setEmail(propEmail);
            } else {
                // If no email found, redirect back to forgot password
                toast.error("Session expired. Please try again.");
                redirect("auth/forgotpassword");
            }
        }
    }, [propEmail, redirect]);

    const form = useForm({
        defaultValues: defaultVerifyCodeValues,
        resolver: yupResolver(Validation.VERIFYCODE),
    });

    const { handleSubmit } = form;

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMsg("");

        const payload = { email, otp: data.otp };
        const response = await compareCode(payload);

        if (response?.error) {
            setErrorMsg(response.message);
            toast.error(response.message);
        } else {
            toast.success("Code verified successfully!");
            // Store OTP in localStorage for the next step
            localStorage.setItem("authOtp", data.otp);
            redirect("auth/setnewpassword");
        }

        setLoading(false);
    };

    const handleResendCode = async () => {
        if (!email) {
            toast.error("Email not found. Please try again from the beginning.");
            redirect("auth/forgotpassword");
            return;
        }

        const response = await sendForgotPasswordEmail(email);

        if (response?.error) {
            setErrorMsg(response.message);
            toast.error(response.message);
        } else {
            toast.success("A new verification code has been sent to your email.");
        }
    };

    return (
        <AuthCommanForm title={"Verify Code"} subTitle={`A verification code has been sent to ${email}. Please enter it below.`}>
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() => {
                        // Clear stored data when going back
                        localStorage.removeItem("authEmail");
                        localStorage.removeItem("authOtp");
                        redirect("auth/forgotpassword");
                    }}
                >
                    <ChevronLeft size={15} />
                    Back
                </button>
                <div className="w-full max-md:max-w-full mt-5">
                    <InputItem title="Verification Code" placeholder="Enter verification code" requiredDot={true} name="otp" form={form} />
                    {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
                    <p className="text-fs16 font-fw500 text-end mt-5 text-[#5AB1E0] cursor-pointer hover:underline" onClick={handleResendCode}>
                        Resend Code
                    </p>
                    <div className="mt-5">
                        <CommonButton type="submit" loading={loading}>
                            Continue
                        </CommonButton>
                    </div>
                    <p className="mt-5 text-center text-[#5A5D63] font-fw400 text-fs16 cursor-pointer">
                        Remember password{" "}
                        <span className="text-[#D62035] hover:underline" onClick={() => redirect("auth/login")}>
                            Login
                        </span>
                    </p>
                </div>
            </Box>
        </AuthCommanForm>
    );
};

export default VerifyCode;
