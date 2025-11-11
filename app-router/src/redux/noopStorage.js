/**
 * No-op storage for Redux Persist during SSR
 * Prevents "redux-persist failed to create sync storage" errors
 */
export const createNoopStorage = () => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, value) {
            return Promise.resolve(value);
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

