"use client";
import * as React from "react";

const CommanCheckbox = ({ label, checked = false, onChange }) => {
    const handleChange = (e) => {
        onChange?.(e.target.checked);
    };

    return (
        <div className="flex flex-1 shrink gap-1.5 items-center basis-0 min-w-60">
            <div className="flex overflow-hidden flex-col justify-center self-stretch px-1 py-1 my-auto w-6">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label={label}
                    />
                    <div className="flex shrink-0 rounded-sm border-solid aspect-[1/1] border-[1.5px] border-[color:var(--Steel-Gray-Scale-Black-200,#8E8F96)] h-[17px] bg-white">
                        {checked && (
                            <div className="w-full h-full bg-blue-500 rounded-sm flex items-center justify-center">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <label className="self-stretch my-auto text-sm font-medium leading-snug text-center text-zinc-900 cursor-pointer">{label}</label>
        </div>
    );
};

export default CommanCheckbox;
