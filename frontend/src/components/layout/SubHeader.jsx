import Link from "next/link";
import React from "react";
import { Phone, Mail } from "lucide-react";

const SubHeader = () => {
    return (
        <div className="w-full bg-white/80 border-b border-black/30 text-xs sm:text-sm font-medium text-[#222222] backdrop-blur-sm px-4 py-2">
            <div className="max-w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                {/* Welcome Text (can uncomment or replace as needed) */}
                <div className="text-center md:text-left w-full md:w-auto tracking-wide">{/* Welcome to Kaiso Research and Consultancy */}</div>

                {/* Contact Info */}
                <div className="flex flex-col text-[13px] sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center md:text-right w-full md:w-auto">
                    <Link href="tel:+18722190417" className="flex items-center justify-center gap-1 hover:underline underline-offset-4 transition duration-200">
                        <Phone className="w-4 h-4" /> {/* Reduced size with w-5 and h-5 */}
                        +1 872 219 0417
                    </Link>
                    <Link
                        href="mailto:help@kaisoresearch.com"
                        className="flex items-center justify-center gap-1 hover:underline underline-offset-4 transition duration-200"
                    >
                        <Mail className="w-4 h-4" />
                        help@kaisoresearch.com
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubHeader;
