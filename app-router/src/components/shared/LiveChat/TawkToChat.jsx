"use client";
import { useEffect, useState } from "react";

const TawkToChat = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initialize Tawk_API object
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Wait for browser to be idle before loading chat
        const loadTawkScript = () => {
            // Check if script already exists
            if (document.querySelector('script[src*="tawk.to"]')) {
                setIsLoaded(true);
                return;
            }

            // Inject Tawk.to script with optimized loading
            const script = document.createElement("script");
            script.async = true;
            script.defer = true;
            script.src = "https://embed.tawk.to/688891cbdb7610192eeadedc/1j1anj170";
            script.charset = "UTF-8";
            script.setAttribute("crossorigin", "*");
            
            // Add loading states
            script.onload = () => {
                console.log("Tawk.to script loaded successfully");
                setIsLoaded(true);
                window.Tawk_API.onLoad = () => {
                    console.log("Tawk.to chat widget loaded");
                };
            };
            
            script.onerror = () => {
                console.error("Failed to load Tawk.to script. Check network or Tawk.to account.");
                setIsLoaded(false);
            };

            // Insert script at the end of head for better performance
            document.head.appendChild(script);
        };

        // Use requestIdleCallback for optimal loading timing
        if ('requestIdleCallback' in window) {
            const idleCallback = window.requestIdleCallback(loadTawkScript, { timeout: 3000 });
            return () => {
                window.cancelIdleCallback(idleCallback);
                cleanup();
            };
        } else {
            // Fallback for browsers without requestIdleCallback
            const timeoutId = setTimeout(loadTawkScript, 2000);
            return () => {
                clearTimeout(timeoutId);
                cleanup();
            };
        }

        function cleanup() {
            if (window.Tawk_API && window.Tawk_API.destroy) {
                window.Tawk_API.destroy();
                console.log("Tawk.to widget destroyed");
            }
            const tawkScript = document.querySelector('script[src*="tawk.to"]');
            if (tawkScript) {
                tawkScript.remove();
            }
            const tawkWidget = document.getElementById("tawk-widget");
            if (tawkWidget) {
                tawkWidget.remove();
            }
        }
    }, []);

    return null; // No visible UI, Tawk.to handles rendering
};

export default TawkToChat;