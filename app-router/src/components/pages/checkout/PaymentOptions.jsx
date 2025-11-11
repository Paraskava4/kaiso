"use client";
import React, { useState } from "react";
import PaymentSuccessPopup from "../../popup/PaymentSuccessPopup";
import Image from "next/image";
import { useCreateLinkMutation, useCreateLinkRazorpayMutation, useUpdateInquiryTypeMutation } from "@/api/home";
import { Table, TableBody, TableCell, TableContainer, TableRow, useMediaQuery, Paper, Button } from "@mui/material";
// import PayPalButtonsGroup from "@/components/shared/PayPalButtonsGrup";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import ControlledAccordions from "@/components/shared/Accordion";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";
import { isStatusInclude } from "@/utils/axiosInstance";
// import PayPalButtonsGroup from "@/components/shared/PayPalButtonsGrup";

const PayPalButtonsGroup = dynamic(() => import("@/components/shared/PayPalButtonsGrup"));

const CheckboxInput = ({ id, checked, onChange, ariaLabel, className = "" }) => {
    return (
        <div className={`flex flex-col justify-center self-stretch p-1 my-auto w-6 ${className}`}>
            <label htmlFor={id} className="cursor-pointer">
                <input type="checkbox" id={id} checked={checked} onChange={onChange} aria-label={ariaLabel} className="sr-only" />
                <div
                    className={`flex shrink-0 rounded-sm border-solid aspect-[1/1] border-[1.5px] border-[color:var(--Steel-Gray-Scale-Black-300,#73757B)] h-4 w-4 ${
                        checked ? "bg-sky-900 border-sky-900" : ""
                    } transition-colors duration-200 relative`}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            onChange({ target: { checked: !checked } });
                        }
                    }}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>
            </label>
        </div>
    );
};

const PaymentMethodOption = ({ id, imageUrl, imageAlt, checked, onChange }) => {
    return (
        <div className="flex gap-3 sm:gap-5 items-center w-full p-3 rounded-md hover:bg-gray-50 transition-colors">
            <CheckboxInput id={id} checked={checked} onChange={onChange} ariaLabel={`Select ${imageAlt} payment method`} />
            <Image
                src={imageUrl}
                alt={imageAlt}
                className="object-contain flex-1 max-w-[200px] sm:max-w-[312px] h-auto"
                width={312}
                height={46}
                quality={100}
            />
        </div>
    );
};

const PaymentDivider = () => {
    return (
        <hr
            className="mt-5 w-full min-h-0 border border-solid bg-zinc-700 bg-opacity-30 border-zinc-700 border-opacity-30 max-md:max-w-full"
            role="separator"
            aria-hidden="true"
        />
    );
};

const BuyNowButton = ({ onClick, disabled = false }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`overflow-hidden gap-2.5 self-stretch px-5 py-3.5 mt-5 w-full text-lg font-medium leading-none text-center text-white min-h-[50px] min-w-[220px] max-md:max-w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                disabled ? "bg-gray-400 cursor-not-allowed" : "bg-sky-900 hover:bg-sky-800 active:bg-sky-950 cursor-pointer"
            }`}
            aria-label="Proceed to purchase with selected payment method"
        >
            Buy Now
        </button>
    );
};

// WireTransferMuiTable.jsx

const WireTransferMuiTable = ({ orderData }) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const [updateInquiryType] = useUpdateInquiryTypeMutation();
    const { redirect } = useRouteRedirect();

    const onSubmitData = async () => {
        // console.log("orderData?.billingInfo?.inquiryId", orderData?.orderData?.billingInfo?.inquiryId, {
        //     inquiryId: orderData?.orderData?.billingInfo?.inquiryId,
        //     paymentType: "Wire Transfer",
        // });

        const response = await updateInquiryType({
            inquiryId: orderData?.orderData?.billingInfo?.inquiryId,
            paymentType: "Wire Transfer",
        });
        if (isStatusInclude(response?.data?.status)) {
            redirect(`success`);
        }
    };

    const rows = [
        { label: "Bank Name", value: "Global Bank Ltd." },
        { label: "Account Name", value: "Acme Corp Inc." },
        { label: "Account Number", value: "1234567890" },
        { label: "IBAN", value: "GB82 WEST 1234 5698 7654 32" },
        { label: "SWIFT/BIC", value: "GBWLGB2L" },
        // { label: "Bank Address", value: "123 Finance Street, London, EC2A 1BC, United Kingdom" },
    ];

    return (
        <>
            <TableContainer component={Paper} variant="outlined" sx={{ border: "1px solid rgb(0, 0, 0)" }}>
                <Table size={isMobile ? "medium" : "small"}>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.label} sx={{ display: isMobile ? "flex" : "table-row", flexDirection: "column" }}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        fontWeight: 600,
                                        borderBottom: isMobile ? "none" : undefined,
                                        borderColor: "#000",
                                        pb: isMobile ? 0 : undefined,
                                    }}
                                >
                                    {r.label}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        wordBreak: "break-all",
                                        borderBottom: isMobile ? 0 : undefined,
                                        borderColor: "#000",
                                        pt: isMobile ? 0.5 : undefined,
                                    }}
                                >
                                    {r.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" sx={{ mx: "auto", display: "block", my: 2, background: "#1B3272" }} onClick={onSubmitData}>
                Submit
            </Button>

            {/* <Typography variant="caption" color="text.secondary" mt={1} display="block">
                Use your Order ID as the payment reference. Transfers usually clear within 1–2 business days.
            </Typography> */}
        </>
    );
};

const PaymentOptions = (orderData) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [createLinkReq] = useCreateLinkMutation();
    const [createLinkRazorPayReq] = useCreateLinkRazorpayMutation();
    const { redirect } = useRouteRedirect();

    const handleBuyNow = async () => {
        let approvalUrl;

        const res = await createLinkRazorPayReq({
            productName: orderData?.orderData?.cartItems[0]?.title,
            amount: Math.round(orderData?.orderData?.orderSummary?.payable),
            currency: "USD",
            customerName: orderData?.orderData?.billingInfo?.fullName,
            customerEmail: orderData?.orderData?.billingInfo?.email,
            customerContact: orderData?.orderData?.billingInfo?.contactNo,
        });
        approvalUrl = res?.data?.data?.link;

        if (approvalUrl) {
            window.open(approvalUrl, "_blank");
        }
    };

    const AccordionArray = [
        {
            title: (
                <>
                    <Image src="/images/paypal.webp" alt="PayPal Payment Method" width={312} height={46} className="w-100" />
                </>
            ),
            details: (
                <>
                    <div>
                        <PayPalButtonsGroup orderData={orderData} />
                    </div>
                </>
            ),
        },
        {
            title: (
                <>
                    <Image src={"/images/wire_transfer.webp"} alt="Wire Transfer Payment Method" width={312} height={46} className="w-100" />
                </>
            ),
            details: (
                <>
                    <WireTransferMuiTable orderData={orderData} />
                </>
            ),
        },
    ];

    return (
        <section
            className="p-5 bg-white border-solid border-[0.5px] border-[color:var(--Other-Border,rgba(67,70,75,0.30))] w-[100%]"
            aria-labelledby="payment-options-title"
        >
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
                            aria-label="Close payment success popup"
                            onClick={() => setShowSuccessPopup(false)}
                        >
                            ×
                        </button>
                        <PaymentSuccessPopup
                            email="user@example.com"
                            onContact={() => setShowSuccessPopup(false)}
                            onCheckEmail={() => setShowSuccessPopup(false)}
                        />
                    </div>
                </div>
            )}
            <div className="p-3 sm:p-5 lg:py-6 w-[100%]">
                <header className="mb-6">
                    <h2 id="payment-options-title" className="text-lg sm:text-xl font-medium text-zinc-900">
                        Payment Options
                    </h2>
                </header>

                <fieldset className="space-y-4 ">
                    <legend className="sr-only">Select your preferred payment method</legend>

                    <ControlledAccordions data={AccordionArray} />
                </fieldset>

                <Toaster position="top-right" reverseOrder={false} />
            </div>
        </section>
    );
};

export default PaymentOptions;
