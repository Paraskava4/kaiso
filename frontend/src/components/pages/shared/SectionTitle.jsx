"use client";
import React from "react";
import styles from "../home/Services.module.css";

const SectionTitle = ({
    subtitle = "Our Core Expertise",
    title = "Our Core Expertise",
    description = "",
}) => {
    return (
        <header className={styles.sectionTitle}>
            {/* <p className={styles.sectionSubtitle}>
        {subtitle}
      </p> */}
            <h2 className={styles.sectionTitleHeading}>{title}</h2>
            <p className={styles.sectionDescription}>{/* {description} */}</p>
        </header>
    );
};

export default SectionTitle;
