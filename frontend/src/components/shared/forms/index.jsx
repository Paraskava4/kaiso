"use client";
import React, { forwardRef, memo } from "react";
import { AlertTriangle } from "lucide-react";
import { get } from "lodash";

/** @param {string} str */
export const capitalize = (str) => str?.[0]?.toUpperCase() + str?.slice(1);

export const BaseInputItem = forwardRef(
    (
        {
            id,
            title = null,
            error,
            element,
            autoComplete,
            className,
            inputIcon,
            inputClass,
            requiredDot = false,
            classNameLabel,
            as,
            rows,
            form,
            mainClassMt,
            inputMt,
            InputProps = {},
            ...props
        },
        ref
    ) => {
        const InputElement = element || "input";
        const isRequired = error?.type === "required";
        const { endAdornment, ...restInputProps } = InputProps || {};

        return (
            <div className={`w-full ${mainClassMt ? mainClassMt : "mb-0"}`}>
                <div className="relative">
                    <div className="flex items-start w-full max-md:max-w-full">
                        <label className="leading-relaxed text-zinc-500">{title}</label>
                        {requiredDot && <span className="text-red-600 ml-1">*</span>}
                    </div>
                </div>
                <div className={`relative ${inputMt ? inputMt : "mt-0"}`}>
                    <div className={`${!inputIcon ? "" : "pl-10"}`}>
                        <InputElement
                            id={id}
                            type="text"
                            step="any"
                            autoComplete={autoComplete}
                            className={`flex-1 shrink gap-2.5 self-stretch px-5 py-3 mt-2 w-full leading-snug bg-white rounded-[6px] border ${
                                error ? "border-red-500 focus:ring-red-500" : "border-[rgba(67,70,75,0.30)] focus:ring-blue-500"
                            } text-zinc-500 max-md:max-w-full focus:outline-none focus:ring-2`}
                            ref={ref}
                            {...props}
                            {...restInputProps}
                        />
                        {endAdornment && <span className="input-end-adornment">{endAdornment}</span>}
                    </div>
                </div>
                <div className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <ErrorMessage error={error} />
                </div>
            </div>
        );
    }
);

export const InputItem = forwardRef(
    (
        {
            name,
            title,
            form,
            element,
            autoComplete,
            editable,
            inputIcon,
            required,
            type,
            onInput,
            size,
            as,
            initialValue,
            endAdornment,
            requiredDot,
            ...inputProps
        },
        ref
    ) => {
        const resolvedTitle = title || capitalize(name);
        const { errors } = form?.formState || {};
        const registerOpts = initialValue ? { value: initialValue } : {};
        const error = get(errors, name);

        return (
            <BaseInputItem
                form={form}
                id={name}
                title={resolvedTitle}
                size={size}
                error={error}
                type={type}
                element={element}
                onInput={onInput}
                InputProps={{ endAdornment }}
                {...inputProps}
                {...(form?.register?.(name, registerOpts) || {})}
                as={as}
                inputIcon={inputIcon}
                requiredDot={requiredDot}
            />
        );
    }
);

export const ErrorMessage = memo(({ error, className }) => {
    return (
        <p className={`${className || ""} text-sm text-red-500 ${error ? "block" : "hidden"}`}>
            {error?.message && (
                <span className="flex items-center">
                    <AlertTriangle size={15} />
                    <span className="my-1 text-[12px]">{error?.message}</span>
                </span>
            )}
        </p>
    );
});

export const HeaderTitle = ({ title, variant }) => {
    const Header = variant || "h1";
    return <p className="block mx-auto">{title}</p>
};

export const Label = ({ title, htmlFor, classNameLabel, requiredDot }) => {
    return (
        <>
            {/* <label htmlFor={htmlFor} className={classNameLabel}>
                {capitalize(title)}
            </label> */}
            <div className="relative">
                <div className="flex items-start w-full max-md:max-w-full">
                    <label className={classNameLabel} htmlFor={htmlFor}>
                        {capitalize(title)}
                    </label>
                    {requiredDot && <span className="text-red-600 ml-1">*</span>}
                </div>
            </div>
        </>
    );
};
