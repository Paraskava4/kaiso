import React, { createContext, useState, useEffect } from "react";
import { getLocalStorage } from "../localStorage";

// Create the context
export const AccessContext = createContext();

// Provider component
export const AccessProvider = ({ children }) => {
    const ACCESS_KEY = "ACCESS_ARRAY_STOR";

    // Initialize from localStorage on first render to avoid disabled flicker
    const [accessObj, setAccessObj] = useState(() => {
        if (typeof window === "undefined") return null;
        try {
            const raw = getLocalStorage(ACCESS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.error("Error parsing ACCESS_ARRAY_STOR:", error);
            return null;
        }
    });

    // Listen for storage changes (cross-tab) to keep in sync
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === ACCESS_KEY) {
                try {
                    setAccessObj(event.newValue ? JSON.parse(event.newValue) : null);
                } catch (error) {
                    console.error("Error parsing ACCESS_ARRAY_STOR (storage event):", error);
                    setAccessObj(null);
                }
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const isButtonDisabled = (permission) => {
        // If no accessObj exists, disable all buttons
        if (!accessObj) return true;
        
        // Return true (disabled) if permission is falsy (false, null, undefined)
        // Return false (enabled) if permission is truthy (true)
        return !accessObj[permission];
    };

    const updateAccess = (nextAccess) => {
        setAccessObj(nextAccess || null);
    };

    const refreshAccess = () => {
        try {
            const raw = getLocalStorage(ACCESS_KEY);
            setAccessObj(raw ? JSON.parse(raw) : null);
        } catch (error) {
            console.error("Error parsing ACCESS_ARRAY_STOR (refresh):", error);
            setAccessObj(null);
        }
    };

    return <AccessContext.Provider value={{ isButtonDisabled, updateAccess, refreshAccess, access: accessObj }}>{children}</AccessContext.Provider>
};

// Custom hook to access permission checks
export const useAccess = () => {
    const context = React.useContext(AccessContext);
    if (!context) {
        throw new Error("useAccess must be used within an AccessProvider");
    }
    return context;
};
