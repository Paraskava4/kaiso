"use client";

import { createContext, useContext, useRef } from "react";

const LoadingBarContext = createContext();

export const LoadingBarProvider = ({ children }) => {
    const loadingBarRef = useRef(null);

    const startLoading = () => {
        loadingBarRef.current?.continuousStart();
    };

    const completeLoading = () => {
        loadingBarRef.current?.complete();
    };

    return (
        <LoadingBarContext.Provider value={{ startLoading, completeLoading, loadingBarRef }}>
            {children}
        </LoadingBarContext.Provider>
    );
};

export const useLoadingBar = () => {
    const context = useContext(LoadingBarContext);
    if (!context) {
        throw new Error("useLoadingBar must be used within a LoadingBarProvider");
    }
    return context;
};
