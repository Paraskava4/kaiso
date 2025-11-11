"use client";
import * as Yup from "yup";
import { API } from "./schemas";
import { REGEX } from "./regex";

export const MSG = {
    REQUIRED: "This Field is required",
    REQUIRED_YEAR: "Select a Year",
    MIN_PASSWORD: "Password must be 6 Characters long",
    VALID_STR: "Please Enter Valid Text",
    VALID_COUNT: "Please Enter Valid Count",
    VALID_URL: "Please Enter valid URL",
    VALID_IMG: "Please Enter Valid Image Type",
    VALID_MOBILE: "Invalid mobile number",
    VALID_OTP: "Enter 6 Digite Code",
    VALID_EMAIL: "Please enter a valid email address",
    VALID_IFSC: "Please enter a valid IFSC Code",
    VALID_GSTNO: "Please enter a valid GST Code",
    PASSWORDS_DO_NOT_MATCH: "password does not match ",
    INVALID_HSN_SAC: "Invalid selection. Choose either HSN or SAC",
};

const str = Yup.string().trim(MSG.VALID_STR).nullable();
const required_str = Yup.string().trim(MSG.REQUIRED).required(MSG.REQUIRED);

const validMobile = (value) => (!value ? true : REGEX.MOBILE.test(value));
const validotp = (value) => (!value ? true : REGEX.OTP.test(value));
const validEmail = (value) => (!value ? true : REGEX.EMAIL.test(value));
const validIFSC = (value) => (!value ? true : REGEX.IFSC.test(value));
const validGST = (value) => (!value ? true : REGEX.GST.test(value));

export const acceptedImageTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
};

export const HSN_SAC_ENUM = ["HSN", "SAC", ""];

const {
    LOGIN,
    CODEVERIFICATION,
    VERIFYACCOUNT,
    USERPROFILE,
    ADMIN,
    SERVICES_CREATE_UPDATE,
    PAYEECREATEUPDATE,
    PAYEECREATEUPDATEMAIN,
    PAYEECREATEUPDATESUB,
    SETTING,
    SETTIGBANK,
    INVOICECREATEUPDATE,
    INVOICESERVICESARRAY,
    PAYMENTCREATEUPDATE,
    CONTACTUS,
    PAYMENTDETAIL,
    FORGOTPASSWORD,
    REPORT_CREATE_EDIT,
    ARTICLE_CREATE_EDIT,
} = API;

export const Validation = {
    LOGIN: Yup.object().shape({
        [LOGIN.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [LOGIN.PASSWORD]: required_str,
    }),

    RESET_PASSWORD: Yup.object().shape({
        password: required_str.min(6, MSG.MIN_PASSWORD),
        confirmPassword: required_str.oneOf([Yup.ref("password"), null], MSG.PASSWORDS_DO_NOT_MATCH),
    }),

    VERIFYCODE: Yup.object().shape({
        [API.VERIFYCODE.OTP]: required_str.test("valid-otp", MSG.VALID_OTP, validotp),
    }),

    FORGOTPASSWORD: Yup.object().shape({
        [FORGOTPASSWORD.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
    }),

    CODEVERIFICATION: Yup.object().shape({
        [CODEVERIFICATION.FIRSTNAME]: required_str,
        [CODEVERIFICATION.LASTNAME]: required_str,
        [CODEVERIFICATION.MOBILENO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
    }),

    VERIFYACCOUNT: Yup.object().shape({
        [VERIFYACCOUNT.CODE]: required_str.test("valid-otp", MSG.VALID_OTP, validotp),
    }),

    USERPROFILE: Yup.object().shape({
        [USERPROFILE.PROFILE_IMAGE]: Yup.mixed().nullable(),
        [USERPROFILE.FIRSTNAME]: required_str,
        [USERPROFILE.LASTNAME]: required_str,
        [USERPROFILE.PHONENO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [USERPROFILE.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [USERPROFILE.WHATSAPPNO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
    }),

    ADMIN: Yup.object().shape({
        [ADMIN.FIRSTNAME]: required_str,
        [ADMIN.LASTNAME]: required_str,
        [ADMIN.PHONENO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [ADMIN.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [ADMIN.WHATSAPPNO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [ADMIN.ACCESS_ARRAY]: Yup.array()
            .of(
                Yup.object().shape({
                    menuId: Yup.string().required("ID is required"),
                    read: Yup.boolean(),
                    create: Yup.boolean(),
                    update: Yup.boolean(),
                    delete: Yup.boolean(),
                })
            )
            .required("Access array is required"),
    }),

    SERVICES_CREATE_UPDATE: Yup.object().shape({
        [SERVICES_CREATE_UPDATE.NAME]: required_str,
        [SERVICES_CREATE_UPDATE.AMOUNT]: str,
        [SERVICES_CREATE_UPDATE.GST]: str,
        [SERVICES_CREATE_UPDATE.CODE]: str.test("valid-otp", MSG.VALID_OTP, validotp),
        [SERVICES_CREATE_UPDATE.PRODUCTDESC]: str,
        [SERVICES_CREATE_UPDATE.PRODUCTCODE]: Yup.string()
            .oneOf(HSN_SAC_ENUM, MSG.INVALID_HSN_SAC)
            .when(SERVICES_CREATE_UPDATE.CODE, {
                is: (val) => typeof val === "string" && val.trim() !== "",
                then: (schema) => schema.required("Product code is required when code is entered"),
                otherwise: (schema) => schema.notRequired(),
            }),
    }),

    PAYEECREATEUPDATE: Yup.object().shape({
        [PAYEECREATEUPDATE.FIRST_NAME]: required_str,
        [PAYEECREATEUPDATE.LAST_NAME]: required_str,
        [PAYEECREATEUPDATE.EMAIL]: str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [PAYEECREATEUPDATE.CONTACTNO]: str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [PAYEECREATEUPDATE.WHATAPPNO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [PAYEECREATEUPDATE.MAIN]: Yup.object().shape({
            [PAYEECREATEUPDATEMAIN.PERSONALEMAIL]: str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
            [PAYEECREATEUPDATEMAIN.COMPANY_NAME]: required_str,
            [PAYEECREATEUPDATEMAIN.GSTNO]: Yup.string().test("valid-gstNo", MSG.VALID_GSTNO, validGST).nullable(),
            [PAYEECREATEUPDATEMAIN.WHATSAPP_NUMBER]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
            [PAYEECREATEUPDATEMAIN.CAAPARMENT]: str,
            [PAYEECREATEUPDATEMAIN.CABUILDING]: str,
            [PAYEECREATEUPDATEMAIN.CASTREET]: str,
            [PAYEECREATEUPDATEMAIN.CALANDMARK]: str,
            [PAYEECREATEUPDATEMAIN.CITY]: required_str,
            [PAYEECREATEUPDATEMAIN.STATE]: required_str,
            [PAYEECREATEUPDATEMAIN.ZIPCODE]: required_str.test("valid-otp", MSG.VALID_OTP, validotp),
            [PAYEECREATEUPDATEMAIN.COUNTRY]: required_str,
            [PAYEECREATEUPDATEMAIN.COUNTRYID]: str,
            [PAYEECREATEUPDATEMAIN.STATEID]: str,
        }),
        [PAYEECREATEUPDATE.SUB]: Yup.array().of(
            Yup.object().shape({
                [PAYEECREATEUPDATESUB.PERSONALEMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
                [PAYEECREATEUPDATESUB.COMPANY_NAME]: required_str,
                [PAYEECREATEUPDATESUB.GSTNO]: Yup.string().test("valid-gstNo", MSG.VALID_GSTNO, validGST).nullable(),
                [PAYEECREATEUPDATESUB.WHATSAPP_NUMBER]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
                [PAYEECREATEUPDATESUB.CAAPARMENT]: str,
                [PAYEECREATEUPDATESUB.CABUILDING]: str,
                [PAYEECREATEUPDATESUB.CASTREET]: str,
                [PAYEECREATEUPDATESUB.CALANDMARK]: str,
                [PAYEECREATEUPDATESUB.CITY]: required_str,
                [PAYEECREATEUPDATESUB.STATE]: required_str,
                [PAYEECREATEUPDATESUB.ZIPCODE]: required_str.test("valid-otp", MSG.VALID_OTP, validotp),
                [PAYEECREATEUPDATESUB.COUNTRY]: required_str,
                [PAYEECREATEUPDATESUB.COUNTRYID]: str,
                [PAYEECREATEUPDATESUB.STATEID]: str,
            })
        ),
    }),

    SETTING: Yup.object().shape({
        [SETTING.PROFILE_IMAGE]: Yup.mixed().nullable(),
        [SETTING.COMPANY_NAME]: required_str,
        [SETTING.EMAILADDRESS]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [SETTING.CONTACTNO]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [SETTING.WEBSIE]: str,
        [SETTING.GSTNO]: str.test("valid-gstNo", MSG.VALID_GSTNO, validGST),
        [SETTING.CAAPARMENT]: required_str,
        [SETTING.CABUILDING]: str,
        [SETTING.COUNTRYID]: str,
        [SETTING.STATEID]: str,
        [SETTING.CASTREET]: str,
        [SETTING.CITY]: required_str,
        [SETTING.STATE]: required_str,
        [SETTING.ZIPCODE]: required_str.test("valid-otp", MSG.VALID_OTP, validotp),
        [SETTING.COUNTRY]: required_str,
        [SETTING.BANKDETAIL]: Yup.array().of(
            Yup.object().shape({
                [SETTIGBANK.BANKNAME]: required_str,
                [SETTIGBANK.ACCOUNTHOLDERNAME]: required_str,
                [SETTIGBANK.ACCOUNTNO]: required_str,
                [SETTIGBANK.IFSC]: required_str.test("valid-ifsc", MSG.VALID_IFSC, validIFSC),
            })
        ),
    }),

    INVOICECREATEUPDATE: Yup.object().shape({
        [INVOICECREATEUPDATE.DATE]: required_str,
        [INVOICECREATEUPDATE.DUEDATE]: required_str,
        [INVOICECREATEUPDATE.PAYEEID]: required_str,
        [INVOICECREATEUPDATE.ISTAXABLE]: Yup.boolean(),
        [INVOICECREATEUPDATE.CGST]: str,
        [INVOICECREATEUPDATE.SGST]: str,
        [INVOICECREATEUPDATE.IGST]: str,
        [INVOICECREATEUPDATE.UTGST]: str,
        [INVOICECREATEUPDATE.SUBTOTAL]: str,
        [INVOICECREATEUPDATE.DISCOUNT]: str,
        [INVOICECREATEUPDATE.ROUNDOFF]: str,
        [INVOICECREATEUPDATE.TOTALAMOUNT]: str,
        [INVOICECREATEUPDATE.NOTES]: str,
        [INVOICECREATEUPDATE.SERVICESARRAY]: Yup.array().of(
            Yup.object().shape({
                [INVOICESERVICESARRAY.RATE]: required_str,
                [INVOICESERVICESARRAY.NAME]: required_str,
                [INVOICESERVICESARRAY.QUONTITY]: Yup.string().required("add qty"),
                [INVOICESERVICESARRAY.CGST]: Yup.string().when(["$isTaxable", "$selectedTax"], {
                    is: (isTaxable, selectedTax) => isTaxable && selectedTax !== "IGST",
                    then: (schema) => schema.required("Add CGST"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                [INVOICESERVICESARRAY.SGST]: Yup.string().when(["$isTaxable", "$selectedTax"], {
                    is: (isTaxable, selectedTax) => isTaxable && selectedTax !== "IGST",
                    then: (schema) => schema.required("Add SGST"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                [INVOICESERVICESARRAY.IGST]: Yup.string().when(["$isTaxable", "$selectedTax"], {
                    is: (isTaxable, selectedTax) => isTaxable && selectedTax === "IGST",
                    then: (schema) => schema.required("Add IGST"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                [INVOICESERVICESARRAY.DISCOUNT]: str,
            })
        ),
    }),

    PAYMENTCREATEUPDATE: Yup.object().shape({
        [PAYMENTCREATEUPDATE.PAYMENTDATE]: required_str,
        [PAYMENTCREATEUPDATE.INVOICEIS]: required_str,
        [PAYMENTCREATEUPDATE.INVOICETOTAL]: required_str,
        [PAYMENTCREATEUPDATE.RECIVEDAMOUNT]: required_str,
        [PAYMENTCREATEUPDATE.TDS]: str,
        [PAYMENTCREATEUPDATE.ROUNDOFF]: str,
        [PAYMENTCREATEUPDATE.OUTSTANDING]: required_str,
        [PAYMENTCREATEUPDATE.METHOD]: required_str,
        [PAYMENTCREATEUPDATE.NOTES]: str,
    }),

    CONTACTUS: Yup.object().shape({
        [CONTACTUS.NAME]: required_str,
        [CONTACTUS.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [CONTACTUS.MESSAGE]: required_str,
    }),

    PAYMENTDETAIL: Yup.object().shape({
        [PAYMENTDETAIL.EMAIL]: required_str.email(MSG.VALID_EMAIL).test("valid-email", MSG.VALID_EMAIL, validEmail),
        [PAYMENTDETAIL.CONTACT]: required_str.test("valid-mobile", MSG.VALID_MOBILE, validMobile),
        [PAYMENTDETAIL.CURRENCY]: str,
        [PAYMENTDETAIL.SUBID]: str,
    }),

    REPORT_CREATE_UPDATE: Yup.object().shape({
        [REPORT_CREATE_EDIT.SINGLE_USER_PRICE]: str,
        [REPORT_CREATE_EDIT.BUSINESS_PRICE]: str,
        [REPORT_CREATE_EDIT.ENTREPRENEUR_PRICE]: str,
        [REPORT_CREATE_EDIT.PAGES]: str,
        [REPORT_CREATE_EDIT.PUBLISH_DATE]: str,
        [REPORT_CREATE_EDIT.CATEGORY_ID]: str,
        [REPORT_CREATE_EDIT.SUBCATEGORY_ID]: str,
        [REPORT_CREATE_EDIT.REPORT_TITLE]: str,
        [REPORT_CREATE_EDIT.REPORT_SUBTITLE]: str,
        [REPORT_CREATE_EDIT.REPORT_OVERVIEW]: str,
        [REPORT_CREATE_EDIT.TABLE_OF_CONTENT]: str,
        [REPORT_CREATE_EDIT.AVAILABLE_IN]: str,
        [REPORT_CREATE_EDIT.INTERNET_HANDLING_CHARGE]: str,
        [REPORT_CREATE_EDIT.SEO_TITLE]: str,
        [REPORT_CREATE_EDIT.META_DESCRIPTION]: str,
        [REPORT_CREATE_EDIT.KEYWORDS]: str,
        // [REPORT_CREATE_EDIT.URL]: str,
        [REPORT_CREATE_EDIT.URL]: Yup.string()
            .nullable()
            .notRequired()
            .test(
                "valid-characters",
                "Only letters, numbers, -, _ allowed. Do not use '/'",
                (value) => !value || /^[a-zA-Z0-9_-]+$/.test(value) // allow empty/null, otherwise run regex
            ),
        [REPORT_CREATE_EDIT.STATUS]: str,
        [REPORT_CREATE_EDIT.REPORT_DESCRIPTION]: str,
    }),

    ARTICLE_CREATE_UPDATE: Yup.object().shape({
        [ARTICLE_CREATE_EDIT.ARTICLE_TITLE]: str,
        [ARTICLE_CREATE_EDIT.ARTICLE_SUBTITLE]: str,
        [ARTICLE_CREATE_EDIT.ARTICLE_TYPE]: str,
        [ARTICLE_CREATE_EDIT.CATEGORY_ID]: str,
        [ARTICLE_CREATE_EDIT.SUBCATEGORY_ID]: str,
        [ARTICLE_CREATE_EDIT.ARTICLE_CONTENT]: str,
        [ARTICLE_CREATE_EDIT.SEO_TITLE]: str,
        [ARTICLE_CREATE_EDIT.META_DESCRIPTION]: str,
        [ARTICLE_CREATE_EDIT.KEYWORDS]: str,
        [ARTICLE_CREATE_EDIT.URL]: Yup.string()
            .nullable()
            .notRequired()
            .test(
                "valid-characters",
                "Only letters, numbers, -, _ allowed. Do not use '/'",
                (value) => !value || /^[a-zA-Z0-9_-]+$/.test(value) // allow empty/null, otherwise run regex
            ),
        [ARTICLE_CREATE_EDIT.PUBLISH_DATE]: str,
        [ARTICLE_CREATE_EDIT.BLOG_IMAGE]: Yup.mixed().nullable(),
        [ARTICLE_CREATE_EDIT.STATUS]: str,
    }),
};
