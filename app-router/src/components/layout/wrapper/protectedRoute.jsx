import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import AdminHeader from "@/components/shared/AdminHeader";
import SideMenu from "@/components/shared/SideMenu";
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
            const next = typeof window !== "undefined" ? window.location.href : pathname || "/admin/home";
            router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
        }
        setLoading(false);
    }, [session, router, pathname]);

    if (loading) {
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
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
                    <AdminHeader />
                </div>
                <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
                    <div
                        style={{
                            position: "sticky",
                            top: "64px",
                            width: "200px",
                            maxWidth: "210px",
                            height: "100%",
                            overflowY: "auto",
                        }}
                    >
                        <SideMenu />
                    </div>
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "20px",
                            height: "100%",
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProtectedRoute;
