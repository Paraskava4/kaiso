"use client";

import { useRouter } from "next/navigation";
import { useLoadingBar } from "../contexts/LoadingBarContext";

export const useRouteRedirect = () => {
    const router = useRouter();
    const { startLoading } = useLoadingBar();

    const redirect = (to, replace = false, newTab = false) => {
        const normalizedTo = `/${to}`; // Normalize URL by ensuring single leading slash

        if (newTab) {
            // Open in a new tab
            window.open(normalizedTo, "_blank", "noopener,noreferrer");
        } else {
            // Start the loading bar before navigation
            startLoading();

            if (replace) {
                // Replace current route
                router.replace(normalizedTo);
            } else {
                // Push to new route
                router.push(normalizedTo);
            }
        }
    };

    return { redirect };
};
