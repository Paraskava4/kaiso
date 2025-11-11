import { usePathname } from "next/navigation";
import ProtectedRoute from "./wrapper/protectedRoute";
import {  poppins } from "@/utils/fonts";
import HeaderClientWrapper from "./HeaderClientWrapper";

function LayoutHandler({ Component, pageProps }) {
    const pathname = usePathname() || "";
    const pathSegments = pathname.split("/").filter(Boolean);

    const isAuthProtected = pathname.startsWith("/admin");
    const isAuthPages = pathname.startsWith("/auth");

    if (isAuthProtected) {
        return (
            <ProtectedRoute>
                <Component {...pageProps} />
            </ProtectedRoute>
        );
    }

    if (isAuthPages) {
        return <Component {...pageProps} />
    }

    return (
        <div className={`${poppins.variable} ${poppins.variable} ${poppins.className} ${poppins.className}`}>
            <HeaderClientWrapper />
            <Component {...pageProps} />
        </div>
    );
}

export default LayoutHandler;
