"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "@/components/shared/SideMenu";
import ProtectedRoute from "@/components/layout/wrapper/protectedRoute";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const Admin = ({ children }) => {
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    useEffect(() => {
        redirect("admin/home");
    }, [router]);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen">
                <SideMenu />
                <main className="flex-1">{children}</main>
            </div>
        </ProtectedRoute>
    );
};

export default Admin;
