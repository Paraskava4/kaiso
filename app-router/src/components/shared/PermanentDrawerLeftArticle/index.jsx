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
import { FileText, Globe, Settings, ArrowLeft } from "lucide-react";
import { IconButton, Button, FormControl, Select, MenuItem } from "@mui/material";
import { actions } from "@/redux/store";
import { useSelector } from "react-redux";
import Article from "./Article";
import ArticleSeo from "./ArticleSeo";
import { defaultCreateUpdateArticleValue } from "@/utils/constants/api/defaultValue";
import { Validation } from "@/utils/constants/api/validation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setFormValues } from "@/utils/constants/api/formData";
import { useCreateArticleMutation, useUpdateArticleMutation } from "@/api/blogs/blog";
import { API } from "@/utils/constants/api/schemas";
import { convertToISOStrings } from "../dateFormat";
import AdminHeader from "../AdminHeader";
import { isStatusInclude } from "@/utils/axiosInstance";
import toast from "react-hot-toast";

const drawerWidth = 82;
const { ARTICLE_CREATE_EDIT } = API;

const menuObject = [
    { name: "Article", icon: <FileText className="w-5 h-5" />, id: "article" },
    { name: "SEO", icon: <Globe className="w-5 h-5" />, id: "seo" },
    // { name: "Settings", icon: <Settings className="w-5 h-5" />, id: "settings" },
];

export default function ClippedDrawer({ modalData }) {
    const [selectedItem, setSelectedItem] = React.useState(modalData?.selected || "Article");
    const [selectDraft, setSelectDraft] = useState("Draft");
    const [imageObj, setImageObj] = useState();

    const { open, data } = useSelector((state) => state?.modal?.createArticle);
    const handleClose = () => {
        actions.modal.closeCreateArticle();
        actions?.articleForm?.createArticleForm();
    };

    const isEdit = data?.data;

    const [createArticle] = useCreateArticleMutation();
    const [updateArticle] = useUpdateArticleMutation();

    const form = useForm({
        defaultValues: defaultCreateUpdateArticleValue,
        resolver: yupResolver(Validation.ARTICLE_CREATE_UPDATE),
    });

    const {
        handleSubmit,
        watch,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = form;

    const articleFormData = useSelector(({ articleForm }) => articleForm?.articleForm?.data);

    useEffect(() => {
        if (errors?.[ARTICLE_CREATE_EDIT?.URL]?.message) {
            toast?.error(`URL slug error : ${errors?.[ARTICLE_CREATE_EDIT?.URL]?.message}`);
        }
    }, [errors]);

    useEffect(() => {
        if (articleFormData && typeof articleFormData === "object") {
            setFormValues(articleFormData, setValue);
            let result = articleFormData?.[ARTICLE_CREATE_EDIT?.URL]?.replace(/\/report\//g, ""); // using regex with 'g' for
            setValue(ARTICLE_CREATE_EDIT?.URL, result);
        }
    }, [articleFormData, setValue]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const onSubmit = async (data) => {
        const mappedData = data?.[ARTICLE_CREATE_EDIT?.URL]
            ? {
                  ...data,
                  [ARTICLE_CREATE_EDIT.PUBLISH_DATE]: convertToISOStrings(data?.[ARTICLE_CREATE_EDIT.PUBLISH_DATE]),
                  [ARTICLE_CREATE_EDIT.BLOG_IMAGE]: imageObj,
                  // [ARTICLE_CREATE_EDIT?.URL]: `${data?.[ARTICLE_CREATE_EDIT?.URL]}`,
              }
            : {
                  ...data,
                  [ARTICLE_CREATE_EDIT.PUBLISH_DATE]: convertToISOStrings(data?.[ARTICLE_CREATE_EDIT.PUBLISH_DATE]),
                  [ARTICLE_CREATE_EDIT.BLOG_IMAGE]: imageObj,
                  [ARTICLE_CREATE_EDIT?.URL]: `${data?.[ARTICLE_CREATE_EDIT?.ARTICLE_TITLE]}`,
              };

        try {
            const response = isEdit?._id
                ? await updateArticle({
                      ...mappedData,
                      blogId: isEdit?._id,
                  })
                : await createArticle(mappedData);

            if (isStatusInclude(response?.data?.status)) {
                toast.success(isEdit?._id ? "Article updated successfully!" : "Article created successfully!");
                handleClose();
            } else {
                toast.error(response?.data?.message || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error submitting article:", error);
            toast.error("Failed to save article. Please try again.");
        }
    };

    const handleFieldChange = (name, value, onChange) => {
        actions?.articleForm?.createArticleForm({ ...form.getValues(), [name]: value });
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
                        {isEdit?._id ? "Article Edit" : "Article Create"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            sx={{ px: 3, borderRadius: "6px", backgroundColor: "#163272", fontSize: "1rem" }}
                            autoFocus
                            onClick={handleSubmit(onSubmit)}
                        >
                            Save
                        </Button>
                        <Controller
                            control={control}
                            name={ARTICLE_CREATE_EDIT?.STATUS}
                            render={({ field: { value, onChange, name } }) => {
                                return (
                                    <FormControl>
                                        <Select
                                            value={value || "Draft"}
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
                <Toolbar />
                <Box component={"form"}>
                    {selectedItem === "Article" && <Article setImageObj={setImageObj} errors={errors} />}
                    {selectedItem === "SEO" && <ArticleSeo setImageObj={setImageObj} errors={errors} />}
                </Box>
            </Box>
        </Box>
    );
}
