/**
 * Filter data based on a specified date range
 * @param {Array} data - The array of data to filter
 * @param {string} range - The range string ('7', '30', or 'all')
 * @param {string} dateField - The field name that contains the date (default: 'time')
 * @returns {Array} - Filtered data array
 */
export const filterByDateRange = (data, range, dateField = "time") => {
    if (!range || range === "all" || !data || data.length === 0) {
        return data; // Return all data if no range specified or 'all' selected
    }

    const now = new Date();
    const days = parseInt(range, 10);

    if (isNaN(days)) {
        return data; // Return all data if range is not a valid number
    }

    // Calculate the cutoff date (7 or 30 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - days);

    // Filter data where the date is after the cutoff date
    return data.filter((item) => {
        // Try to parse the date from the dateField
        let itemDate;

        if (item.rawData?.createdAt) {
            // If we have the raw data with createdAt timestamp
            itemDate = new Date(item.rawData.createdAt);
        } else if (typeof item[dateField] === "string") {
            // If the date is stored as a string in the specified field
            itemDate = new Date(item[dateField]);
        }

        return itemDate && itemDate >= cutoffDate;
    });
};
