"use client";
import React from "react";
import Image from "next/image";
import MapHeader from "./MapHeader";

const Map = () => {
    return (
        <section className="map-section">
            <MapHeader />
            <div className="map-image-container">
                <div className="map-image-wrapper">
                    <Image
                        src="/images/map.webp"
                        alt="World map showing our global presence and client distribution"
                        width={2000}
                        height={600}
                        quality={100}
                        priority
                        className="map-image"
                    // sizes="(max-width: 480px) 100vw,
                    //        (max-width: 768px) 95vw,
                    //        (max-width: 1024px) 90vw,
                    //        (max-width: 1400px) 85vw,
                    //        1200px"
                    />
                </div>
            </div>
        </section>
    );
};

export default Map;
