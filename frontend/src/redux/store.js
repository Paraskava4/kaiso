// src/admin/redux/store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import _ from "lodash";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { createNoopStorage } from "./noopStorage";

import heroReducer from "./masters/heroSlice";
import newsArticleReducer from "./masters/newsArticleSlice";
import blogReducer from "./blogs/blogSlice";
import publicationReducer from "./masters/publicationSlice";
import reportReducer from "./reports/reportSlice";
import insightReducer from "./masters/insightSlice";
import inquiryReducer from "./inquirySlice";
import careerReducer from "./careerSlice";
import reviewReducer from "./masters/reviewSlice";
import webReviewReducer from "./masters/webReviewSlice";
import pagesReducer from "./pages/pagesSlice";
import modalReducer, { modalSlice } from "./modalSlice";
import adminReducer from "./adminSlice";
import profileReducer from "./profileSlice";
import reportFormReducer, { reportFormSlice } from "./reports/reportFormSlice";
import articleFormReducer, { articleFormSlice } from "./articles/articleFormSlice";
import metaSliceReducer, { metaSlice } from "./metaSlice";
import notificationReducer from "./notificationSlice";
import dashboardReducer from "./dashboardSlice";

import { reportApi } from "../api/reports/report"; // Re-added - used in admin reports
import { categoriesApi } from "@/api/categories";
import { blogCategoriesApi } from "@/api/blogCategories";
import { articlesApi } from "../api/blogs/blog";
import { pageBlogArticleApi } from "@/api/pageBlogArticle";
import { homeApi } from "@/api/home";
import { menuApi } from "@/api/menu";
import { navbarApi } from "../api/navbar";
import { notificationApi } from "../api/notification"; // Re-added - used in admin
import { dashboardApi } from "@/api/dashboard"; // Re-added - used in admin

// Removed duplicate store - using only makeStore with persistence

export const rootReducer = combineReducers({
    hero: heroReducer,
    publication: publicationReducer,
    report: reportReducer,
    insight: insightReducer,
    newsArticle: newsArticleReducer,
    blog: blogReducer,
    inquiry: inquiryReducer,
    career: careerReducer,
    review: reviewReducer,
    webReview: webReviewReducer,
    modal: modalReducer,
    pages: pagesReducer,
    meta: metaSliceReducer,
    admin: adminReducer,
    profile: profileReducer,
    reportForm: reportFormReducer,
    articleForm: articleFormReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer,
    [reportApi.reducerPath]: reportApi.reducer, // Re-added - used in admin reports
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [blogCategoriesApi.reducerPath]: blogCategoriesApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    [pageBlogArticleApi.reducerPath]: pageBlogArticleApi.reducer,
    [homeApi.reducerPath]: homeApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [navbarApi.reducerPath]: navbarApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer, // Re-added - used in admin
    [dashboardApi.reducerPath]: dashboardApi.reducer, // Re-added - used in admin
});

const persistConfig = {
    key: "root",
    storage: typeof window !== 'undefined' ? storage : createNoopStorage(),
    whitelist: ["reportForm", "articleForm"],
    blacklist: ["employeeTab"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        })
            .concat(reportApi.middleware) // Re-added - used in admin reports
            .concat(categoriesApi.middleware)
            .concat(blogCategoriesApi.middleware)
            .concat(articlesApi.middleware)
            .concat(pageBlogArticleApi.middleware)
            .concat(homeApi.middleware)
            .concat(menuApi.middleware)
            .concat(navbarApi.middleware)
            .concat(notificationApi.middleware) // Re-added - used in admin
            .concat(dashboardApi.middleware), // Re-added - used in admin
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

// Preload critical data for better performance (temporarily disabled to prevent reload loops)
// if (typeof window !== 'undefined') {
//     setTimeout(() => {
//         import('../utils/cacheManager').then(({ preloadCriticalData }) => {
//             preloadCriticalData();
//         });
//     }, 1000); // Delay to ensure store is ready
// }

export default store;

// Keep makeStore for backward compatibility if needed elsewhere
export const makeStore = store;

const createActions = (slice) => _.mapValues(slice?.actions || {}, (actionCreator) => (payload) => store.dispatch(actionCreator(payload)));

export const actions = {
    modal: createActions(modalSlice),
    reportForm: createActions(reportFormSlice),
    articleForm: createActions(articleFormSlice),
    meta: createActions(metaSlice),
};
