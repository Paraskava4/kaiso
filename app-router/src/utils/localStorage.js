// utils/localStorage.ts
export const setLocalStorage = (name, value) => {
    return localStorage.setItem(name, value);
};

export const getLocalStorage = (name) => {
    return localStorage.getItem(name);
};

export const removeLocalStorage = (name) => {
    return localStorage.removeItem(name);
};

export const setSessionStorage = (name, value) => {
    return sessionStorage.setItem(name, value);
};

export const getSessionStorage = (name) => {
    return sessionStorage.getItem(name);
};

export const removeSessionStorage = (name) => {
    return sessionStorage.removeItem(name);
};
