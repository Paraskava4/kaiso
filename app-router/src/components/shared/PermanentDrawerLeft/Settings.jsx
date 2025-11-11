import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Tab,
    TextField,
    Typography
} from "@mui/material";
import { InputItem } from "../forms";
import { Controller } from "react-hook-form";
import { API } from "@/utils/constants/api/schemas";
import TextEditor from "../textEditer";
import { setFormValues } from "@/utils/constants/api/formData";
import { useGetButtonReportQuery } from "@/api/reports/report";
import { isStatusInclude } from "@/utils/axiosInstance";
import { TabContext, TabList } from "@mui/lab";
import Image from "next/image";
import { Upload } from "lucide-react";

const { REPORTING_SETTING } = API;

const Settings = ({ setValue, form, control }) => {
    const [isLoadingEditor, setIsLoadingEditor] = useState(false);
    const [reportButtonSettings, setReportButtonSettings] = useState();
    const [imagePreview, setImagePreview] = useState(null);

    const { data: buttonReportSettings } = useGetButtonReportQuery();

    useEffect(() => {
        if (!isStatusInclude(buttonReportSettings?.status)) {
            return;
        }

        const newSettings = {
            ...buttonReportSettings?.data,
            [REPORTING_SETTING?.REPORT_BUTTON_ID]: buttonReportSettings?.data?._id,
        };
        setReportButtonSettings(newSettings);
    }, [buttonReportSettings]);

    useEffect(() => {
        if (reportButtonSettings && typeof reportButtonSettings === "object") {
            setFormValues(reportButtonSettings, setValue);

            const url = reportButtonSettings?.socialShareImage;

            if (url) {
                setImagePreview(url);
                setValue("socialShareImage", url);
            }
        }
    }, [setValue, reportButtonSettings]);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
                setValue("socialShareImage", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
                setValue("socialShareImage", file);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box>
            <Grid container spacing={0} sx={{ height: "calc(100vh - 130px)" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "100%",
                            overflow: "auto",
                            borderRight: "1px solid #000",
                            px: 2,
                        }}
                    >
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0,
                                pt: 2,
                                bgcolor: "#fff",
                                width: "100%",
                                zIndex: 7,
                            }}
                            component={"div"}
                        >
                            <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>Settings</Typography>
                            <Typography>Rename the buttons</Typography>
                        </Box>
                        <InputItem form={form} name={REPORTING_SETTING?.REQUEST_BUTTON} title={"Request for a sample"} />
                        <InputItem form={form} name={REPORTING_SETTING?.BUY_BUTTON} title={"Buy Now"} />
                        <InputItem form={form} name={REPORTING_SETTING?.INQUIRE_BUTTON} title={"Inquiry Before Buying"} />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#83838C" }}>
                                Domain image
                            </Typography>
                            <Box
                                sx={{
                                    border: "2px dashed #ddd",
                                    borderRadius: 1,
                                    p: 3,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": {
                                        borderColor: "#999",
                                        bgcolor: "#f9f9f9",
                                    },
                                    minHeight: 120,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => document.getElementById("image-upload").click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()}
                                onDragLeave={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: "none" }}
                                />

                                {imagePreview ? (
                                    <Box sx={{ textAlign: "center" }}>
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: 80,
                                                borderRadius: 4,
                                                marginBottom: 8,
                                            }}
                                            width={100}
                                            height={100}
                                            quality={100}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Click to change image
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: "center" }}>
                                        <Upload className="w-10 h-10 text-[#999] mb-1" />
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Upload Background
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Click to browse or drag & drop image here
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Box sx={{ height: "100%", overflow: "auto" }}>
                        <TabContext value={"1"}>
                            <TabList
                                aria-label="report tabs"
                                sx={{
                                    "& .MuiTab-root": {
                                        color: "#000",
                                        p: 3,
                                        fontSize: "16px",
                                    },
                                    "& .MuiTab-root.Mui-selected": {
                                        color: "#000",
                                        backgroundColor: "#fff",
                                        borderBottom: "none",
                                    },
                                }}
                            >
                                <Tab label="Research Methodology" value="1" />
                            </TabList>
                        </TabContext>
                        <Controller
                            control={control}
                            name={REPORTING_SETTING?.RESEARCH_METHODOLOGY}
                            render={({ field: { value, onChange } }) => (
                                <TextEditor
                                    value={value}
                                    onChange={(e) => onChange(e?.html)}
                                    isLoadingEditor={(boolean) => {
                                        setIsLoadingEditor(boolean);
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
