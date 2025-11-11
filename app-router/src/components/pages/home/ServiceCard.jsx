"use client";
import React from "react";
import styles from "./ServiceCard.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ServiceCard = ({ heading, description, path }) => {
    const router = useRouter();
    console.log("path", path);
    const navigateUrl = (url) => {
        router?.push(`${url}`);
    };
    return (
        <article className={styles.serviceCard}>
            <h3 className={styles.serviceCardHeading}>{heading}</h3>
            <p className={styles.serviceCardDescription}>{description}</p>
            <button className={styles.serviceCardButton} onClick={() => navigateUrl(path)} aria-label="Read more about this service">
                <span
                    style={{
                        alignSelf: "stretch",
                        margin: "auto 0",
                    }}
                >
                    Read more
                </span>
                <Image
                    src="/icons/Service-Arrow.webp"
                    style={{ fontSize: "10px" }}
                    alt=""
                    className={styles.serviceCardIcon}
                    aria-hidden="true"
                    width={100}
                    height={100}
                    quality={100}
                />
            </button>
        </article>
    );
};

export default ServiceCard;
