"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Import all icons
import lifeScience from "../../../../public/images/Life_Science.webp";
import ICTMedia from "../../../../public/images/ICT&Media.webp";
import FoodBeverages from "../../../../public/images/Food&Beverages.webp";
import MaterialChemicals from "../../../../public/images/Material&Chemicals.webp";
import AutomotiveTransportation from "../../../../public/images/Automotive&Transportation.webp";
import ConstructionManufacturing from "../../../../public/images/Construction&Manufacturing.webp";
import BFSI from "../../../../public/images/BFSI.webp";
import SemiconductorsElectronics from "../../../../public/images/Semiconductors&Electronics.webp";
import ConsumerGoods from "../../../../public/images/ConsumerGoods.webp";
import AerospaceDefence from "../../../../public/images/Aerospace&Defence.webp";
import EnergyPower from "../../../../public/images/Energy&Power.webp";
import Link from "next/link";

const industriesData = [
    { name: "Life Sciences", image: lifeScience },
    { name: "Consumer Goods", image: ConsumerGoods },
    { name: "Materials and Chemicals", image: MaterialChemicals },
    { name: "Construction and Manufacturing", image: ConstructionManufacturing },
    { name: "Food and Beverages", image: FoodBeverages },
    { name: "Energy and Power", image: EnergyPower },
    { name: "Semiconductors and Electronics", image: SemiconductorsElectronics },
    { name: "Automotive and Transportation", image: AutomotiveTransportation },
    { name: "ICT and Media", image: ICTMedia },
    { name: "Aerospace and Defense", image: AerospaceDefence },
    { name: "BFSI", image: BFSI },
];

const IndustriesList = () => {
    return (
        <div className="w-[84%] px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
                {industriesData.map((industry, index) => (
                    <motion.div
                        key={index}
                        className="relative overflow-hidden rounded-lg shadow-lg"
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                    >
                        {/* Image */}
                        <motion.div
                            className="w-full h-[200px] overflow-hidden"
                            variants={{
                                rest: { scale: 1, rotate: 0 },
                                hover: { scale: 1.3, rotate: 2 },
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <Image
                                src={industry.image}
                                alt={industry.name}
                                className="w-full h-full object-cover"
                                height={200}
                            />
                        </motion.div>

                        {/* Text overlay */}
                        <motion.div
                            className="absolute bottom-4 left-4 text-white font-semibold text-[14px] z-20"
                            variants={{
                                rest: { y: 0 },
                                hover: { y: -60 },
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {industry.name}
                        </motion.div>

                        {/* Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-[#163272] to-transparent"
                            variants={{
                                rest: { opacity: "1" },
                                hover: { opacity: "0.8", background: "#163272" },
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </motion.div>
                ))}

                {/* See All Button */}
                <Link href="/report-store" className="flex items-center justify-center h-[200px] rounded-lg shadow-lg bg-[#163272] text-white font-semibold text-lg cursor-pointer hover:bg-[#0e1f4b] transition">
                    See All →
                </Link>
            </div>
        </div>
    );
};

export default IndustriesList;
