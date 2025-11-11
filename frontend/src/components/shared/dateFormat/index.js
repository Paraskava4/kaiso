import { format, parseISO } from "date-fns";
import { parse } from "date-fns";

export const DateFormatter = (dateString) => {
    // Check if dateString is a valid string
    if (typeof dateString !== "string" || !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        // Return a default date or handle the case accordingly
        return dateString;
    }

    // Parse the dateString to a Date object
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

    // Format the parsed date to the desired format
    const formattedDate = format(parsedDate, "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)");

    return formattedDate;
};

export const DateFormatterOpp = (dateString) => {
    // Check if dateString is a valid string
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
        // Return an empty string or any default value you prefer
        return "-";
    }

    // Parse the dateString to a Date object
    const dateObject = new Date(dateString);

    // Check if the dateObject is a valid Date
    if (isNaN(dateObject.getTime())) {
        // Return an empty string or any default value you prefer
        return "-";
    }

    // Parse the dateString to a Date object
    const formattedDate = format(dateObject, "dd/MM/yyyy");

    // Format the parsed date to the desired format

    return formattedDate;
};

export const convertToFormattedLocalTime = (isoDateString) => {
    // Create a new Date object from the ISO string
    const date = new Date(isoDateString);

    // Define formatting options
    const options = {
        year: "numeric",
        month: "short", // Short month name
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format with AM/PM
    };

    // Format the date as a local time string
    const localDateString = date.toLocaleString("en-US", options);

    return localDateString;
};

export const DateFormatterTimeSecond12 = (dateString) => {
    // Check if dateString is a valid string
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
        // Return an empty string or any default value you prefer
        return "-";
    }

    // Parse the dateString to a Date object
    const dateObject = new Date(dateString);

    // Check if the dateObject is a valid Date
    if (isNaN(dateObject.getTime())) {
        // Return an empty string or any default value you prefer
        return "-";
    }

    // Format the parsed date to the desired format
    const formattedTime = format(dateObject, "hh:mm:ss a");

    return formattedTime;
};

export const DateFormatterTimeSecond = (dateString) => {
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
        return "-";
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        return "-";
    }

    // Use "HH:mm:ss" for 24-hour format
    return format(dateObject, "HH:mm:ss");
};

export const getFormattedMonth = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return "-";
    }
    return format(date, "MM");
};

export const getFormattedYear = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return "-";
    }
    return format(date, "yyyy");
};

export const parseTimeToDate = (timeString) => {
    console.log("timeString <><><><><>", timeString);
    if (!timeString || typeof timeString !== "string") {
        // Return an empty string or any default value you prefer
        return "-";
    }
    const [hours, minutes, seconds] = timeString?.split(":").map(Number);

    const now = new Date();
    now.setHours(hours, minutes, seconds, 0);

    return now;
};

export const parseDateManually = (dateString) => {
    const [day, month, year] = dateString?.split("/");
    return new Date(`${year}-${month}-${day}`);
};

export function convertToYYYYMMDD(dateString) {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    // Combine into YYYY-MM-DD format
    return `${year}-${month}-${day}`;
}

export function convertToUTCTime(dateString) {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Extract the UTC time portion in HH:mm:ss.sssZ format
    const isoString = date.toISOString(); // Full ISO string
    const time = isoString.split("T")[1]; // Split and get the time part

    return time;
}

export function convertToISOString(date, time) {
    // Combine the date and time into a single string
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?Z$/;

    if (!timeRegex.test(time)) {
        return { error: true, message: "Invalid time value. Time must be in the format HH:mm:ss.sssZ", status: 400 };
    }
    const combinedDateTime = `${date}T${time}`;

    // Create a Date object
    const dateObject = new Date(combinedDateTime);

    // Convert to ISO format
    return dateObject.toISOString();
}

export function convertToISO(dateString) {
    if (!dateString || isNaN(new Date(dateString))) {
        return "-";
    }
    const date = new Date(dateString);
    return date.toISOString();
}

export const mergeDateAndTime = (date, time) => {
    if (!date || !time) return null;
    const newDate = new Date(date);
    newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return newDate;
};

export const mergeMonhAndYear = (month, year) => {
    if (!month || !year) return null;

    // Adjust month since Date constructor expects months 0-11
    const adjustedMonth = month - 1;

    // Create a new Date object with the 1st day of the given month and year
    const newDate = new Date(year, adjustedMonth, 1);

    // Format the date as "01/MM/YYYY"
    const formattedDate = newDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};

export function convertToISOStrings(dateString) {
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
        return "";
    }

    // Create a Date object from the input string
    const date = new Date(dateString);

    // Return the ISO 8601 string
    return date.toISOString();
}

export function getMonthFullName(dateInput) {
    const date = new Date(dateInput); // Create a Date object
    return date.toLocaleString("en-US", { month: "long" }); // october
}

export function formatDateStringToMMDDYYYY(inputDateStr) {
    // Check if inputDateStr is a string or Date object
    if (!inputDateStr) return null;

    try {
        // Convert to Date object if it's a string
        const dateObj = inputDateStr instanceof Date ? inputDateStr : new Date(inputDateStr);

        // Validate the date is valid
        if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", inputDateStr);
            return null;
        }

        // Format the date into the desired format (01/MM/YYYY)
        return `01/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return null;
    }
}

export function formatDate(month, year) {
    const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1; // Convert month name to number
    const formattedMonth = monthNumber.toString().padStart(2, "0"); // Ensure two-digit month
    return `01/${formattedMonth}/${year}`;
}

export function formatDateUnderscor(isoString) {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

export const parseIsoTimeToGmtWithConvertTime = (isoString) => {
    if (!isoString || typeof isoString !== "string") return "-";

    try {
        const date = parseISO(isoString); // Convert string to Date object
        return format(date, "hh:mm a"); // Format as "hh:mm AM/PM"
    } catch (error) {
        console.error("Invalid date format:", isoString);
        return "-";
    }
};

// Format date to "10:20AM 10/06/2025" format for inquiry tables
export const formatInquiryDateTime = (dateString) => {
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
        return "-";
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        return "-";
    }

    // Format time as "10:20AM"
    const timeOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    const timeString = dateObject.toLocaleString("en-US", timeOptions);

    // Format date as "10/06/2025"
    const dateOptions = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    };
    const dateString2 = dateObject.toLocaleString("en-US", dateOptions);

    return `${timeString} ${dateString2}`;
};

export const ISO_toDateFormat = (date, formatString) => {
    // Validate input
    if (!date || typeof date !== "string" || isNaN(Date.parse(date))) {
        return "";
    }

    try {
        // Parse ISO date string
        const parsedDate = parseISO(date);

        // Ensure GMT/UTC by converting to Zulu time (UTC)
        const gmtDate = new Date(parsedDate.toUTCString());

        // Format date according to provided format string
        return format(gmtDate, formatString);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};
