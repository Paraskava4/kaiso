"use client";
import IndustriesHeader from "../home/IndustriesHeader";
import { IndustriesList } from "@/components";

const SyndicateIndustries = () => {
    return (
        <div className=" w-full pt-0 pb-14">
            <div className="">
                <div className="flex justify-center items-center py-14">
                    <IndustriesHeader subtitle="Industries We Cover" title="Cross-Industry Coverage" />
                </div>
                <div className="flex justify-center">
                    <IndustriesList />
                </div>
            </div>
        </div>
    );
};

export default SyndicateIndustries;
