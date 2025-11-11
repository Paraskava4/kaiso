"use client";
import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Paper, Typography, Avatar, Fab, CircularProgress } from "@mui/material";
import { MessageCircle, X, Minus } from "lucide-react";

const CustomLiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTawkReady, setIsTawkReady] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const loadTawk = () => {
            if (!window.Tawk_API) {
                window.Tawk_API = window.Tawk_API || {};
                window.Tawk_LoadStart = new Date();

                const script = document.createElement("script");
                script.async = true;
                script.src = "https://embed.tawk.to/688891cbdb7610192eeadedc/1j1anj170";
                script.charset = "UTF-8";
                script.setAttribute("crossorigin", "*");
                script.onload = () => {
                    console.log("Tawk.to script loaded successfully");
                    if (isMounted) {
                        setupTawk();
                    }
                };
                script.onerror = (e) => {
                    console.error("Failed to load Tawk.to script:", e, "Check network, ad blockers, or Tawk.to account.");
                    if (isMounted) {
                        setIsLoading(false);
                    }
                };

                const firstScript = document.getElementsByTagName("script")[0];
                firstScript.parentNode.insertBefore(script, firstScript);
            } else {
                console.log("Tawk_API already exists, setting up...");
                if (isMounted) {
                    setupTawk();
                }
            }
        };

        const setupTawk = () => {
            if (window.Tawk_API && !isTawkReady) {
                window.Tawk_API.onLoad = () => {
                    console.log("Tawk.to chat widget initialized");
                    if (window.Tawk_API.hideWidget) {
                        window.Tawk_API.hideWidget();
                    }
                    if (isMounted) {
                        setIsTawkReady(true);
                        setIsLoading(false);
                        syncTawkState();
                    }
                };
                // Force initialization if not triggered
                if (!window.Tawk_API.onLoad) {
                    console.warn("Tawk_API.onLoad not set, forcing initialization...");
                    setTimeout(() => {
                        if (isMounted && window.Tawk_API && window.Tawk_API.hideWidget) {
                            window.Tawk_API.hideWidget();
                            setIsTawkReady(true);
                            setIsLoading(false);
                            syncTawkState();
                        }
                    }, 2000); // Wait 2s for script to settle
                }
            }
        };

        loadTawk();

        return () => {
            isMounted = false;
            if (window.Tawk_API && window.Tawk_API.destroy) {
                window.Tawk_API.destroy();
                console.log("Tawk.to widget destroyed");
            }
        };
    }, []);

    useEffect(() => {
        syncTawkState();
    }, [isOpen, isMinimized]);

    const syncTawkState = () => {
        if (window.Tawk_API && isTawkReady) {
            if (isOpen && !isMinimized) {
                if (window.Tawk_API.maximize) {
                    window.Tawk_API.maximize();
                    console.log("Tawk.to maximized");
                }
            } else if (isMinimized) {
                if (window.Tawk_API.minimize) {
                    window.Tawk_API.minimize();
                    console.log("Tawk.to minimized");
                }
            } else {
                if (window.Tawk_API.hideWidget) {
                    window.Tawk_API.hideWidget();
                    console.log("Tawk.to hidden");
                }
            }
        } else if (!isTawkReady) {
            console.warn("Tawk_API not ready, waiting...");
        }
    };

    if (!isOpen) {
        return (
            <Fab
                color="primary"
                onClick={() => setIsOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 25,
                    zIndex: 1300,
                }}
            >
                <MessageCircle size={24} />
            </Fab>
        );
    }

    return (
        <Paper
            elevation={8}
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 350,
                height: isMinimized ? 60 : 500,
                zIndex: 1300,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "height 0.3s ease",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    // bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
                    <Box>
                        <Typography variant="subtitle2">Support</Typography>
                        <Typography variant="caption">Online</Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => setIsMinimized(!isMinimized)}
                        sx={{ color: "white", mr: 1 }}
                    >
                        <Minus size={20} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => setIsOpen(false)}
                        sx={{ color: "white" }}
                    >
                        <X size={20} />
                    </IconButton>
                </Box>
            </Box>

            {!isMinimized && (
                <Box
                    ref={chatContainerRef}
                    sx={{
                        flex: 1,
                        p: 1,
                        overflowY: "auto",
                        bgcolor: "#c7bbbbff",
                        position: "relative",
                        "& #tawk-chat-container": {
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        },
                    }}
                >
                    {isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <div id="tawk-chat-container" />
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default CustomLiveChat;