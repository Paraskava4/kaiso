// /src/admin/components/pages/MenuItemRow.jsx
"use client";
import React from "react";
import { GripVertical, EyeOff, Eye } from "lucide-react";

const MenuItemRow = ({
    text,
    hasChildren = false,
    isExpanded = false,
    isChild = false,
    hasIcon = true,
    isSelected = false,
    isHidden = false,
    isDragOver = false,
    isDragging = false,
    isDimmed = false,
    onClick,
    onToggleVisibility,
    // drag props
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
}) => {
    return (
        <div
            className={`flex items-center p-3 border ${isDragOver ? "border-blue-500 border-dashed" : "border-zinc-700/30"} ${onClick ? "cursor-pointer" : "cursor-default"} transition-opacity ${
                isDragging ? "bg-blue-50" : ""
            } ${isDimmed ? "opacity-40" : ""} ${
                isSelected
                    ? "bg-gray-300"
                    : isChild
                        ? "bg-gray-100"
                        : "bg-white"
            } ${isChild ? "mt-1.5" : "mt-2"}`}
            onClick={onClick}
            draggable={!!onDragStart}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
        >
            {hasIcon ? (
                <div className="mr-2">
                    <GripVertical className="w-4 h-4 cursor-grab text-[#8E8F96]" />
                </div>
            ) : (
                <div className="w-5 h-5" />
            )}
            <span className="flex-1 text-zinc-700">{text}</span>
            {onToggleVisibility ? (
                isHidden ? (
                    <EyeOff
                        className="w-4 h-4 hover:opacity-70 text-[#8E8F96]"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility();
                        }}
                    />
                ) : (
                    <Eye
                        className="w-4 h-4 hover:opacity-70 text-[#8E8F96]"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility();
                        }}
                    />
                )
            ) : hasIcon ? (
                <EyeOff className="w-4 h-4 text-[#8E8F96]" />
            ) : null}
        </div>
    );
};

export default MenuItemRow;
