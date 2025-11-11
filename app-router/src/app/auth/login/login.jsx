

"use client";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import AuthCommanForm from "@/components/shared/AuthCommanForm";
import CommonButton from "@/components/shared/CommonButton";
import { InputItem } from "@/components/shared/forms";
import { defaultLoginValues } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { isTokenValid } from "@/utils/axiosInstance";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { login } from "@/api/auth";
import { getSessionStorage, setLocalStorage, setSessionStorage } from "@/utils/localStorage";
import { usePathname } from "next/navigation";

function generateNotificationToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 22; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token + ":APA91b" + Math.random().toString(36).substring(2, 20);
}

const Login_Page = ({ onNavigate }) => {
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

    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const pathname = usePathname()?.split("/");

    const { redirect } = useRouteRedirect();

    const form = useForm({
        defaultValues: defaultLoginValues,
        resolver: yupResolver(Validation.LOGIN),
    });

    const { handleSubmit } = form;

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const token = getSessionStorage("adminToken");
            if (token && isTokenValid(token)) {
                redirect("/admin/home");
            }
        }
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMsg("");

        const notificationToken = generateNotificationToken();

        const response = await login({
            email: data.email,
            password: data.password,
            notificationToken,
        });


        // Check if response has error
        if (response?.error) {
            setErrorMsg(response.message);
            toast.error(response.message);
        } else {
            const isSuccess = response?.status === 200 && response?.accessToken;

            if (isSuccess) {
                toast.success(response?.message || "User login successfully.");

                // Clear any old profile data before setting new session
                localStorage.removeItem("userProfile");

                setSessionStorage("adminToken", response.accessToken);
                document.cookie = `adminToken=${response.accessToken}; path=/; SameSite=Lax; max-age=86400`; // 1 day
                setLocalStorage(
                    "session",
                    JSON.stringify({
                        accessToken: response?.accessToken,
                        refreshToken: response?.refreshToken,
                        _id: response?._id,
                        user: response?.user,
                        organization: response?.organization,
                        accessArray: response?.accessArray,
                    })
                );

                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                }

                setTimeout(() => {
                    redirect("admin/home");
                }, 1000);
            } else {
                setErrorMsg(response?.message || "Invalid email or password");
                toast.error(response?.message || "Invalid email or password");
            }
        }

        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        redirect("auth/forgotpassword");
    };

    return (
        <AuthCommanForm title={"Welcome to Kaiso"} subTitle="">
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full max-md:max-w-full">
                    {errorMsg && <div className="text-red-600 mb-2 text-sm">{errorMsg}</div>}

                    <InputItem title="Email Address" placeholder="Enter your email" requiredDot={true} name="email" form={form} />

                    <div className="mt-5">
                        <InputItem title="Password" type="password" placeholder="Enter your password" requiredDot={true} name="password" form={form} />
                    </div>

                    <div className="flex justify-end items-start mt-5 w-full max-md:max-w-full">
                        {/* <CommanCheckbox label="Remember Me" checked={rememberMe} onChange={setRememberMe} /> */}
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm font-medium leading-snug text-right text-red-600 hover:text-red-700 focus:outline-none focus:underline hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="mt-5">
                        <CommonButton type="submit" disabled={isLoading} fullWidth>
                            {isLoading ? "Signing in..." : "continue to Kaiso"}
                        </CommonButton>
                    </div>
                </div>
            </Box>
        </AuthCommanForm>
    );
};

export default Login_Page;
