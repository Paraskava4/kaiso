"use client";

import { useEffect } from "react";

/**
 * BrowserExtensionCleanup component that handles browser extension interference
 * This component runs only on the client side to clean up extension attributes
 * that might be added to the body element after hydration
 */
export default function BrowserExtensionCleanup() {
    useEffect(() => {
        // Clean up known browser extension attributes that can cause hydration mismatches
        const cleanupExtensions = () => {
            if (typeof document !== "undefined") {
                const body = document.body;
                if (body) {
                    // Remove Grammarly attributes
                    body.removeAttribute("data-new-gr-c-s-check-loaded");
                    body.removeAttribute("data-gr-ext-installed");
                    
                    // Remove other common extension attributes
                    body.removeAttribute("cz-shortcut-listen");
                    
                    // Optional: Remove classes added by extensions
                    const extensionClasses = [
                        "gr__wikipedia_org",
                        "gr__grammarly_com",
                        "ext-shortcut-listen"
                    ];
                    
                    extensionClasses.forEach(className => {
                        body.classList.remove(className);
                    });
                }
            }
        };

        // Clean up immediately when the component mounts
        cleanupExtensions();

        // Also clean up on DOM mutations to handle dynamic additions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.target === document.body) {
                    // Re-clean any extension attributes that were added
                    cleanupExtensions();
                }
            });
        });

        // Start observing body attribute changes
        if (document.body) {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: [
                    'data-new-gr-c-s-check-loaded',
                    'data-gr-ext-installed',
                    'cz-shortcut-listen'
                ]
            });
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return null; // This component doesn't render anything
}
