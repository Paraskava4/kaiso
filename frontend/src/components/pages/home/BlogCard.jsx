"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BlogCard = ({ image, upperText = "Market, Technology Trends and Strategy Analysis", lowerText = "", blogId, type = "ARTICLE" }) => {
    const router = useRouter();

    return (
        <div className="relative group w-full cursor-pointer">
            {/* Top Progress Line */}
            <div className="absolute top-0 left-0 w-full h-1 overflow-hidden z-20">
                <div className="h-full w-full bg-[#163272] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
            </div>

            {/* Card */}
            <div
                onClick={() => router.push(`/blog/${blogId}`)}
                className="overflow-hidden shadow-md w-full h-[500px] bg-white transition-transform duration-400  hover:shadow-xl"
            >
                {/* Background Image */}
                <div className="absolute bottom-0 left-0 w-full h-[60%] transition-all duration-300 group-hover:translate-y-full group-hover:opacity-0">
                    <Image src={image} alt="Blog background" fill className="object-cover" quality={70} priority />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full p-8 flex flex-col">
                    {/* Type */}
                    <div className="max-h-8 overflow-hidden text-gray-600 transition-all duration-400 group-hover:max-h-0 group-hover:opacity-0">
                        <div className="pb-2 text-sm font-semibold tracking-wide uppercase">{type}</div>
                    </div>

                    {/* Upper Text */}
                    <h3 className="text-xl font-semibold leading-tight text-gray-900 mb-2 line-clamp-3" style={{ lineHeight: "140%", letterSpacing: "1px" }}>
                        {upperText}
                    </h3>

                    {/* Lower Text */}
                    <p className="text-base text-gray-600 leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {lowerText}
                    </p>

                    {/* Plus Button */}
                    <button
                        className="absolute bottom-6 left-6 z-10 bg-[#163272] text-white rounded-full p-3 translate-y-full opacity-0 transition-all duration-400 group-hover:-translate-y-0 group-hover:opacity-100 hover:bg-orange-600 focus:bg-orange-600 active:rotate-45"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/blog/${blogId}`);
                        }}
                        tabIndex="-1"
                    >
                        <Image src="/icons/Righte-Arrow.svg" alt="Read more" width={16} height={16} className="w-4 h-4" quality={100} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
