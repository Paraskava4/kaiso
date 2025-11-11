import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCreateLinkMutation, useCreateOrderCaptureMutation } from "@/api/home";
import { isStatusInclude } from "@/utils/axiosInstance";
import { useRouteRedirect } from "@/hooks/useRouteRedirect";

const PayPalButtonsGroup = (props) => {
    const [createLinkReq] = useCreateLinkMutation();
    const [createOrderCapture] = useCreateOrderCaptureMutation();
    const { redirect } = useRouteRedirect();
    const orderData = props?.orderData;

    // console.log(new paypal);

    const paypalCreateOrder = async () => {
        try {
            const response = await createLinkReq({
                amount: Math.round(orderData?.orderData?.orderSummary?.payable),
                currency: "USD",
                productName: orderData?.orderData?.cartItems[0]?.title,
                customerName: orderData?.orderData?.billingInfo?.fullName,
                customerEmail: orderData?.orderData?.billingInfo?.email,
                customerContact: orderData?.orderData?.billingInfo?.contactNo,
                customerAddress: orderData?.orderData?.billingInfo?.address,
                customerPostalCode: orderData?.orderData?.billingInfo?.customerPostalCode,
                customerCountry: orderData?.orderData?.billingInfo?.customerCountry,
                customerCity: orderData?.orderData?.billingInfo?.customerCity,
                customerState: orderData?.orderData?.billingInfo?.customerState,
                inquiryId:orderData?.orderData?.billingInfo?.inquiryId
            });

            if (isStatusInclude(response?.data?.status)) {
                return response?.data?.data?.orderId;
            }
        } catch (err) {
            console.error("Create order error:", err);
            return null;
        }
    };

    const paypalCaptureOrder = async (orderID) => {
        try {
            const response = await createOrderCapture({ orderId: orderID });


            if (isStatusInclude(response?.data?.status)) {
                redirect(`/success`);
                return true; // Indicate successful capture
            }
        } catch (err) {
            console.error("Capture error:", err);
            redirect(`/error`);
            return false;
        }
    };

    return (
        <PayPalScriptProvider
            options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
                components: "buttons",
            }}
        >
            <PayPalButtons
                style={{
                    color: "gold",
                    shape: "rect",
                    label: "pay",
                    height: 50,
                }}
                createOrder={async () => {
                    const orderId = await paypalCreateOrder();
                    return orderId ? orderId.toString() : null; // Ensure orderId is a string
                }}
                onApprove={async (data) => {
                    const success = await paypalCaptureOrder(data.orderID);
                    return success; // Return true/false based on capture result
                }}
                onError={(err) => {
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButtonsGroup;
