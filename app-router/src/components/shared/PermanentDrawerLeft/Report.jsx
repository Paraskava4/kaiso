import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Checkbox, FormControlLabel, FormGroup, Grid, Tab, TextField, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { InputItem, Label } from "../forms";
import { Controller, useForm } from "react-hook-form";
import { defaultCreateUpdateReportValue } from "@/utils/constants/api/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { API } from "@/utils/constants/api/schemas";
import TextEditor from "../textEditer";
import { actions } from "@/redux/store";
import { useSelector } from "react-redux";
import { setFormValues } from "@/utils/constants/api/formData";
import { useGetCategoriesQuery, useGetSubCategoriesQuery, useGetSubcategoryByCategoryIdQuery } from "@/api/categories";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";

const { REPORT_CREATE_EDIT } = API;
const FILE_TYPES = ["Pdf", "Word", "Excel"];
const Report = () => {
    const [categoriesData, setCategoriesData] = useState();
    const [subCategoriesData, setSubCategoriesData] = useState();
    const [tabValue, setTabValue] = useState("1");
    const [isLoadingEditor, setIsLoadingEditor] = useState(false);

    const form = useForm({
        defaultValues: defaultCreateUpdateReportValue,
        resolver: yupResolver(Validation.REPORT_CREATE_UPDATE),
    });

    const { handleSubmit, watch, control, setValue, getValues } = form;

    const { data: getCategoriesRes } = useGetCategoriesQuery();
    const { data: getSubCategoriesRes } = useGetSubCategoriesQuery();
    const { data: getSubcategoryByCategoryId } = useGetSubcategoryByCategoryIdQuery({ categoryId: watch()?.categoryId }, { skip: !watch()?.categoryId });

    useEffect(() => {
        if (!isStatusInclude(getCategoriesRes?.status)) return;

        // Default to empty array for safety
        const data = isValidArray(getCategoriesRes?.data) ? getCategoriesRes.data : [];

        // Filter only "Report" types, then map to the desired shape
        const categoryData = data
            .filter((item) => item?.type === "Report") // Only include "Report" items
            .map((item) => {
                return {
                    label: item?.name,
                    value: item?._id,
                    ...item, // Spread the rest of the item's properties
                };
            });

        setCategoriesData(categoryData);
    }, [getCategoriesRes]);

    useEffect(() => {
        if (!isStatusInclude(getSubcategoryByCategoryId?.status)) return;
        const categoryData =
            isValidArray(getSubcategoryByCategoryId?.data) &&
            getSubcategoryByCategoryId?.data?.map((getCategoriesResItem) => {
                return {
                    label: getCategoriesResItem?.name,
                    value: getCategoriesResItem?._id,
                    ...getCategoriesResItem,
                };
            });
        setSubCategoriesData(categoryData);
    }, [getSubcategoryByCategoryId]);

    const onSubmit = (data) => {};

    const reportFormData = useSelector(({ reportForm }) => reportForm?.reportForm?.data);

    const handleFieldChange = (name, value, onChange) => {
        actions?.reportForm?.createReportForm({ ...form.getValues(), [name]: value });
        if (typeof onChange === "function") onChange(value);
    };

    useEffect(() => {
        if (reportFormData && typeof reportFormData === "object" && isLoadingEditor) {
            setFormValues(reportFormData, setValue);
        }
    }, [reportFormData, setValue, tabValue, isLoadingEditor]);

    const handleChange = (e, newValue) => setTabValue(newValue);

    return (
        <Box>
            <Grid container spacing={0} sx={{ height: "calc(100vh - 130px)" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ position: "relative", height: "100%", overflow: "auto", borderRight: "1px solid #000" }}>
                        <Typography
                            sx={{ fontWeight: 500, fontSize: "20px", position: "sticky", top: 0, p: 1, px: 2, bgcolor: "#fff", width: "100%", zIndex: 7 }}
                            component={"p"}
                        >
                            Report Details
                        </Typography>
                        <Box sx={{ position: "absolute", width: "100%", overflow: "auto", px: 2 }}>
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.REPORT_TITLE}
                                title={"Title"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.REPORT_TITLE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.REPORT_SUBTITLE}
                                title={"Sub Title"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.REPORT_SUBTITLE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.REPORT_DESCRIPTION}
                                title={"Report Discription"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.REPORT_DESCRIPTION, e?.target?.value)}
                                requiredDot={false}
                            />
                            <Controller
                                control={control}
                                name={REPORT_CREATE_EDIT?.CATEGORY_ID}
                                render={({ field: { value, onChange } }) => {
                                    const selectedValue = (isValidArray(categoriesData) && categoriesData?.find((option) => option?.value === value)) || null;
                                    return (
                                        <Box>
                                            <Label title={"Categories"} requiredDot={true} />
                                            <Autocomplete
                                                value={selectedValue}
                                                onChange={(event, newValue) => {
                                                    handleFieldChange(REPORT_CREATE_EDIT.CATEGORY_ID, newValue?.value, onChange);
                                                }}
                                                options={isValidArray(categoriesData) ? categoriesData : []}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={REPORT_CREATE_EDIT?.SUBCATEGORY_ID}
                                render={({ field: { value, onChange, name } }) => {
                                    const selectedValue =
                                        (isValidArray(subCategoriesData) && subCategoriesData?.find((option) => option?.value === value)) || null;
                                    return (
                                        <Box>
                                            <Label title={"Sub Categories"} requiredDot={true} />
                                            <Autocomplete
                                                value={selectedValue}
                                                onChange={(event, newValue) => {
                                                    handleFieldChange(REPORT_CREATE_EDIT.SUBCATEGORY_ID, newValue?.value, onChange);
                                                }}
                                                options={isValidArray(subCategoriesData) ? subCategoriesData : []}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                    );
                                }}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.SINGLE_USER_PRICE}
                                title={"Excel Data Pack License"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.SINGLE_USER_PRICE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.BUSINESS_PRICE}
                                title={"Single User License"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.BUSINESS_PRICE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.ENTREPRENEUR_PRICE}
                                title={"Enterprise License Price"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.ENTREPRENEUR_PRICE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.INTERNET_HANDLING_CHARGE}
                                title={"Internet handling Charge"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.INTERNET_HANDLING_CHARGE, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.PAGES}
                                title={"Pages"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.PAGES, e?.target?.value)}
                                requiredDot={true}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.AUTHOR}
                                title={"Author Name"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.AUTHOR, e?.target?.value)}
                                requiredDot={true}
                            />
                            <Controller
                                control={control}
                                name={REPORT_CREATE_EDIT?.AVAILABLE_IN}
                                render={({ field: { value, onChange } }) => {
                                    // Ensure value is an array; convert string to array if needed
                                    const selectedFormats = Array.isArray(value) ? value : value ? value.split(",").filter(Boolean) : [];

                                    const handleCheckboxChange = (format) => {
                                        // Toggle the format in the array
                                        const updatedFormats = selectedFormats.includes(format)
                                            ? selectedFormats.filter((item) => item !== format)
                                            : [...selectedFormats, format];
                                        handleFieldChange?.(REPORT_CREATE_EDIT.AVAILABLE_IN, updatedFormats?.toString(), onChange);
                                    };

                                    return (
                                        <Box>
                                            <Label title="File Types" requiredDot={true} />
                                            <FormGroup>
                                                {FILE_TYPES.map((type) => (
                                                    <FormControlLabel
                                                        key={type}
                                                        control={
                                                            <Checkbox
                                                                value={type}
                                                                checked={selectedFormats.includes(type)}
                                                                onChange={() => handleCheckboxChange(type)}
                                                            />
                                                        }
                                                        label={type}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </Box>
                                    );
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Box sx={{ position: "relative", height: "100%", overflow: "auto" }}>
                        <Box sx={{ position: "absolute", width: "100%", width: "100%", typography: "body1" }}>
                            <TabContext value={tabValue}>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 10,
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="report tabs"
                                        sx={{
                                            "& .MuiTab-root": {
                                                color: "#000", // Default tab color
                                                p: 3,
                                                fontSize: "16px",
                                            },
                                            "& .MuiTab-root.Mui-selected": {
                                                color: "#fff", // Active tab text color
                                                backgroundColor: "#5AB1E0", // Active tab background color
                                                borderBottom: "none",
                                            },
                                        }}
                                    >
                                        <Tab label="Report Overview" value="1" />
                                        <Tab label="Table of Contents" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ padding: 0, height: "100%" }}>
                                    <Controller
                                        control={control}
                                        name={REPORT_CREATE_EDIT?.REPORT_OVERVIEW}
                                        render={({ field: { value, onChange, name } }) => {
                                            return (
                                                <>
                                                    <TextEditor
                                                        value={value}
                                                        onChange={(e) => handleFieldChange(name, e?.html, onChange)}
                                                        isLoadingEditor={(boolean) => setIsLoadingEditor(boolean)}
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel value="2" sx={{ padding: 0, height: "100%" }}>
                                    <Controller
                                        control={control}
                                        name={REPORT_CREATE_EDIT?.TABLE_OF_CONTENT}
                                        render={({ field: { value, onChange, name } }) => {
                                            return (
                                                <>
                                                    <TextEditor
                                                        value={value}
                                                        onChange={(e) => handleFieldChange(name, e?.html, onChange)}
                                                        isLoadingEditor={(boolean) => setIsLoadingEditor(boolean)}
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Report;
