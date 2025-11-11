import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { ErrorMessage, InputItem, Label } from "../forms";
import { Controller, useForm } from "react-hook-form";
import { defaultCreateUpdateArticleValue } from "@/utils/constants/api/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { API } from "@/utils/constants/api/schemas";
import TextEditor from "../textEditer";
import { useSelector } from "react-redux";
import { actions } from "@/redux/store";
import { setFormValues } from "@/utils/constants/api/formData";
import CommonDatePicker from "@/components/forms/datePicker";
import { Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { ensureWebP } from "@/utils/imageUtils";
import { getFirstThreeWordsSlug } from "../PermanentDrawerLeft";

const { ARTICLE_CREATE_EDIT } = API;

const ArticleSeo = ({ setImageObj, errors }) => {
    const [tabValue, setTabValue] = useState("1");
    const fileInputRef = useRef(null);

    const form = useForm({
        defaultValues: defaultCreateUpdateArticleValue,
        resolver: yupResolver(Validation.ARTICLE_CREATE_UPDATE),
    });

    const { handleSubmit, watch, control, setValue } = form;

    const blogImage = watch(ARTICLE_CREATE_EDIT.BLOG_IMAGE); // Watch the image field for preview

    const onSubmit = (data) => {};

    const articleFormData = useSelector(({ articleForm }) => articleForm?.articleForm?.data);

    const handleFieldChange = (name, value, onChange) => {
        actions?.articleForm?.createArticleForm({ ...form.getValues(), [name]: value });
        if (typeof onChange === "function") onChange(value);
    };

    useEffect(() => {
        if (articleFormData && typeof articleFormData === "object") {
            setFormValues(articleFormData, setValue);
            let result = articleFormData?.[ARTICLE_CREATE_EDIT?.URL]?.replace(/\/report\//g, ""); // using regex with 'g' for
            setValue(ARTICLE_CREATE_EDIT?.URL, result);
        }
    }, [articleFormData, setValue]);

    const handleRemoveImage = () => {
        setValue(ARTICLE_CREATE_EDIT.BLOG_IMAGE, null); // Clear form state
        actions?.articleForm?.createArticleForm({ ...form.getValues(), [ARTICLE_CREATE_EDIT.BLOG_IMAGE]: null});
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear file input
        }
        toast.success("Image removed successfully");
    };

    return (
        <Box>
            <Grid container spacing={0} sx={{ height: "calc(100vh - 130px)" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ position: "relative", height: "100%", overflow: "auto", borderRight: "1px solid #000" }}>
                        <Typography
                            sx={{ fontWeight: 500, fontSize: "20px", position: "sticky", top: 0, p: 1, px: 2, bgcolor: "#fff", width: "100%", zIndex: 7 }}
                            component={"p"}
                        >
                            Article Details
                        </Typography>
                        <Box sx={{ position: "absolute", width: "100%", overflow: "auto", px: 2 }}>
                            <InputItem
                                form={form}
                                name={ARTICLE_CREATE_EDIT?.SEO_TITLE}
                                title={"Title tag"}
                                placeholder={"It's recommended to use 55-65 characters to briefly describe the topic of this page"}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.SEO_TITLE, e?.target?.value)}
                            />
                            <InputItem
                                form={form}
                                name={ARTICLE_CREATE_EDIT?.META_DESCRIPTION}
                                title={"Meta description"}
                                placeholder={"It's recommended to use 155-165 characters to summarize this page."}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.META_DESCRIPTION, e?.target?.value)}
                            />
                            <InputItem
                                form={form}
                                name={ARTICLE_CREATE_EDIT?.KEYWORDS}
                                title={"Keywords"}
                                placeholder={"Choose Sub categories"}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.KEYWORDS, e?.target?.value)}
                            />
                            {/* <InputItem
                                form={form}
                                name={ARTICLE_CREATE_EDIT?.URL}
                                title={"URL slug"}
                                placeholder={"/ URL slug"}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.URL, e?.target?.value)}
                            /> */}
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.URL}
                                render={({ field: { value, onChange, name } }) => {
                                    const defaultValue = value ? value : getFirstThreeWordsSlug(watch()?.[ARTICLE_CREATE_EDIT?.ARTICLE_TITLE]);
                                    return (
                                        <>
                                            <Label title={"URL slug"} />
                                            <TextField
                                                value={defaultValue}
                                                onChange={(e) => handleFieldChange(name, e?.target?.value, onChange)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">/blog/</InputAdornment>,
                                                }}
                                                sx={{ borderRadius: "6px" }}
                                                name={name}
                                                fullWidth
                                            />
                                            <ErrorMessage error={errors?.[name]} />
                                        </>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.PUBLISH_DATE}
                                render={({ field: { value, onChange, name } }) => {
                                    return (
                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                            <Label title={"Publisher Date"} />
                                            <CommonDatePicker
                                                value={value ? new Date(value) : null}
                                                onChange={(e) => handleFieldChange(name, e, onChange)}
                                                placeholder={"Choose date"}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            {/* <Box sx={{ mt: 2 }}>
                                <Controller
                                    control={control}
                                    name={ARTICLE_CREATE_EDIT?.BLOG_IMAGE}
                                    render={({ field: { value, onChange, name } }) => {
                                        return (
                                            <>
                                                <Label title={"Blog Image"} />
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    startIcon={<Upload className="w-5 h-5" />}
                                                    sx={{
                                                        mt: 1,
                                                        width: "100%",
                                                        textTransform: "none",
                                                        borderColor: "#d1d5db",
                                                        color: "#374151",
                                                        "&:hover": {
                                                            borderColor: "#9ca3af",
                                                            backgroundColor: "#f9fafb",
                                                        },
                                                    }}
                                                >
                                                    Upload Blog Image
                                                    <input
                                                        type="file"
                                                        hidden
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // Convert to WebP for better performance
                                                                const webpFile = await ensureWebP(file, { 
                                                                    quality: 0.8, 
                                                                    maxWidth: 1920, 
                                                                    maxHeight: 1920 
                                                                });
                                                                handleFieldChange(name, webpFile, onChange);
                                                                setImageObj(webpFile);
                                                                // onChange(name, webpFile);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {value ? (
                                                    <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                                                        <Image
                                                            src={value instanceof Blob || value instanceof File ? URL.createObjectURL(value) : value}
                                                            alt="Blog Image Preview"
                                                            width={100}
                                                            height={100}
                                                            style={{ objectFit: "cover", marginRight: 8 }}
                                                        />
                                                    </Box>
                                                ) : null}
                                            </>
                                        );
                                    }}
                                />
                            </Box> */}
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Box sx={{ position: "relative", height: "100%", overflow: "auto" }}>
                        <Box>
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.ARTICLE_CONTENT}
                                render={({ field: { value, onChange, name } }) => {
                                    return <TextEditor value={value} onChange={(e) => handleFieldChange(name, e?.html, onChange)} />;
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ArticleSeo;
