import * as Yup from "yup";
import { REGEX } from "./regex";
import { API } from "../api/schemas";
const ENQUIRY = API.ENQUIRY;

export const MSG = {
    REQUIRED: "This Field is required",
    MIN_PASSWORD: "Password must be 6 Characters long",
    VALID_STR: "Please Enter Valid Text",
    VALID_COUNT: "Please Enter Valid Count",
    VALID_URL: "Please Enter valid URL",
    VALID_IMG: "Please Enter Valid Image Type",
    VALID_MOBILE: "Invalid mobile number",
};

const str = Yup.string().trim(MSG.VALID_STR);
const required_str = Yup.string().trim(MSG.REQUIRED)?.required(MSG.REQUIRED);
const date = Yup.date("Provide Valid Date");
const num = Yup.number().min(0, MSG.VALID_COUNT).nullable();
const validMobile = (value) => (!value ? true : REGEX.MOBILE.test(value));
const validDate = (value) => (!value ? true : REGEX.DATE.test(value));
const supportedFormats = ["image/jpeg", "image/png", "image/gif", "image/svg"];

export const Validation = {
    LOGIN: Yup.object().shape({
        username: required_str,
        password: required_str.min(6, MSG.MIN_PASSWORD),
    }),
    STANDARD: Yup.object().shape({
        name: required_str,
        fees: num.required().nullable(),
    }),
    SUBJECT: Yup.object().shape({ name: required_str }),
    SHIFT: Yup.object().shape({ name: required_str }),
    BATCH: Yup.object().shape({
        name: required_str,
        standardId: required_str.nullable(),
    }),
    MOBILE: Yup.object().shape({
        MobileNumber: required_str.test("valid-mobile", MSG.VALID_MOBILE, (value) => validMobile(value)),
    }),
    ENQUIRY_FORM_FIRST: Yup.object().shape({
        photo: Yup.mixed()
            .test("fileType", "Invalid file type", function (value) {
                if (!value) return true;
                else if (value && supportedFormats.includes(value.type)) return true;
                else if (typeof value === "string") return true;
                return false;
            })
            .nullable(),
        prefix: required_str,
        [ENQUIRY.PERSONAL.FIRST_NAME]: required_str,
        lastName: required_str,
        middleName: required_str,
        houseNo: required_str,
        address1: required_str,
        address2: str,
        landmark: str,
        pincode: str.test("valid-pincode", "Please Enter Valid Pincode", (value) => {
            if (!value) return true;
            return value?.length === 6;
        }),
        city: str,
        state: str,
        dateOfBirth: date.required("This field is required"),
        gender: required_str,
    }),
    EDUCATION_FORM: Yup.object().shape({
        standardId: required_str,
        passfrom: str,
        schoolTime: str,
        lastYearPercentage: str.test("valid-percentage", "Please Enter Valid Percentage", (value) => {
            if (!value) return true;
            return +value <= 100 && +value > 0;
        }),
        school: str,
        fees: required_str.test("valid-percentage", "Please Enter Valid Percentage", (value) => {
            if (!value) return true;
            return +value > 0;
        }),
        discount: str.test("valid-discount", "Enter Valid Discount", function (value) {
            if (!value) return true;
            const { fees } = this.parent;
            return +value <= +fees;
        }),
        totalAmount: str,
        remarkForFees: str,
        remarkForStudent: str,
        reference: str,
    }),
    GUARDIAN_FORM: Yup.object().shape({
        parentPrefix: required_str,
        parentLastName: required_str,
        parentFirstName: required_str,
        parentMiddleName: required_str,
        contact1: required_str.test("valid-mobile", MSG.VALID_MOBILE, (value) => validMobile(value)),
        smsOn1: str,
        contact2: str.test("valid-mobile", MSG.VALID_MOBILE, (value) => validMobile(value)),
        smsOn2: str,
        occupation: str,
    }),
    ADMISSION_CONFIRM: Yup.object().shape({
        studentId: required_str,
        standardId: required_str,
        addmissionDate: required_str,
        batchId: required_str,
        shiftId: required_str,
        date: required_str,
        amount: Yup.number()
            .test("valid-amount", "Enter Valid Amount", function (value) {
                const { totalFees, discount, collectedFees } = this.parent;
                const remainingFees = +totalFees - (+discount || 0) - (+collectedFees || 0);
                return value <= remainingFees;
            })
            .required(MSG.REQUIRED)
            .nullable(),
        totalFees: Yup.number().required(MSG.REQUIRED).nullable(),
        mode: required_str,
        chequeNumber: Yup.string().test("requirdIfCheque", "check number is required", function (value) {
            const isCheque = this.parent.mode === "cheque";
            if (isCheque) return Yup.string().required().isValidSync(value);
            return true;
        }),
        discount: Yup.number().lessThan(Yup.ref("totalFees"), "Enter Valid Discount Value").required(MSG.REQUIRED).nullable(),
        reason: str,
    }),
    ATTENDANCE: Yup.object().shape({
        standardId: required_str,
        batchId: required_str,
        date: required_str,
        studentId: Yup.array()
            .of(
                Yup.object().shape({
                    studentId: required_str,
                    attendance: Yup.boolean().required("Attendance is required"),
                })
            )
            .required("Student ID is required"),
    }),
    STAFF_FORM: Yup.object().shape({
        prefix: str,
        surName: required_str,
        name: required_str,
        fatherName: required_str,
        address: required_str,
        building: required_str,
        area: str,
        landmark: str,
        contact1: required_str.test("valid-mobile", MSG.VALID_MOBILE, (value) => validMobile(value)),
        contact2: str.test("valid-mobile", MSG.VALID_MOBILE, (value) => validMobile(value)),
        dateOfBirth: date.required(MSG.REQUIRED),
        email: Yup.string().nullable().trim().email("Invalid email"),
        qualification: required_str,
        designation: str,
        password: str,
        role: required_str,
        salary: Yup.number().nullable().required(MSG.REQUIRED),
    }),
    EXAM: Yup.object().shape({
        standardId: required_str,
        subjectId: required_str,
        totalMarks: required_str,
        notes: required_str,
        date: required_str,
    }),
    ACCOUNT_FILTER_SCHEMA: Yup.object().shape({
        percentageFrom: str.test("minMaxCheck", "Please Enter Valid Percentage", function (value) {
            if (!value) return true;
            return +value > 0 && +value < 101;
        }),
        percentageTo: str.test("minMaxCheck", "Please Enter Valid Percentage", function (value) {
            if (!value) return true;
            return +value > 0 && +value < 101;
        }),
        byFees: str,
        feesReportFrom: Yup.string().test("requirdIfCheque", "This Field is required", function (value) {
            const isCheque = this.parent.byFees === "Custom";
            if (isCheque) return Yup.string().required().isValidSync(value);
            return true;
        }),
        feesReportTo: Yup.string().test("requirdIfCheque", "This Field is required", function (value) {
            const isCheque = this.parent.byFees === "Custom";
            if (isCheque) return Yup.string().required().isValidSync(value);
            return true;
        }),
        byPaymentMethod: str,
        chequeNumber: Yup.string().test("requirdIfCheque", "This Field is required", function (value) {
            const isCheque = this.parent.byPaymentMethod === "Cheque";
            if (isCheque) return Yup.string().required().isValidSync(value);
            return true;
        }),
    }),
    NOTICE: Yup.object().shape({
        standardId: required_str,
        batchId: required_str,
        date: date.required(MSG.REQUIRED),
        title: required_str,
        details: required_str,
    }),
    HOLIDAY: Yup.object().shape({
        date: date.required(MSG.REQUIRED),
        name: required_str,
    }),
    TIME_TABLE: Yup.object().shape({
        standardId: required_str,
        batchId: required_str,
        image: Yup.mixed()
            .test("fileType", MSG.REQUIRED, function (value) {
                if (value) return true;
                else if (value && supportedFormats.includes(value.type)) return true;
                return false;
            })
            .nullable(),
    }),
    PROGRESS_FILTER_SCHEMA: Yup.object().shape({
        // startDate: Yup.string(),
        // endDate: Yup.string().nullable(), // Allow the endDate field to be nullable
        lastFewExamFrom: str.test("minMaxCheck", "Please Enter Valid Percentage", function (value) {
            if (!value) return true;
            return +value > 0 && +value < 101;
        }), // Make lastFewExamFrom nullable
        lastFewExamTo: str.test("minMaxCheck", "Please Enter Valid Percentage", function (value) {
            if (!value) return true;
            return +value > 0 && +value < 101;
        }),
    }),
    INCOME_SCHEMA: Yup.object().shape({
        date: required_str,
        categoryId: required_str,
        name: required_str,
        amount: required_str,
    }),
    EXPENSE_SCHEMA: Yup.object().shape({
        date: required_str,
        categoryId: required_str,
        name: required_str,
        amount: required_str,
    }),

    // parent validation schema ----------------------------------------------------------------

    PARENT_LEAVE_SCHEMA: Yup.object().shape({
        day: required_str,
        studentId: str,
        fromDate: str.test("fromDate", function (value) {
            if (this.parent.day === "oneDay") {
                return !!value;
            }
            if (this.parent.day === "multiDay") {
                return !!value;
            }
            return true;
        }),
        toDate: str.test("toDate", function (value) {
            if (this.parent.day === "multiDay") {
                return !!value;
            }
            return true;
        }),
        reason: required_str,
    }),
};
