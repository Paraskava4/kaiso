
"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ChevronLeft } from "lucide-react";

import AuthCommanForm from "@/components/shared/AuthCommanForm";
import CommonButton from "@/components/shared/CommonButton";
import { InputItem } from "@/components/shared/forms";
import { Validation } from "@/utils/constants/api/validation";
import { resetPassword } from "@/api/auth";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const SetNewPassWord_Page = ({ email: propEmail, otp: propOtp }) => {
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

    const [errorMsg, setErrorMsg] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const { redirect } = useRouteRedirect();

    // Get email and OTP from localStorage or props
    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedEmail = localStorage.getItem("authEmail");
            const storedOtp = localStorage.getItem("authOtp");

            if (storedEmail) {
                setEmail(storedEmail);
            } else if (propEmail) {
                setEmail(propEmail);
            }

            if (storedOtp) {
                setOtp(storedOtp);
            } else if (propOtp) {
                setOtp(propOtp);
            }

            // If no email or OTP found, redirect back to forgot password
            if (!storedEmail && !propEmail) {
                toast.error("Session expired. Please try again.");
                redirect("auth/forgotpassword");
            }

            if (!storedOtp && !propOtp) {
                toast.error("Verification required. Please verify your code first.");
                redirect("auth/verify_code");
            }
        }
    }, [propEmail, propOtp, redirect]);

    const form = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(Validation.RESET_PASSWORD),
    });

    const { handleSubmit } = form;

    const onSubmit = async (data) => {
        setErrorMsg("");

        const response = await resetPassword({
            email,
            password: data.password,
            otp,
        });

        if (response?.error) {
            setErrorMsg(response.message);
            toast.error(response.message);
        } else {
            toast.success("Password reset successful!");
            // Clean up localStorage after successful password reset
            localStorage.removeItem("authEmail");
            localStorage.removeItem("authOtp");
            redirect("auth/login");
        }
    };

    return (
        <AuthCommanForm title={"Set a new password"} subTitle="">
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <button type="button" className="flex items-center gap-2" onClick={() => redirect("auth/verify_code")}>
                    <ChevronLeft size={15} />
                    Back
                </button>
                <div className="w-full max-md:max-w-full mt-5">
                    {errorMsg && <div className="text-red-600 mb-2 text-sm">{errorMsg}</div>}
                    <div className="mt-5">
                        <InputItem title="Password" type="password" placeholder="Enter new password" requiredDot={true} name="password" form={form} />
                    </div>
                    <div className="mt-5">
                        <InputItem
                            title="Confirm Password"
                            type="password"
                            placeholder="Confirm new password"
                            requiredDot={true}
                            name="confirmPassword"
                            form={form}
                        />
                    </div>
                    <div className="mt-5">
                        <CommonButton type="submit">set new password</CommonButton>
                    </div>
                </div>
            </Box>
        </AuthCommanForm>
    );
};

export default SetNewPassWord_Page;
