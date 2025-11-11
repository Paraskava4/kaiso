"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroSections } from "../../../redux/masters/heroSlice";
import { updateHeroSectionOrder } from "../../../api/masters/hero";
import { Box, Typography, IconButton, Paper, Button, Collapse } from "@mui/material";
import { Plus, ChevronUp, Eye, Edit, Trash2, GripVertical } from "lucide-react";
import { removeHeroSection } from "../../../redux/masters/heroSlice";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { setupGlobalErrorHandling, handleApiResponse } from "../../../utils/apiErrorHandler";
import { getLocalStorage } from "@/utils/localStorage";
import { useAccess } from "@/utils/constants/accessContext";

const HeroSection = () => {
    // Setup global error handling to prevent Next.js error panels
    useEffect(() => {
        const cleanup = setupGlobalErrorHandling();
        return cleanup;
    }, []);

    const dispatch = useDispatch();
    const { data: heroSections, status } = useSelector((state) => state.hero);
    const [expanded, setExpanded] = React.useState(true);
    const [draggingId, setDraggingId] = React.useState(null);
    const [dragOverId, setDragOverId] = React.useState(null);
    const [isReordering, setIsReordering] = React.useState(false);
    const [accessObj, setAccessObj] = useState();

    const { isButtonDisabled } = useAccess();

    const wrapperRef = useRef(null);
    const router = useRouter();
    const { redirect } = useRouteRedirect();

    useEffect(() => {
        const isAccess = getLocalStorage("ACCESS_ARRAY_STOR");
        setAccessObj(JSON.parse(isAccess));
    }, []);

    // const isButtonDisabled = (permission) => {
    //     // Return true (disable button) if accessObj is null or the permission is false
    //     return !accessObj || !accessObj[permission];
    // };

    useEffect(() => {
        // Always fetch data on component mount, regardless of status
        dispatch(fetchHeroSections());
    }, [dispatch]);

    // Add focus event listener to refresh data when returning to page
    useEffect(() => {
        const handleFocus = () => {
            // Refresh data when page regains focus (e.g., after navigating back from form)
            dispatch(fetchHeroSections());
        };

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [dispatch]);

    // Also refresh data when component mounts or becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                dispatch(fetchHeroSections());
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [dispatch]);

    // Sort by index to keep order
    const sortedSections = React.useMemo(() => {
        return [...heroSections].sort((a, b) => a.index - b.index);
    }, [heroSections]);

    const handleAddNew = () => {
        redirect("admin/masters/hero-section-form");
    };

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    const handleDragStart = (id) => (e) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id.toString());
    };

    const handleDragOver = (e, id) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (id !== dragOverId) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDrop = async (e, targetId) => {
        e.preventDefault();

        if (!draggingId || draggingId === targetId) {
            setDragOverId(null);
            setDraggingId(null);
            return;
        }

        try {
            // Create a new array with the updated order
            const currentIds = sortedSections.map((section) => section.id);
            const fromIndex = currentIds.indexOf(draggingId);
            const toIndex = currentIds.indexOf(targetId);

            if (fromIndex === -1 || toIndex === -1) {
                console.error("Invalid drag operation: indices not found");
                toast.error("Invalid drag operation. Please try again.");
                return;
            }

            // Reorder the array
            const newIds = [...currentIds];
            const [movedId] = newIds.splice(fromIndex, 1);
            newIds.splice(toIndex, 0, movedId);

            // Update backend
            const response = await updateHeroSectionOrder({ heroSectionIds: newIds });
            const result = handleApiResponse(response, "Order updated successfully", "Failed to update order");

            if (!result.success) {
                return;
            }

            // Refresh the list to get the new order from the backend
            await dispatch(fetchHeroSections());
        } catch (error) {
            console.error("Error updating hero section order:", error);
            toast.error("Failed to update hero section order. Please try again.");
        } finally {
            setDragOverId(null);
            setDraggingId(null);
        }
    };

    const handleDragEnd = () => {
        setDragOverId(null);
        setDraggingId(null);
    };

    return (
        <Box p={0} width={1}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={3}>
                <Typography fontWeight="bold" fontSize="1rem">
                    Hero Section
                </Typography>
                <Box display="flex" gap={0.5} alignItems="center">
                    <Button
                        onClick={handleAddNew}
                        variant="outlined"
                        startIcon={<Plus className="w-5 h-5" />}
                        sx={{
                            backgroundColor: "white",
                            borderColor: "rgba(0, 0, 0, 0.2)",
                            color: "#5A5D63",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "rgba(0, 0, 0, 0.3)",
                            },
                        }}
                        disabled={isButtonDisabled("create")}
                    >
                        Add New
                    </Button>
                    <IconButton onClick={toggleExpand}>
                        <ChevronUp className="w-5 h-5"
                            sx={{
                                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                                transition: "transform 0.2s",
                            }}
                        />
                    </IconButton>
                </Box>
            </Box>

            {/* Collapsible List */}
            <Collapse in={expanded}>
                <Box ref={wrapperRef} display="flex" flexDirection="column" gap={2}>
                    {sortedSections.map(({ id, title, bigImage }, index) => (
                        <Paper
                            key={id ?? index}
                            elevation={0}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#F3F4F6",
                                opacity: draggingId === id ? 0.5 : 1,
                                transform: dragOverId === id ? "scale(1.02)" : "scale(1)",
                                transition: "transform 0.2s, opacity 0.2s",
                                border: dragOverId === id ? "2px dashed #1976d2" : "2px solid transparent",
                                position: "relative",
                                "&:after": isReordering && {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                    zIndex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#1976d2",
                                    fontWeight: "bold",
                                },
                            }}
                            onDragOver={(e) => handleDragOver(e, id)}
                            onDragLeave={() => setDragOverId(null)}
                            onDrop={(e) => handleDrop(e, id)}
                        >
                            {/* Drag Handle - Now the only draggable element */}
                            <IconButton
                                draggable
                                onDragStart={handleDragStart(id)}
                                onDragEnd={handleDragEnd}
                                disabled={isButtonDisabled("update")}
                                sx={{
                                    cursor: "grab",
                                    "&:active": {
                                        cursor: "grabbing",
                                    },
                                }}
                                aria-label="Drag"
                            >
                                <GripVertical className="w-5 h-5" />
                            </IconButton>

                            {/* Content */}
                            <Box
                                flex={1}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                minWidth={0}
                                sx={{
                                    position: "relative",
                                    zIndex: 2,
                                }}
                            >
                                <Image
                                    src={bigImage}
                                    alt={title}
                                    width={200}
                                    height={85}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        width: "200px",
                                        height: "85px",
                                        minHeight: "85px",
                                        maxHeight: "85px",
                                    }}
                                />
                                <Typography fontWeight={500} noWrap>
                                    {title}
                                </Typography>
                            </Box>

                            {/* Action Icons */}
                            <Box display="flex" gap={1}>
                                <IconButton
                                    aria-label="View"
                                    onClick={() => {
                                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
                                        window.open(baseUrl, "_blank");
                                    }}
                                    disabled={isButtonDisabled("read")}
                                >
                                    <Eye className="w-5 h-5" />
                                </IconButton>
                                <IconButton
                                    aria-label="Edit"
                                    onClick={() => redirect(`admin/masters/hero-section-form?id=${id}`)}
                                    disabled={isButtonDisabled("update")}
                                >
                                    <Edit className="w-5 h-5" />
                                </IconButton>
                                <IconButton
                                    aria-label="Delete"
                                    sx={{ color: "error.main" }}
                                    onClick={async () => {
                                        if (!id) return;
                                        const ok = window.confirm("Delete this hero section?");
                                        if (!ok) return;
                                        const action = await dispatch(removeHeroSection(id));
                                        if (removeHeroSection.fulfilled.match(action)) {
                                            toast.success("Deleted successfully");
                                        } else {
                                            toast.error(action.payload || "Failed to delete");
                                        }
                                    }}
                                    disabled={isButtonDisabled("delete")}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
};

export default HeroSection;
