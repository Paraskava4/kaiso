import { isValidArray } from "@/utils/validation/array";

function validateAndPreparePayload(data) {
    const siblings = data || [];
    const arr = [];
    siblings.forEach((sibling, index) => {
        const { studyHere, siblingContact1, siblingLastName, siblingMiddleName, siblingFirstName, siblingPrefix } = sibling;
        const isValid = studyHere !== undefined && siblingContact1 && siblingLastName && siblingMiddleName && siblingFirstName && siblingPrefix;
        if (!isValid && index === 0) return;
        isValid && arr.push(sibling);
    });

    return arr;
}

export const appendIntoFormData = (payload) => {
    const formData = new FormData();
    Object.entries(payload)?.forEach(([name, value]) => {
        if (["subjects"].includes(name)) return isValidArray(value) && formData.append(name, JSON.stringify(value));
        if (["siblings"].includes(name)) {
            const data = validateAndPreparePayload(value);
            return formData.append(name, isValidArray(data) ? JSON.stringify(data) : null);
        }
        if (name === "photo") return formData.append(name, value ?? null);
        value && formData.append(name, value);
    });
    return formData;
};

// Common function for appending payload data in to formdata
export const prepareFormData = (payload) => {
    if (!payload) return null;

    const formData = new FormData();

    Object.entries(payload).forEach(([name, value]) => {
        if (!name || name === "undefined" || [ "createdAt", "updatedAt"].includes(name)) {
            return;
        }

        if (value instanceof File) {
            formData.append(name, value);
        }
        else if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v !== undefined && v !== null) {
                    formData.append(`${name}[]`, v);
                }
            });
        }
        else if (value !== undefined && value !== null && value !== "") {
            formData.append(name, value);
        }
    });

    return formData;
};


export const setFormValues = (formData, setValue) => {
    Object.entries(formData).forEach(([name, value]) => setValue(name, value));
};
