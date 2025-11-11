"use client";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { Loader } from "@/components/shared/Loader";
import { getSessionStorage } from "@/utils/localStorage";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    const session = useMemo(() => {
        if (typeof window !== "undefined") {
            const sessionData = getSessionStorage("adminToken");
            return sessionData ? sessionData : null;
        }
        return null;
    }, []);

    useEffect(() => {
        if (!session) {
            const next = pathname || "/admin/home";
            router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
        } else {
            setLoading(false);
        }
    }, [session, router, pathname]);

    if (loading || !session) {
        return <Loader height={"calc(100vh - 0px)"} />
    }

    return (
        <>
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
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: "#ef4444",
                            color: "#fff",
                        },
                    },
                }}
            />
            {children}
        </>
    );
};

export default ProtectedRoute;
