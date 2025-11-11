import React from "react";

const BlogHeader = ({ subtitle = "Blogs", title = "Most Popular Insights" }) => {
    return (
        <header className="flex flex-col items-center gap-2" style={{ marginTop: "-2%" }}>
            {/* <p className="text-[#D62035] text-center font-inter text-base font-medium leading-[1.6] uppercase m-0 sm:text-sm">
        {subtitle}
      </p> */}
            <h2 className="text-[#1A1A1A] text-center font-inter text-[26px] font-semibold leading-[1.4] m-0 sm:text-1xl md:text-[26px]">{title}</h2>
        </header>
    );
};

export default BlogHeader;
