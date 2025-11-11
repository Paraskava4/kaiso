import React from "react";

const IndustriesHeader = ({ subtitle = "Industries We Serve", title = "Industries We Serve" }) => {
    return (
        <header className="industries-header">
            {/* <p className="industries-subtitle">
        {subtitle}
      </p> */}
            <h2 className="industries-title">{title}</h2>
        </header>
    );
};

export default IndustriesHeader;
