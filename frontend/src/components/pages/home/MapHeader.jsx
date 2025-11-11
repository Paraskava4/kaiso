import React from "react";

const MapHeader = ({ subtitle = "Our Presence", title = "Global Client Distribution" }) => {
    return (
        <header className="flex flex-col justify-center items-center gap-2">
            {/* <p className="text-[#D62035] text-center font-inter text-base font-medium leading-[1.6] m-0 sm:text-md">
                {subtitle}
            </p> */}
            <h2 className="text-[#1A1A1A] text-center font-inter text-3xl font-semibold leading-[1.4] m-0 sm:text-2xl md:text-[26px]">
                {title}
            </h2>
        </header>
    );
};

export default MapHeader;