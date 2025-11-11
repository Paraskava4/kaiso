import axiosInstance from '../../utils/axiosInstance';

// Fetch all reports
// GET /report/getAllReport
// Returns an array of report objects
export const getAllReports = () =>
  axiosInstance
    .get('/report/getAllReport')
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });

// Get report by ID
// GET /web/getReportById?reportId={id}
// Returns a single report object
export const getReportById = (reportId) =>
  axiosInstance
    .get('/web/getReportById', { params: { reportId } })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return { error: true, message: error?.response?.data?.message || error.message || 'API error', status: error?.response?.status || 500 };
    });
