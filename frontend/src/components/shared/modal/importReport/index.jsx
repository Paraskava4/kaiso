import { Box, Typography, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { actions } from "../../../../redux/store";
import CommonModal from "../../commonModal/commonModal";
import { defaultCreateReportFormCSV } from "@/utils/constants/api/defaultValue";
import DND from "../../dnd";
import { useCreateReportFormCSVReqMutation } from "@/api/reports/report";
import { isStatusInclude } from "@/utils/axiosInstance";

const ImportReport = () => {
    const { open, data } = useSelector((state) => state?.modal?.importReport);
    const handleClose = () => {
        actions.modal.closeImportReport();
        actions?.articleForm?.createArticleForm();
    };

    const [dataCreateFromCsv] = useCreateReportFormCSVReqMutation();

    const form = useForm({
        defaultValues: defaultCreateReportFormCSV,
        // resolver: yupResolver(Validation.REPORT_CREATE_UPDATE),
    });

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = form;

    const onSubmit = async (data) => {
        const response = await dataCreateFromCsv(data);
        if (isStatusInclude(response?.data?.status)) {
            handleClose();
        }
    };

    const handleDownload = () => {
        // Path to the file in the public folder
        const fileUrl = "/reports_demo.csv";

        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "reports_demo.csv"; // Name of the file to be downloaded
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <CommonModal open={open} onClose={handleClose} width="sm" title={""}>
            <Box textAlign={"center"}>
                <Typography variant="h6">Import Report</Typography>
                <Box component={"form"} onSubmit={handleSubmit(onSubmit)} sx={{ my: 2 }}>
                    <Controller
                        control={control}
                        name="csvFile" // Adjust based on your schema
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
                        <Button type="submit" variant="contained" color="error" sx={{ width: "50%", fontSize: "1rem", fontWeight: "400" }}>
                            Submit
                        </Button>
                        <Button variant="outlined" sx={{ width: "50%", fontSize: "1rem", fontWeight: "400" }} onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </CommonModal>
    );
};

export default ImportReport;
