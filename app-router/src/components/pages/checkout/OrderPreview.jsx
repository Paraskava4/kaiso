"use client";
import * as React from "react";

const Separator = () => (
    <tr>
        <td colSpan="2" className="border-t border-solid border-zinc-700 border-opacity-30" />
    </tr>
);

const EditButton = ({ label, onClick }) => (
    <button
        className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={label}
        onClick={onClick}
    >
        Edit
    </button>
);

const TableSection = ({ title, editLabel, onEdit, children }) => (
    <>
        <tr>
            <td colSpan="2" className="pt-5 pb-2.5">
                <div className="flex justify-between items-center text-base font-medium leading-relaxed capitalize">
                    <h2 className="text-sky-900">{title}</h2>
                    <EditButton label={editLabel} onClick={onEdit} />
                </div>
            </td>
        </tr>
        {children}
    </>
);

const SummaryRow = ({ label, amount, isTotal = false }) => (
    <tr>
        <td className={`py-1 ${isTotal ? "pt-4 text-base" : "text-md"} text-zinc-700 capitalize`}>{label}</td>
        <td className={`py-1 text-right ${isTotal ? "pt-4 text-md text-red-600" : "text-sm text-zinc-700"}`} aria-label={`${label}: ${amount}`}>
            {amount}
        </td>
    </tr>
);

const OrderPreview = ({ billingInfo = {}, cartItems = [], orderSummary = {}, onEditBilling = () => {}, onEditCart = () => {} }) => {
    const { fullName = "", contactNo = "", email = "", company = "", jobRole = "", address = "" } = billingInfo;
    const { subtotal = 0, discount = 0, handling = 0, payable = 0 } = orderSummary;

    return (
        <main className="p-5 bg-white border-[0.5px] border-[color:var(--Steel-Gray-Scale-Black-150,#A9AAB0)] max-w-[100%]">
            <h1 className="text-md font-medium leading-relaxed text-zinc-900">Order Preview</h1>
            <table className="w-full text-sm leading-snug max-md:max-w-full">
                <tbody>
                    <TableSection title="Billing information" editLabel="Edit billing information" onEdit={onEditBilling}>
                        <tr>
                            <td colSpan="2" className="py-1">
                                <h3 className="text-lg font-medium leading-loose capitalize text-zinc-700">{fullName}</h3>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-1 text-zinc-600">Contact No: {contactNo}</td>
                            <td className="py-1 text-zinc-600">Mail ID: {email}</td>
                        </tr>
                        <tr>
                            <td className="py-1 text-zinc-600">Job Role: {jobRole}</td>
                            <td className="py-1 text-zinc-600">Company: {company}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="py-1 text-zinc-600">
                                <address className="not-italic">Address: {address}</address>
                            </td>
                        </tr>
                        <Separator />
                    </TableSection>
                    <TableSection title="My cart" editLabel="Edit cart items" onEdit={onEditCart}>
                        {cartItems.map((item, index) => (
                            <React.Fragment key={item.id || index}>
                                {/* <tr>
                                    <td className="py-1 font-medium text-zinc-700"></td>
                                   
                                </tr> */}
                                <tr>
                                    <td className="py-1 text-zinc-600">
                                        <span style={{ fontWeight: 500 }}>License Type: </span>
                                        <span style={{ fontWeight: 500, color: "rgba(28,29,33,1)" }}>{item.licenseType}</span>
                                    </td>
                                    <td className="py-1 text-md text-right text-sky-900" aria-label={`Price: ${item.price}`}>
                                        {item.price}
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2" className="py-1 text-zinc-600">
                                        Delivery Format: {item.deliveryFormat}
                                    </td>
                                </tr>
                                {index < cartItems.length - 1 && <Separator />}
                            </React.Fragment>
                        ))}
                        <Separator />
                        <SummaryRow label="Subtotal" amount={`$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                        <SummaryRow label="Discount" amount={`-$${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                        <SummaryRow label="Internet handling charges" amount={`$${handling.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                        <Separator />
                        <SummaryRow label="Payable Amount" amount={`$${payable.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} isTotal={true} />
                    </TableSection>
                </tbody>
            </table>
        </main>
    );
};

export default OrderPreview;
