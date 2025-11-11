"use client";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import EntityForm from "../../../components/shared/EntityForm";
import DividerLine from "../../../components/shared/DividerLine";
import { updateSiteMenu, updateSiteSubMenu, updateSiteMenuWithImage, updateSiteSubMenuWithImage, fetchMenus, fetchSubMenus } from "../../../api/pages";
import { setMenus, setSubMenus, updateSEOForm } from "../../../redux/pages/pagesSlice";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import EntityButton from "../../../components/shared/EntityButton";
import { toast } from "react-hot-toast";
import { useAccess } from "@/utils/constants/accessContext";

const SEOEditorPanel = () => {
    const dispatch = useDispatch();
    const initialValues = useSelector((state) => state.pages.seoForm);
    const selectedMenuId = useSelector((state) => state.pages.selectedMenuId);
    const selectedPageId = useSelector((state) => state.pages.selectedPageId);
    const pages = useSelector((state) => state.pages.pages);
    const { isButtonDisabled } = useAccess();

    const menus = useSelector((state) => state.pages.menus);
    const subMenus = useSelector((state) => state.pages.subMenus);

    // Add a ref for EntityForm
    const formRef = useRef();

    // Get the currently selected page to check if it's Industries
    const selectedPage = React.useMemo(() => {
        if (!selectedPageId) return null;
        return pages.find((p) => p._id === selectedPageId) || null;
    }, [selectedPageId, pages]);

    // Check if the selected page is Industries
    const isIndustriesPage = React.useMemo(() => {
        if (!selectedPage) return false;
        return selectedPage.name === "Industries" || selectedPage.title === "Industries";
    }, [selectedPage]);

    // Get the currently selected menu/submenu to check for categoryId
    const selectedMenu = React.useMemo(() => {
        if (!selectedMenuId) return null;

        // First check in subMenus (they have subCategoryId)
        const subMenu = subMenus.find((s) => s._id === selectedMenuId);
        if (subMenu) return subMenu;

        // Then check in menus (they have categoryId)
        const menu = menus.find((m) => m._id === selectedMenuId);
        return menu || null;
    }, [selectedMenuId, menus, subMenus]);

    // Check if the selected menu has a categoryId or subCategoryId
    const hasCategoryId = React.useMemo(() => {
        if (!selectedMenu) return false;
        return !!(selectedMenu.categoryId || selectedMenu.subCategoryId);
    }, [selectedMenu]);

    // Get dynamic values for Industries pages
    const getDynamicValues = React.useMemo(() => {
        if (!isIndustriesPage || !selectedMenu?.categoryId) {
            return {
                pageName: selectedMenu?.name || initialValues?.pageName || "",
                urlSlug: selectedMenu?.url || initialValues?.urlSlug || "",
                pageUrl: selectedMenu?.pageUrl || initialValues?.pageUrl || ""
            };
        }

        // For Industries pages, use categoryId data
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        return {
            pageName: selectedMenu.categoryId.name || "",
            urlSlug: selectedMenu.categoryId.url || "",
            pageUrl: `${BASE_URL}/report/${selectedMenu.categoryId.url}` || ""
        };
    }, [isIndustriesPage, selectedMenu, initialValues]);

    // Create dynamic initial values for the form
    const dynamicInitialValues = React.useMemo(() => {
        const dynamicValues = getDynamicValues;
        
        return {
            ...initialValues,
            pageName: dynamicValues.pageName,
            urlSlug: dynamicValues.urlSlug,
            pageUrl: dynamicValues.pageUrl,
            titleTag: initialValues.titleTag || "",
            metaDescription: initialValues.metaDescription || "",
            keywords: initialValues.keywords || ""
        };
    }, [initialValues, getDynamicValues]);

    // Dynamically set required for image field and filter fields based on categoryId
    const fields = React.useMemo(() => {
        const baseFields = [
            {
                label: "Page Name",
                name: "pageName",
                required: true,
                placeholder: "Please write a page name",
                type: "text",
                disabled: true,
            },
            {
                label: "Title tag",
                name: "titleTag",
                required: true,
                placeholder: "Use 55-65 characters to describe the page topic",
                type: "text",
            },
            {
                label: "Meta description",
                name: "metaDescription",
                required: true,
                placeholder: "Use 155-165 characters to summarize this page",
                type: "textarea",
                rows: 2,
            },
            {
                label: "Keywords",
                name: "keywords",
                required: false,
                placeholder: "Choose Sub categories",
                type: "textarea",
                rows: 3,
            },
            {
                label: "URL slug",
                name: "urlSlug",
                required: false,
                placeholder: "/ URL slug",
                type: "text",
                disabled: true,
            },
            {
                label: "Page URL",
                name: "pageUrl",
                required: false,
                placeholder: "www.kaiso.com/",
                type: "text",
                disabled: true,
            },
        ];

        // baseFields.push({
        //     label: "Social Share image",
        //     name: "socialShareImage",
        //     required: !initialValues?.existingImage,
        //     placeholder: "Drag & Drop or Click to Upload",
        //     type: "file",
        //     accept: "image/jpeg,image/png,image/svg+xml,image/webp,image/jpg",
        // });

        return baseFields;
    }, [hasCategoryId, initialValues?.existingImage]);

    const handleSubmit = async (formData) => {
        try {
            const isSubMenuFlag = subMenus.some((s) => s._id === selectedMenuId);
            const existing = isSubMenuFlag ? subMenus.find((s) => s._id === selectedMenuId) || {} : menus.find((m) => m._id === selectedMenuId) || {};

            // Prepare payload - for Industries pages, use dynamic values
            const dynamicValues = getDynamicValues;
            
            const payload = {
                ...existing,
                _id: selectedMenuId,
                // For Industries pages with null sitePageId, keep it null
                sitePageId: isIndustriesPage && existing.sitePageId === null ? null : existing.sitePageId,
                name: isIndustriesPage ? dynamicValues.pageName : (formData.pageName || existing.name),
                ...(isSubMenuFlag 
                    ? { siteSubMenuName: isIndustriesPage ? dynamicValues.pageName : (formData.pageName || existing.name) } 
                    : { siteMenuName: isIndustriesPage ? dynamicValues.pageName : (formData.pageName || existing.name) }
                ),
                seoTitle: formData.titleTag,
                metaDescription: formData.metaDescription,
                keywords: formData.keywords,
                url: isIndustriesPage ? dynamicValues.urlSlug : formData.urlSlug,
                pageUrl: isIndustriesPage ? dynamicValues.pageUrl : formData.pageUrl,
                ...(isSubMenuFlag ? { siteSubMenuId: selectedMenuId } : { siteMenuId: selectedMenuId }),
            };

            let updated;
            // Check if there's a new image to upload
            if (formData.socialShareImage && formData.socialShareImage instanceof File) {
                // Create FormData for image upload
                const formDataWithImage = new FormData();

                // Add all payload fields to FormData, handling nested objects properly
                Object.entries(payload).forEach(([key, value]) => {
                    // Handle sitePageId specially - if null, send null directly
                    if (key === 'sitePageId') {
                        if (value === null) {
                            formDataWithImage.append('sitePageId', 'null');
                        } else if (typeof value === 'object' && value._id) {
                            formDataWithImage.append('sitePageId', value._id);
                        } else {
                            formDataWithImage.append('sitePageId', value);
                        }
                    } else if (value !== null && value !== undefined) {
                        if (key === 'siteMenuId' && typeof value === 'object' && value._id) {
                            // Handle siteMenuId specifically - send just the _id
                            formDataWithImage.append('siteMenuId', value._id);
                        } else if (key === 'categoryId' && value && typeof value === 'object' && value._id) {
                            // Handle categoryId specifically - send just the _id
                            formDataWithImage.append('categoryId', value._id);
                        } else if (key === 'subCategoryId' && value && typeof value === 'object' && value._id) {
                            // Handle subCategoryId specifically - send just the _id
                            formDataWithImage.append('subCategoryId', value._id);
                        } else if (Array.isArray(value)) {
                            // Handle arrays by stringifying them
                            formDataWithImage.append(key, JSON.stringify(value));
                        } else if (typeof value === 'object') {
                            // Skip other objects that might cause issues
                            console.warn(`Skipping object field ${key}:`, value);
                        } else {
                            // Handle primitive values
                            formDataWithImage.append(key, value.toString());
                        }
                    }
                });

                // Add the image file
                formDataWithImage.append('image', formData.socialShareImage);

                // Call the appropriate API with FormData
                const response = isSubMenuFlag
                    ? await updateSiteSubMenuWithImage(formDataWithImage)
                    : await updateSiteMenuWithImage(formDataWithImage);

                updated = response;
            } else {
                // No image, use regular update
                updated = isSubMenuFlag ? await updateSiteSubMenu(payload) : await updateSiteMenu(payload);
            }

            // Check if the update was successful
            if (updated && updated._id) {
                if (isSubMenuFlag) {
                    dispatch(setSubMenus(subMenus.map(s => s._id === updated._id ? updated : s)));
                } else {
                    dispatch(setMenus(menus.map(m => m._id === updated._id ? updated : m)));
                }
                dispatch(updateSEOForm(formData));
                toast.success('Updated successfully');
            } else {
                let errorMessage = 'Update failed';
                if (updated?.message) {
                    errorMessage = updated.message;
                }
                toast.error(errorMessage);
            }

            // Fetch latest menus and subMenus from backend
            const [menusData, subMenusData] = await Promise.all([fetchMenus(), fetchSubMenus()]);

            // Only dispatch if the data is valid (not an error object)
            if (Array.isArray(menusData)) {
                dispatch(setMenus(menusData));
            } else if (menusData?.error) {
                console.error('Failed to fetch menus:', menusData.message);
            }

            if (Array.isArray(subMenusData)) {
                dispatch(setSubMenus(subMenusData));
            } else if (subMenusData?.error) {
                console.error('Failed to fetch subMenus:', subMenusData.message);
            }
        } catch (error) {
            console.error('Failed to update:', error);

            // Extract a more specific error message
            let errorMessage = 'Update failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleCancel = () => {
        dispatch(updateSEOForm({}));
    };

    return (
        <section className="flex-1 bg-white p-5 ">
            <header className="flex justify-between items-center text-lg font-medium text-zinc-800">
                <Typography variant="h6">SEO Editor</Typography>
                <Box display="flex" gap={2}>
                    {/* Save button now triggers form submit via ref */}
                    <EntityButton
                        type="button"
                        onClick={() => formRef.current && formRef.current.submit()}
                        className="!bg-[#163272] !rounded-lg !px-10 !py-2.5 text-white"
                        disabled={isButtonDisabled("create") || isButtonDisabled("update")}
                    >
                        save
                    </EntityButton>
                    <EntityButton type="button" onClick={handleCancel} className="!bg-[#D62035] !rounded-lg !px-10 !py-2.5 text-white">
                        Cancel
                    </EntityButton>
                </Box>
            </header>
            <DividerLine />
            <EntityForm
                sx={{ boxShadow: "none" }}
                ref={formRef}
                title="Edit SEO Settings"
                fields={fields}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={dynamicInitialValues}
                showCloseButton={false}
                showActions={false}
            />
        </section>
    );
};

export default SEOEditorPanel;
