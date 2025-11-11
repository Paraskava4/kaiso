"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnlyLayout component that prevents hydration mismatches
 * by only rendering children after the component has mounted on the client
 */
const ClientOnlyLayout = ({ children, fallback = null }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return fallback;
    }

    return children;
};

export default ClientOnlyLayout;
