"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthCommanForm from "@/components/shared/AuthCommanForm";
import { InputItem } from "@/components/shared/forms";
import { defaultForgotPasswordValues } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { sendForgotPasswordEmail } from "@/api/auth";
import CommonButton from "@/components/shared/CommonButton";

const ForgotPassword = () => {
    // Add unhandled rejection prevention
    React.useEffect(() => {
        const handleUnhandledRejection = (event) => {
            // Prevent Next.js error panel for network-related errors
            if (event.reason?.response?.status === 404 ||
                event.reason?.code === 'NETWORK_ERROR' ||
                event.reason?.message?.includes('Network Error') ||
                event.reason?.message?.includes('Failed to fetch')) {
                event.preventDefault();
                console.error('Prevented unhandled promise rejection:', event.reason);
            }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { redirect } = useRouteRedirect();

    const form = useForm({
        defaultValues: defaultForgotPasswordValues,
        resolver: yupResolver(Validation.FORGOTPASSWORD),
    });

    const { handleSubmit } = form;

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMsg("");
        
        const res = await sendForgotPasswordEmail(data.email);
        
        if (res?.error) {
            setErrorMsg(res.message);
            toast.error(res.message);
        } else if (res) {
            toast.success("Verification code sent to your email.");
            console.log("Verification code sent to your email.");
            
            // Store email in localStorage for auth flow
            localStorage.setItem("authEmail", data.email);
            redirect("auth/verify_code");
        }
        
        setLoading(false);
    };

    return (
        <AuthCommanForm title={"Forgot Password"} subTitle="">
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <button type="button" className="flex items-center gap-2" onClick={() => redirect("auth/login")}>
                    <ChevronLeft size={15} />
                    Back
                </button>
                <div className="w-full max-md:max-w-full mt-5">
                    <InputItem title="Email Address" placeholder="Enter your email" requiredDot={true} name="email" form={form} />
                    {errorMsg && <div className="text-red-600 mb-2 text-sm">{errorMsg}</div>}
                    <div className="mt-5">
                        <CommonButton type="submit" loading={loading}>
                            send verification code
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

export default ForgotPassword;
