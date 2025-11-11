"use client";
import * as React from "react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import OtherInquiryForm from "@/components/shared/OtherInquiryForm";

const ActionButton = ({ children, variant = "primary", icon, onClick, className = "", showIcon = true, ...props }) => {
    const baseClasses =
        "flex overflow-hidden gap-2.5 justify-center items-center px-5 py-2 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] font-medium leading-none rounded-lg min-w-[220px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
        secondary: "bg-white text-zinc-900 hover:bg-gray-50 focus:ring-gray-500",
    };

    const handleClick = (e) => {
        onClick?.(e);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e);
        }
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={typeof children === "string" ? children : undefined}
            {...props}
        >
            <span className="self-stretch  my-auto leading-normal">{children}</span>
            {showIcon && icon && (
                <Image
                    src={icon}
                    alt=""
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    role="presentation"
                    width={100}
                    height={100}
                    quality={100}
                />
            )}
        </button>
    );
};

const CTAButtons = ({ button1, button2, inquiryForm1Props, inquiryForm2Props, onFormToggle }) => {
    const handleButton1Click = () => {
        if (onFormToggle) {
            onFormToggle("first", inquiryForm1Props);
        }
    };

    const handleButton2Click = () => {
        if (onFormToggle) {
            onFormToggle("second", inquiryForm2Props);
        }
    };

    return (
        <div
            className="flex flex-wrap gap-6 justify-center items-start self-center mt-6 text-xs sm:text-xs sm:text-[12px] md:text-[14px] 2xl:text-[16px] font-medium leading-none max-md:max-w-full"
            role="group"
            aria-label="Call to action buttons"
        >
            {button1 && (
                <ActionButton
                    variant="primary"
                    icon={button1.icon}
                    showIcon={button1.showIcon}
                    onClick={handleButton1Click}
                    aria-describedby="first-button-desc"
                >
                    {button1.text}
                </ActionButton>
            )}

            {button2 && (
                <ActionButton
                    variant="secondary"
                    icon={button2.icon}
                    showIcon={button2.showIcon}
                    onClick={handleButton2Click}
                    aria-describedby="second-button-desc"
                >
                    {button2.text}
                </ActionButton>
            )}
        </div>
    );
};

const CTAContent = ({ title, heading, description1, description2, description3 }) => (
    <header className="flex flex-col w-full max-md:max-w-full">
        {title && (
            <p style={{ fontSize: "16px" }} className=" font-medium leading-relaxed text-gray-100 uppercase max-md:max-w-full ">
                {title}
            </p>
        )}
        {heading && (
            <h2 className="self-center mt-2 text-[18px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold leading-10 text-white w-[538px] max-md:max-w-full max-sm:text-2xl">
                {heading}
            </h2>
        )}

        {description1 && (
            <p className="text-xs sm:text-xs sm:text-[12px] md:text-[14px]  font-medium leading-relaxed text-gray-100 max-md:max-w-full  mt-2">
                {description1}
            </p>
        )}
        {description2 && (
            <p className="text-xs sm:text-xs sm:text-[12px] md:text-[14px]  font-medium leading-relaxed text-gray-100 max-md:max-w-full  mt-2">
                {description2}
            </p>
        )}
        {description3 && (
            <p className="text-xs sm:text-xs sm:text-[12px] md:text-[14px]  font-medium leading-relaxed text-gray-100 max-md:max-w-full  mt-2">
                {description3}
            </p>
        )}
    </header>
);

const CtaSection = ({
    bgImage,
    title,
    heading,
    description1,
    description2,
    description3,
    button1,
    button2,
    inquiryForm1Props,
    inquiryForm2Props,
    currentFormConfig,
    className = "",
    containerClassName = "",
    ...props
}) => {
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [currentFormProps, setCurrentFormProps] = useState(inquiryForm1Props || null);

    const formSectionRef = useRef(null);
    const ctaSectionRef = useRef(null);

    // Use the currentFormConfig if provided, otherwise use the default props
    const effectiveForm1Props = currentFormConfig || inquiryForm1Props;
    const effectiveForm2Props = inquiryForm2Props;

    // Update form props when external configuration changes
    useEffect(() => {
        if (currentFormConfig) {
            setCurrentFormProps(currentFormConfig);
        }
    }, [currentFormConfig]);

    const handleFormToggle = (buttonType, formProps) => {
        setCurrentFormProps(formProps);

        // Smoothly scroll to the form section after state updates so it is in view
        setTimeout(() => {
            if (formSectionRef.current) {
                formSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }, 50);
    };

    return (
        <section ref={ctaSectionRef} className={`overflow-hidden rounded-3xl ${className}`} aria-labelledby="cta-heading" role="banner" {...props}>
            <div className="relative w-[81%] my-20 mx-auto min-h-[440px] rounded-[30px] overflow-hidden">
                {/* Background Image */}
                {bgImage && (
                    <Image
                        src={bgImage}
                        alt="Decorative background pattern"
                        className="absolute inset-0 w-full h-full object-cover"
                        fill
                        priority
                        quality={100}
                    />
                )}

                {/* Overlay content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[440px] px-6 py-8">
                    <div className="max-w-3xl w-full">
                        <CTAContent title={title} heading={heading} description1={description1} description2={description2} description3={description3} />
                    </div>

                    <div className="mt-6">
                        <CTAButtons
                            button1={button1}
                            button2={button2}
                            // Use the effective form props that include the dynamic config
                            inquiryForm1Props={effectiveForm1Props}
                            inquiryForm2Props={effectiveForm2Props}
                            onFormToggle={handleFormToggle}
                        />
                    </div>
                </div>
            </div>

            {/* Expanding Form Section */}
            {isFormOpen && (
                <div ref={formSectionRef} className="w-[68.8%] mx-auto bg-white  overflow-hidden" data-form-target>
                    <div className="mb-8" data-form-content>
                        {currentFormProps && <OtherInquiryForm {...currentFormProps} isOpen={true} isExpandedView={true} />}
                    </div>
                </div>
            )}
        </section>
    );
};

export default CtaSection;
