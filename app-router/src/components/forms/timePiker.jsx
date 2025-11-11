import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { TimePicker } from "@mui/x-date-pickers";

const CommonTimePicker = (props) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
                value={props.value || null}
                {...props}
                // onError={() => showErrorToast("Please select proper date")}
                //   slots={{ openPickerIcon: CalendarIcon,...props?.slots }}
            />
        </LocalizationProvider>
    );
};

export default CommonTimePicker;
