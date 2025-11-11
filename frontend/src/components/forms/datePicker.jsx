import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CommonDatePicker = (props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={props.value || null}
                {...props}
                sx={{ width: "100%" }}

                // onError={() => showErrorToast("Please select proper date")}
                //   slots={{ openPickerIcon: CalendarIcon,...props?.slots }}
            />
        </LocalizationProvider>
    );
};

export default CommonDatePicker;
