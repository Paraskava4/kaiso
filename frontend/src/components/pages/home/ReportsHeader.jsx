import React from "react";

const ReportsHeader = ({
    subtitle = "Our Expertise",
    title = "Latest Publication",
    description = "",
}) => {
    return (
        <header className="flex flex-col items-center gap-2">
            {/* Top heading */}
            {/* <p className="text-white text-center font-inter text-sm md:text-base font-medium leading-[1.6] w-full m-0">{subtitle}</p> */}

            {/* Middle heading */}
            <h2
                className="text-white mb-5 text-center font-inter text-xl sm:text-3xl md:text-[26px] font-semibold leading-[1.2] m-0 lg:-mt-20"
                // style={{ marginTop: "-30%" }}
            >
                
                {title}
            </h2>

            {/* Bottom description */}
            {/* <p
                style={{
                    color: "var(--EBE6E0, #EBE6E0)",
                    textAlign: "center",
                    fontFamily: "Inter",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "160%",
                    width: "704px",
                    margin: "0",
                }}
            >
                {description}
            </p> */}
            {/* Bottom description */}
            {/* <p className="text-[#EBE6E0] text-center font-inter text-base md:text-lg font-normal leading-[1.6] w-full px-4 md:w-[704px] m-0">{description}</p> */}
        </header>
    );
};

export default ReportsHeader;
