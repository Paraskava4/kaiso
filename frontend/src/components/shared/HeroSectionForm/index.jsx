"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Paperclip } from "lucide-react";
import formStyles from "./formStyles";

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { createHeroSection, fetchHeroSectionById, editHeroSection, fetchHeroSections } from "../../../redux/masters/heroSlice";
import { setupGlobalErrorHandling } from "../../../utils/apiErrorHandler";
import { ensureWebP } from "@/utils/imageUtils";
function HeroSectionForm() {
    const [formData, setFormData] = useState({
        bgImage: null,
        icon: null,
        title: "",
        headline: "",
        subline: "",
        cta1: "",
        cta1Link: "",
        cta1Type: "primary",
        cta2: "",
        cta2Link: "",
        cta2Type: "primary",
        darkMode: false,
    });

    const [preview, setPreview] = useState({
        bgImage: null,
        icon: null,
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const heroSectionId = searchParams.get("id");

    const isEdit = Boolean(heroSectionId);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = async (e) => {
        const { id } = e.target;
        const file = e.target.files[0];
        if (!file) return;

        try {
            const converted = await ensureWebP(file, { quality: 0.8, maxWidth: 1920, maxHeight: 1920 });

            const reader = new FileReader();
            reader.onload = () => {
                setPreview((prev) => ({ ...prev, [id]: reader.result }));
                setFormData((prev) => ({ ...prev, [id]: converted }));
            };
            reader.readAsDataURL(converted);
        } catch (error) {
            console.error("Image conversion error:", error);
            toast.error("Failed to process image");
        }

        // const reader = new FileReader();
        // reader.onload = () => {
        //     setPreview((prev) => ({ ...prev, [id]: reader.result }));
        //     setFormData((prev) => ({ ...prev, [id]: file }));
        // };
        // reader.readAsDataURL(file);
    };

    const toggleDarkMode = () => {
        setFormData((prev) => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const dispatch = useDispatch();
    const { current } = useSelector((state) => state.hero);

    // Setup global error handling to prevent Next.js error panels
    React.useEffect(() => {
        const cleanup = setupGlobalErrorHandling();
        return cleanup;
    }, []);

    // Fetch existing hero details in edit mode
    React.useEffect(() => {
        if (isEdit) {
            dispatch(fetchHeroSectionById(heroSectionId));
        }
    }, [dispatch, isEdit, heroSectionId]);

    // Prefill form when data arrives
    React.useEffect(() => {
        if (isEdit && current) {
            setFormData((prev) => ({
                ...prev,
                title: current.title || "",
                headline: current.headline || "",
                subline: current.subtitle || "",
                cta1: current.CTAButtonOneName || "",
                cta1Link: current.CTAButtonOneLink || "",
                cta1Type: current.CTAButtonOneType || "primary",
                cta2: current.CTAButtonTwoName || "",
                cta2Link: current.CTAButtonTwoLink || "",
                cta2Type: current.CTAButtonTwoType || "primary",
                darkMode: current.mode === "Dark",
                // keep images null unless user uploads new; preview shows existing
            }));
            setPreview({
                bgImage: current.bigImage || null,
                icon: current.icon || null,
            });
        }
    }, [isEdit, current]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEdit && (!formData.bgImage || !formData.icon)) {
            toast.error("Please select both Background and Icon images");
            return;
        }

        try {
            const payload = new FormData();
            if (formData.bgImage) {
                payload.append("bigImage", formData.bgImage);
                // For compatibility with backend validations expecting 'image'
                payload.append("image", formData.bgImage);
            }
            if (formData.icon) payload.append("icon", formData.icon);

            payload.append("title", formData.title);
            payload.append("headline", formData.headline);
            payload.append("subtitle", formData.subline);

            payload.append("CTAButtonOneName", formData.cta1);
            payload.append("CTAButtonOneLink", formData.cta1Link);
            payload.append("CTAButtonOneType", formData.cta1Type);

            payload.append("CTAButtonTwoName", formData.cta2);
            payload.append("CTAButtonTwoLink", formData.cta2Link);
            payload.append("CTAButtonTwoType", formData.cta2Type);

            payload.append("mode", formData.darkMode ? "Dark" : "Light");

            let action;
            if (isEdit) {
                // Include id to backend if required
                payload.append("heroSectionId", heroSectionId);
                action = await dispatch(editHeroSection({ heroSectionId, formData: payload }));
            } else {
                action = await dispatch(createHeroSection(payload));
            }

            if ((isEdit && editHeroSection.fulfilled.match(action)) || (!isEdit && createHeroSection.fulfilled.match(action))) {
                toast.success(isEdit ? "Hero section updated successfully" : "Hero section added successfully");

                // Refresh the hero sections list to show updated data
                dispatch(fetchHeroSections());

                // Navigate back after a short delay to ensure data is refreshed
                setTimeout(() => {
                    router.back();
                }, 100);
                return;
            }

            toast.error(action.payload || "Unknown error");
        } catch (error) {
            console.error("Error adding hero section", error);
            const message = error?.message || (typeof error === "string" ? error : "Failed to add Hero Section");
            toast.error(message);
        }
    };

    const handleCancel = () => {
        setFormData({
            bgImage: null,
            icon: null,
            title: "",
            headline: "",
            subline: "",
            cta1: "",
            cta1Link: "",
            cta1Type: "primary",
            cta2: "",
            cta2Link: "",
            cta2Type: "primary",
            darkMode: false,
        });
        setPreview({ bgImage: null, icon: null });
        router.back();
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <main className={formStyles.main}>
                <section className={formStyles.section}>
                    {/* Form Header */}
                    <header className={formStyles.header}>
                        <h1 className={formStyles.headerTitle}>{isEdit ? "Edit" : "Add"} Hero Section</h1>

                        <div className={formStyles.headerActions}>
                            <button type="button" onClick={toggleDarkMode} className={formStyles.darkModeButton}>
                                <span>{formData.darkMode ? "Dark Mode" : "Light Mode"}</span>
                                <ChevronDown className={formStyles.dropdownIcon} />
                            </button>

                            <button type="button" onClick={handleSubmit} className={formStyles.saveButton}>
                                Save
                            </button>
                            <button type="button" onClick={handleCancel} className={formStyles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </header>

                    {/* Form Content */}
                    <form className={formStyles.form}>
                        <div className={formStyles.formRow}>
                            <FileUploadField
                                label="Bg Image"
                                placeholder="Upload Background"
                                id="bgImage"
                                onChange={handleFileChange}
                                preview={preview.bgImage}
                            />
                            <FileUploadField label="Icon" placeholder="Upload Icon" id="icon" onChange={handleFileChange} preview={preview.icon} />
                            <TextInputField label="Title" placeholder="Enter Title" id="title" value={formData.title} onChange={handleInputChange} />
                        </div>

                        <div className={formStyles.formRow}>
                            <TextInputField
                                label="Headline"
                                placeholder="Enter Headline"
                                id="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                            />
                            <TextInputField label="Subline" placeholder="Enter Subtitle" id="subline" value={formData.subline} onChange={handleInputChange} />
                        </div>

                        <div className={formStyles.formRow}>
                            <TextInputField label="CTA 1" placeholder="Button Name" id="cta1" value={formData.cta1} onChange={handleInputChange} />
                            <TextInputField
                                label="CTA 1 Link"
                                placeholder="Past Link"
                                id="cta1Link"
                                value={formData.cta1Link}
                                onChange={handleInputChange}
                                type="url"
                            />
                            <DropdownField placeholder="Button Type" id="cta1Type" value={formData.cta1Type} onChange={handleInputChange} />
                        </div>

                        <div className={formStyles.formRow}>
                            <TextInputField label="CTA 2" placeholder="Button Name" id="cta2" value={formData.cta2} onChange={handleInputChange} />
                            <TextInputField
                                label="CTA 2 Link"
                                placeholder="Past Link"
                                id="cta2Link"
                                value={formData.cta2Link}
                                onChange={handleInputChange}
                                type="url"
                            />
                            <DropdownField placeholder="Button Type" id="cta2Type" value={formData.cta2Type} onChange={handleInputChange} />
                        </div>
                    </form>

                    {/* Preview Section */}
                    <PreviewSection formData={formData} preview={preview} />
                </section>
            </main>
        </>
    );
}

// Sub-components
function FileUploadField({ label, placeholder, id, onChange, preview }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            // Create a synthetic event object to match the expected onChange format
            const syntheticEvent = {
                target: {
                    id: id,
                    files: files,
                },
            };
            onChange(syntheticEvent);
        }
    };

    const handleClick = () => {
        document.getElementById(id).click();
    };

    return (
        <div className={formStyles.uploadField}>
            <label htmlFor={id} className={formStyles.fieldLabel}>
                {label}
            </label>

            <div
                className={formStyles.uploadContainer}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                style={{
                    cursor: "pointer",
                    border: isDragging ? "2px dashed #1976d2" : undefined,
                    backgroundColor: isDragging ? "rgba(25, 118, 210, 0.04)" : undefined,
                    transition: "all 0.3s ease",
                    minHeight: "60px",
                    position: "relative",
                }}
            >
                <input type="file" id={id} className={formStyles.fileInput} onChange={onChange} accept="image/*" />

                <div className={formStyles.uploadLabel}>
                    <span style={{ color: isDragging ? "#1976d2" : undefined }}>{preview ? "File selected" : isDragging ? "Drop file here" : placeholder}</span>
                    {preview ? (
                        <Check className={formStyles.checkIcon} />
                    ) : (
                        <Paperclip className={formStyles.uploadIcon} style={{ color: isDragging ? "#1976d2" : undefined }} />
                    )}
                </div>

                {isDragging && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "11px",
                            color: "#1976d2",
                            fontWeight: "500",
                        }}
                    >
                        Drop to upload
                    </div>
                )}
            </div>

            {/* {preview && (
        <div className={formStyles.previewContainer}>
          <Image
width={100}
height={100} src={preview} alt={`${label} preview`} className={formStyles.previewImage} />
        </div>
      )} */}
        </div>
    );
}

function TextInputField({ label, placeholder, id, value, onChange, type = "text" }) {
    return (
        <div className={formStyles.inputField}>
            <label htmlFor={id} className={formStyles.fieldLabel}>
                {label}
            </label>
            <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder} className={formStyles.textInput} />
        </div>
    );
}

function DropdownField({ placeholder, id, value, onChange }) {
    return (
        <div className={formStyles.dropdownField}>
            <div className={formStyles.dropdownContainer}>
                <select id={id} value={value} onChange={onChange} className={formStyles.dropdownSelect}>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                </select>
                <ChevronDown className={formStyles.dropdownArrow} />
            </div>
        </div>
    );
}

function PreviewSection({ formData, preview }) {
    // Determine text color classes based on darkMode flag
    const textColor = formData.darkMode ? "text-black" : "text-white";
    const getButtonStyle = (type) => {
        switch (type) {
            case "primary":
                return formData.darkMode ? formStyles.primaryButton : formStyles.primaryButtonLight;
            case "secondary":
                return formData.darkMode ? formStyles.secondaryButton : formStyles.secondaryButtonLight;
            case "outline":
                return formData.darkMode ? formStyles.outlineButton : formStyles.outlineButtonLight;
            default:
                return formData.darkMode ? formStyles.primaryButton : formStyles.primaryButtonLight;
        }
    };

    const cta1Text = formData.cta1.trim();
    const cta2Text = formData.cta2.trim();

    return (
        <header>
            <section className="relative flex flex-col w-[1620px] min-h-[800px] max-md:min-h-[600px]">
                {preview.bgImage ? (
                    <div className="absolute inset-0 w-full h-full">
                        <Image src={preview.bgImage} width={100} height={100} alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black opacity-40" />
                    </div>
                ) : (
                    <div className={formStyles.placeholderBgImage}>
                        <span className={formStyles.placeholderText}></span>
                    </div>
                )}

                <div className="relative pt-48 pb-12 w-full max-md:pt-24">
                    <div className="flex flex-wrap gap-10 justify-between items-center px-38 max-md:px-5 w-full">
                        <div className={`flex flex-col items-start ${textColor} max-w-4xl w-full`}>
                            <div className="flex items-center gap-3 text-xl font-semibold">
                                {preview.icon ? (
                                    <Image src={preview.icon} width={100} height={100} alt="Icon" className="w-14 h-14 rounded-md object-contain" />
                                ) : (
                                    <div className={`w-14 h-14 bg-white bg-opacity-20 rounded-md flex items-center justify-center ${textColor}`}>Icon</div>
                                )}
                                <span>{formData.title || "Title"}</span>
                            </div>

                            <h1 className="mt-3 text-6xl w-[790px] font-bold leading-[72px] max-md:text-4xl max-md:leading-[53px]">
                                {formData.headline || "Headline"}
                            </h1>

                            <p className="mt-3 text-lg w-[790px] font-medium leading-7 max-md:text-base">{formData.subline || "Subline"}</p>

                            <div className="flex gap-4 mt-6">
                                {cta1Text && <button className={getButtonStyle(formData.cta1Type)}>{cta1Text}</button>}

                                {cta2Text && <button className={getButtonStyle(formData.cta2Type)}>{cta2Text}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
}

export default HeroSectionForm;
