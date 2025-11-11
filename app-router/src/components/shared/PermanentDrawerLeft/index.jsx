import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FileText, Globe, Settings as SettingsIcon, ArrowLeft } from "lucide-react";
import { IconButton, Button, FormControl, Select, MenuItem } from "@mui/material";
import { actions } from "@/redux/store";
import { useSelector } from "react-redux";
import Report from "./Report";
import SEO from "./SEO";
import Settings from "./Settings";
import { defaultCreateUpdateReportValue, defaultReportSettings } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setFormValues } from "@/utils/constants/api/formData";
import { useCreateReportReqMutation, useUpdateButtonReportMutation, useUpdateReportReqMutation } from "@/api/reports/report";
import { API } from "@/utils/constants/api/schemas";
import { convertToISOStrings } from "../dateFormat";
import AdminHeader from "../AdminHeader";
import { isStatusInclude } from "@/utils/axiosInstance";
import toast from "react-hot-toast";

const drawerWidth = 82;
const { REPORT_CREATE_EDIT } = API;

const menuObject = [
    { name: "Report", icon: <FileText className="w-5 h-5" />, id: "report" },
    { name: "SEO", icon: <Globe className="w-5 h-5" />, id: "seo" },
    { name: "Settings", icon: <SettingsIcon className="w-5 h-5" />, id: "settings" },
];

export function getFirstThreeWordsSlug(input) {
    if (typeof input !== "string") return "";

    // Split by spaces, filter out empty parts, take first 3
    const words = input.trim().split(/\s+/).slice(0, 3);

    // Join with underscores and lowercase
    return words.join("_").toLowerCase();
}

export default function ClippedDrawer({ modalData }) {
    const [selectedItem, setSelectedItem] = React.useState(modalData?.selected || "Report");
    const [formSubmit, setFormSubmit] = useState(false);

    const { open, data } = useSelector((state) => state?.modal?.createReport);
    const handleClose = () => {
        actions.modal.closeCreateReport();
        actions?.reportForm?.createReportForm();
    };

    const isEdit = data?.data;

    const [createReportReq] = useCreateReportReqMutation();
    const [updateReportReq] = useUpdateReportReqMutation();
    const [updateReportButtonSettingButtonReq] = useUpdateButtonReportMutation();

    const form = useForm({
        defaultValues: defaultCreateUpdateReportValue,
        resolver: yupResolver(Validation.REPORT_CREATE_UPDATE),
    });

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = form;


    const reportSettingForm = useForm({
        defaultValues: defaultReportSettings,
        // resolver: yupResolver(Validation.REPORT_CREATE_UPDATE),
    });

    const { handleSubmit: reportSettingSubmit, control: reportSettingControl, setValue: reportSetValue } = reportSettingForm;

    const reportFormData = useSelector(({ reportForm }) => reportForm?.reportForm?.data);

    useEffect(() => {
        if (errors?.[REPORT_CREATE_EDIT?.URL]?.message) {
            toast?.error(`URL slug error : ${errors?.[REPORT_CREATE_EDIT?.URL]?.message}`);
        }
    }, [errors]);

    useEffect(() => {
        if (reportFormData && typeof reportFormData === "object") {
            setFormValues(reportFormData, setValue);
            let result = reportFormData?.[REPORT_CREATE_EDIT?.URL]?.replace(/\/report\//g, ""); // using regex with 'g' for
            setValue(REPORT_CREATE_EDIT?.URL, result);
        }
    }, [reportFormData, setValue]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const onSubmit = async (data) => {
        const finalObjectSendInApi = data?.[REPORT_CREATE_EDIT?.URL]
            ? { ...data, [REPORT_CREATE_EDIT?.PUBLISH_DATE]: convertToISOStrings(data?.[REPORT_CREATE_EDIT?.PUBLISH_DATE]) }
            : {
                  ...data,
                  [REPORT_CREATE_EDIT?.URL]: getFirstThreeWordsSlug(data?.[REPORT_CREATE_EDIT?.REPORT_TITLE]),
                  [REPORT_CREATE_EDIT?.PUBLISH_DATE]: convertToISOStrings(data?.[REPORT_CREATE_EDIT?.PUBLISH_DATE]),
              };

        const response = isEdit?._id
            ? await updateReportReq({
                  ...finalObjectSendInApi,
                  reportId: isEdit?._id,
              })
            : await createReportReq({
                  ...finalObjectSendInApi,
              });
        if (isStatusInclude(response?.data?.status)) {
            handleClose();
        }
    };

    const reportButtonCreate = async (data) => {
        const response = await updateReportButtonSettingButtonReq(data);
        if (isStatusInclude(response?.data?.status)) {
            setFormSubmit(true);
            handleClose();
        }
    };

    // const dataCreateFunction = async (data) => {
    //     if (selectedItem === "Settings") {
    //         await reportButtonCreate(data);
    //     } else {
    //         await onSubmit(data);
    //     }
    // };

    const handleFieldChange = (name, value, onChange) => {
        actions?.reportForm?.createReportForm({ ...form.getValues(), [name]: value });
        if (typeof onChange === "function") onChange(value);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#FFFFFF", color: "dark" }}>
                <AdminHeader />
                <Toolbar sx={{ boxShadow: "none" }}>
                    <IconButton edge="start" onClick={handleClose} aria-label="close">
                        <ArrowLeft className="w-5 h-5" />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, color: "#000" }} variant="h6" component="div">
                        Reports Create
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {selectedItem === "Settings" ? (
                            <Button
                                variant="contained"
                                sx={{ px: 3, borderRadius: "6px", backgroundColor: "#163272", fontSize: "1rem" }}
                                autoFocus
                                onClick={reportSettingSubmit(reportButtonCreate)}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ px: 3, borderRadius: "6px", backgroundColor: "#163272", fontSize: "1rem" }}
                                autoFocus
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        )}
                        <Controller
                            control={control}
                            name={REPORT_CREATE_EDIT?.STATUS}
                            render={({ field: { value, onChange, name } }) => {
                                return (
                                    <FormControl>
                                        <Select
                                            value={value}
                                            onChange={(e) => {
                                                handleFieldChange(name, e?.target?.value, onChange);
                                            }}
                                            sx={{ px: 3, borderRadius: "6px", fontSize: "1rem" }}
                                        >
                                            <MenuItem value={"Active"}>Active</MenuItem>
                                            <MenuItem value={"Draft"}>Draft</MenuItem>
                                            <MenuItem value={"Archive"}>Archive</MenuItem>
                                        </Select>
                                    </FormControl>
                                );
                            }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <Toolbar />
                <Box sx={{ overflow: "auto", p: 1 }}>
                    <List>
                        {menuObject.map((item) => (
                            <ListItem key={item.name}>
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: selectedItem === item.name ? "#e0e0e0" : "transparent", // Highlight selected item
                                    }}
                                    onClick={() => handleItemClick(item.name)}
                                >
                                    <ListItemIcon
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            minWidth: "auto",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            fontSize: "10px",
                                            textAlign: "center",
                                            margin: 0,
                                        }}
                                    >
                                        {item.name}
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Toolbar />
                <Toolbar />{" "}
                <Box component={"form"}>
                    {selectedItem === "Report" && <Report />}
                    {selectedItem === "SEO" && <SEO errors={errors} />}
                </Box>
                <Box component={"form"}>
                    {selectedItem === "Settings" && (
                        <Settings setValue={reportSetValue} form={reportSettingForm} control={reportSettingControl} formSubmit={formSubmit} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
