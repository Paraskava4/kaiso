import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { InputItem, Label } from "../forms";
import { Controller, useForm } from "react-hook-form";
import { defaultCreateUpdateArticleValue } from "@/utils/constants/api/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { API } from "@/utils/constants/api/schemas";
import TextEditor from "../textEditer";
import { actions } from "@/redux/store";
import { useSelector } from "react-redux";
import { setFormValues } from "@/utils/constants/api/formData";
import { useGetCategoriesQuery, useGetSubcategoryByCategoryIdQuery } from "@/api/categories";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { CloudUploadIcon } from "lucide-react";
import Image from "next/image";
import { ensureWebP } from "@/utils/imageUtils";

const { ARTICLE_CREATE_EDIT } = API;

const type = [
    { label: "blog", value: "Blog" },
    { label: "news article", value: "News Article" },
];

const Article = ({ setImageObj, errors }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [subCategoriesData, setSubCategoriesData] = useState([]);

    const fileInputRef = useRef(null);

    const form = useForm({
        defaultValues: defaultCreateUpdateArticleValue,
        resolver: yupResolver(Validation.ARTICLE_CREATE_UPDATE),
    });

    const { handleSubmit, watch, control, setValue, getValues } = form;

    // Watch all form values for dynamic access
    const formValues = watch();
    const selectType = formValues?.type; // e.g., "Blog" or "News Article"
    const selectedCategoryId = formValues?.categoryId;

    // Fetch categories, skipping until type is selected
    const { data: getCategoriesRes } = useGetCategoriesQuery({}, { skip: !selectType });

    // Fetch subcategories dynamically, skipping until category is selected
    const { data: getSubcategoryByCategoryId } = useGetSubcategoryByCategoryIdQuery({ categoryId: selectedCategoryId }, { skip: !selectedCategoryId });

    // Process and filter categories based on selected type
    useEffect(() => {
        if (!isStatusInclude(getCategoriesRes?.status)) return;

        const data = isValidArray(getCategoriesRes?.data) ? getCategoriesRes.data : [];

        const categoryData = data
            .filter((item) => item?.type === selectType) // Filter by selected article type
            .map((item) => ({
                label: item?.name,
                value: item?._id,
                ...item, // Spread the rest
            }));

        setCategoriesData(categoryData);
    }, [getCategoriesRes, selectType]);

    // Process subcategories
    useEffect(() => {
        if (!isStatusInclude(getSubcategoryByCategoryId?.status)) return;

        const data = isValidArray(getSubcategoryByCategoryId?.data) ? getSubcategoryByCategoryId.data : [];

        const subCategoryData = data.map((item) => ({
            label: item?.name,
            value: item?._id,
            ...item,
        }));

        setSubCategoriesData(subCategoryData);
    }, [getSubcategoryByCategoryId]);

    const onSubmit = (data) => {};

    const articleFormData = useSelector(({ articleForm }) => articleForm?.articleForm?.data);

    const handleFieldChange = (name, value, onChange) => {
        actions?.articleForm?.createArticleForm({ ...getValues(), [name]: value });
        if (typeof onChange === "function") onChange(value);

        // Reset dependent fields for clean state
        if (name === ARTICLE_CREATE_EDIT.ARTICLE_TYPE) {
            setValue(ARTICLE_CREATE_EDIT.CATEGORY_ID, ""); // Reset category
            setValue(ARTICLE_CREATE_EDIT.SUBCATEGORY_ID, ""); // Reset subcategory
            setCategoriesData([]); // Clear category options
            setSubCategoriesData([]); // Clear subcategory options
        } else if (name === ARTICLE_CREATE_EDIT.CATEGORY_ID) {
            setValue(ARTICLE_CREATE_EDIT.SUBCATEGORY_ID, ""); // Reset subcategory
            setSubCategoriesData([]); // Clear subcategory options immediately
        }
    };

    useEffect(() => {
        if (articleFormData && typeof articleFormData === "object") {
            setFormValues(articleFormData, setValue);
            let result = articleFormData?.[ARTICLE_CREATE_EDIT?.URL]?.replace(/\/report\//g, ""); // using regex with 'g' for
            setValue(ARTICLE_CREATE_EDIT?.URL, result);
        }
    }, [articleFormData, setValue]);

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
                                name={ARTICLE_CREATE_EDIT?.ARTICLE_TITLE}
                                title={"Title"}
                                placeholder={"Enter title"}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.ARTICLE_TITLE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={ARTICLE_CREATE_EDIT?.ARTICLE_SUBTITLE}
                                title={"Sub Title"}
                                placeholder={"Enter Sub Title"}
                                onInput={(e) => handleFieldChange(ARTICLE_CREATE_EDIT.ARTICLE_SUBTITLE, e?.target?.value)}
                            />
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.ARTICLE_TYPE}
                                render={({ field: { value, onChange } }) => {
                                    const selectedValue = type?.find((type) => type?.value === value) || null;
                                    return (
                                        <Box>
                                            <Label title={"Article Type"} requiredDot={true} />
                                            <Autocomplete
                                                value={selectedValue}
                                                onChange={(_, newValue) => {
                                                    handleFieldChange(ARTICLE_CREATE_EDIT.ARTICLE_TYPE, newValue?.value, onChange);
                                                }}
                                                options={isValidArray(type) ? type : []}
                                                renderInput={(params) => <TextField {...params} placeholder="Choose Article Type" />}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.CATEGORY_ID}
                                render={({ field: { value, onChange } }) => {
                                    const selectedValue = (isValidArray(categoriesData) && categoriesData?.find((option) => option?.value === value)) || null;
                                    return (
                                        <Box>
                                            <Label title={"Domain"} />
                                            <Autocomplete
                                                value={selectedValue}
                                                onChange={(_, newValue) => {
                                                    handleFieldChange(ARTICLE_CREATE_EDIT.CATEGORY_ID, newValue?.value, onChange);
                                                }}
                                                options={isValidArray(categoriesData) ? categoriesData : []}
                                                renderInput={(params) => <TextField {...params} placeholder="Choose Domain" />}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={ARTICLE_CREATE_EDIT?.SUBCATEGORY_ID}
                                render={({ field: { value, onChange } }) => {
                                    const selectedValue =
                                        (isValidArray(subCategoriesData) && subCategoriesData?.find((option) => option?.value === value)) || null;
                                    return (
                                        <Box>
                                            <Label title={"Sub Domain"} />
                                            <Autocomplete
                                                value={selectedValue}
                                                onChange={(_, newValue) => {
                                                    handleFieldChange(ARTICLE_CREATE_EDIT.SUBCATEGORY_ID, newValue?.value, onChange);
                                                }}
                                                options={isValidArray(subCategoriesData) ? subCategoriesData : []}
                                                renderInput={(params) => <TextField {...params} placeholder="Choose Sub Domain" />}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            {/* <Box sx={{ mt: 2 }}> */}
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
                                                startIcon={<CloudUploadIcon />}
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
                                                                maxHeight: 1920,
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
                            {/* </Box> */}
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
                                    return <TextEditor value={value} onChange={(e) => handleFieldChange(name, e?.html, onChange)} />
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Article;
