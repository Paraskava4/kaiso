"use client";
import { showErrorToast, showSuccessToast } from "../api/toast";

const isSuccess = (response, msg) => {
    const message = msg || response?.message || response?.data?.message || "Successfull";

    if (isStatusInclude(response?.status || response?.data?.status) && !response?.error) {
        showSuccessToast(message);
        return response;
    } else if (isStatusIncludeError(response?.status || response?.data?.status) && !response?.error) {
        showErrorToast(message);
        return response;
    }
};

export const isStatusInclude = (status) => [200, 201, 202, "success", "Success"].includes(status);
export const isStatusIncludeError = (status) => [400, 404, 401, "fail", "Fail", 500, "Failed"].includes(status);

export default isSuccess;
