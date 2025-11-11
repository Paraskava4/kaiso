"use client";
import React, { useEffect } from "react";
import ServiceCard from "./ServiceCard";
import ServiceItem from "./ServiceItem";
import styles from "./Services.module.css";
import Image from "next/image";

const ServicesList = ({ servicesData, activeService, onServiceClick, fade }) => {
    const currentService = servicesData[activeService];

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeService + 1) % servicesData.length;
            onServiceClick(nextIndex);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, [activeService, onServiceClick, servicesData.length]);

    return (
        <div className={styles.servicesList} style={{ marginBottom: "-15%" }}>
            <div className={styles.servicesContent} style={{ height: "580px", overflowY: "auto" }}>
                {servicesData.map((service, index) => (
                    <div key={index}>
                        <ServiceItem title={service.title} isActive={index === activeService} onClick={() => onServiceClick(index)} />
                        {index === activeService && (
                            <div
                                className={`transition-all duration-700 ease-in-out transform ${
                                    fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                                }`}
                            >
                                <ServiceCard heading={currentService.heading} description={currentService.description} path={currentService.path} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div>
                <Image
                    // style={{ height: "400px" }}
                    src={currentService.image}
                    alt="Services illustration"
                    className={styles.servicesImage}
                    width={100}
                    height={100}
                    quality={100}
                />
            </div>
        </div>
    );
};

export default ServicesList;
