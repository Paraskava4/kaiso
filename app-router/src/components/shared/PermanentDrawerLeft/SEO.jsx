import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Checkbox, FormControlLabel, FormGroup, Grid, Input, InputAdornment, Tab, TextField, Typography } from "@mui/material";
import { ErrorMessage, InputItem, Label } from "../forms";
import { Controller, useForm } from "react-hook-form";
import { defaultCreateUpdateReportValue } from "@/utils/constants/api/defaultValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { Validation } from "@/utils/constants/api/validation";
import { API } from "@/utils/constants/api/schemas";
import TextEditor from "../textEditer";
import { useSelector } from "react-redux";
import { actions } from "@/redux/store";
import { setFormValues } from "@/utils/constants/api/formData";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CommonDatePicker from "@/components/forms/datePicker";
import { getFirstThreeWordsSlug } from ".";

const { REPORT_CREATE_EDIT } = API;
const SEO = ({ errors }) => {
    const [tabValue, setTabValue] = useState("1");

    const form = useForm({
        defaultValues: defaultCreateUpdateReportValue,
        resolver: yupResolver(Validation.REPORT_CREATE_UPDATE),
    });

    const { handleSubmit, watch, control, setValue } = form;

    const onSubmit = (data) => {};

    const reportFormData = useSelector(({ reportForm }) => reportForm?.reportForm?.data);

    const handleFieldChange = (name, value, onChange) => {
        actions?.reportForm?.createReportForm({ ...form.getValues(), [name]: value });
        if (typeof onChange === "function") onChange(value);
    };

    useEffect(() => {
        if (reportFormData && typeof reportFormData === "object") {
            setFormValues(reportFormData, setValue);
            let result = reportFormData?.url?.replace(/\/report\//g, ""); // using regex with 'g' for
            setValue(REPORT_CREATE_EDIT?.URL, result);
        }
    }, [reportFormData, setValue]);

    const handleChange = (e, newValue) => setTabValue(newValue);

    return (
        <Box>
            <Grid container spacing={0} sx={{ height: "calc(100vh - 64px)" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ position: "relative", height: "100%", overflow: "auto", borderRight: "1px solid #000" }}>
                        <Typography
                            sx={{ fontWeight: 500, fontSize: "20px", position: "sticky", top: 0, p: 1, px: 2, bgcolor: "#fff", width: "100%", zIndex: 7 }}
                            component={"p"}
                        >
                            Seo Editor
                        </Typography>
                        <Box sx={{ position: "absolute", width: "100%", overflow: "auto", px: 2 }}>
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.SEO_TITLE}
                                title={"Title tag"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.SEO_TITLE, e?.target?.value)}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.META_DESCRIPTION}
                                title={"Meta description"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.META_DESCRIPTION, e?.target?.value)}
                            />
                            <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.KEYWORDS}
                                title={"Keywords"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.KEYWORDS, e?.target?.value)}
                            />
                            {/* <InputItem
                                form={form}
                                name={REPORT_CREATE_EDIT?.URL}
                                title={"URL slug"}
                                onInput={(e) => handleFieldChange(REPORT_CREATE_EDIT.URL, e?.target?.value)}
                            /> */}
                            <Controller
                                control={control}
                                name={REPORT_CREATE_EDIT?.URL}
                                render={({ field: { value, onChange, name } }) => {
                                    const defaultValue = value ? value : getFirstThreeWordsSlug(watch()?.[REPORT_CREATE_EDIT?.REPORT_TITLE]);
                                    return (
                                        <>
                                            <Label title={"URL slug"} />
                                            <TextField
                                                value={defaultValue}
                                                onChange={(e) => handleFieldChange(name, e?.target?.value, onChange)}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">/report/</InputAdornment>,
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
                                name={REPORT_CREATE_EDIT?.PUBLISH_DATE}
                                render={({ field: { value, onChange, name } }) => {
                                    return (
                                        <>
                                            <Label title={"Publisher Date"} />
                                            <CommonDatePicker
                                                format={"dd/MM/yyyy"}
                                                value={new Date(value)}
                                                onChange={(e) => handleFieldChange(name, e, onChange)}
                                            />
                                        </>
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
                                        backgroundColor: "background.paper",
                                        overflow: "auto",
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
                                            return <TextEditor value={value} onChange={(e) => handleFieldChange(name, e?.html, onChange)} />;
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel value="2" sx={{ padding: 0, height: "100%" }}>
                                    <Controller
                                        control={control}
                                        name={REPORT_CREATE_EDIT?.TABLE_OF_CONTENT}
                                        render={({ field: { value, onChange, name } }) => {
                                            return <TextEditor value={value} onChange={(e) => handleFieldChange(name, e?.html, onChange)} />;
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

export default SEO;
