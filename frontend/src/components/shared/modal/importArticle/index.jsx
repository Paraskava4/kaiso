import { Box, Typography, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../../../redux/store";
import CommonModal from "../../commonModal/commonModal";
import { defaultCreateArticleFormCSV } from "@/utils/constants/api/defaultValue";
import DND from "../../dnd";
import { useImportArticlesCSVMutation } from "@/api/blogs/blog";
import { useEffect } from "react";
import { prepareFormData } from "@/utils/constants/api/formData";
import toast from "react-hot-toast";
import { fetchAllArticles } from "../../../../redux/blogs/blogSlice";

const ImportArticle = () => {
    const { open, data } = useSelector((state) => state?.modal?.importArticle);
    const dispatch = useDispatch();
    const handleClose = () => actions.modal.closeImportArticle();

    const [importArticlesCSV, { isLoading }] = useImportArticlesCSVMutation();

    const form = useForm({
        defaultValues: defaultCreateArticleFormCSV,
    });

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = form;

    const onSubmit = async (data) => {
        try {
            if (!data?.csvFile) {
                toast.error("Please select a CSV file to import");
                return;
            }

            console.log("Importing CSV file:", data?.csvFile);

            // Prepare form data for file upload
            const formData = prepareFormData(data);

            const response = await importArticlesCSV(formData).unwrap();

            if (response?.status) {
                toast.success("Articles imported successfully!");

                // Refresh the articles list
                dispatch(fetchAllArticles({ page: 1, limit: 10 }));

                // Reset form and close modal
                reset();
                handleClose();
            } else {
                toast.error(response?.message || "Failed to import articles");
            }
        } catch (error) {
            console.error("Import error:", error);
            toast.error(error?.data?.message || error?.message || "Failed to import articles");
        }
    };

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    const handleDownload = () => {
        // Path to the file in the public folder
        const fileUrl = "/blog_working.csv";

        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "blog_working.csv"; // Name of the file to be downloaded
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <CommonModal open={open} onClose={handleClose} width="sm" title={""}>
            <Box textAlign={"center"}>
                <Typography variant="h6">Import Articles</Typography>
                <Box component={"form"} onSubmit={handleSubmit(onSubmit)} sx={{ my: 2 }}>
                    <Controller
                        control={control}
                        name="csvFile"
                        render={({ field: { value, onChange, name } }) => (
                            <DND value={value} onChange={onChange} name={name} error={errors.csvFile} setValue={setValue} />
                        )}
                    />
                    <Typography sx={{ textAlign: "left", my: 1 }}>
                        Download this CSV
                        <Button sx={{ fontWeight: "bold", p: 0, m: 0, color: "#000" }} onClick={handleDownload}>
                            <Typography sx={{ borderBottom: "1px solid #000" }}>file</Typography>
                        </Button>
                        for import
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2, width: "100%" }}>
                        <Button type="submit" variant="contained" color="error" disabled={isLoading} sx={{ width: "50%", fontSize: "1rem", fontWeight: "400" }}>
                            {isLoading ? "Importing..." : "Submit"}
                        </Button>
                        <Button variant="outlined" sx={{ width: "50%", fontSize: "1rem", fontWeight: "400" }} onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </CommonModal>
    );
};

export default ImportArticle;
