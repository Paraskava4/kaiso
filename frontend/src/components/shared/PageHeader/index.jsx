"use client";
import React from "react";
import CommonButton from "../CommonButton";

const PageHeader = ({
  title,
  primaryAction,
  secondaryActions = [],
  className = "",
  rightContent = null,
}) => {
  return (
    <header className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${className}`}>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>

      {rightContent ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {rightContent}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {secondaryActions.map((action, idx) => (
            <CommonButton
              key={idx}
              onClick={action.onClick}
              variant={action.variant || "outline"}
              loading={action.loading}
              disabled={action.disabled}
              startIcon={action.startIcon}
              className="w-full sm:w-[120px] lg:w-[150px]"
              size="small"
            >
              {action.label}
            </CommonButton>
          ))}
          {primaryAction && (
            <CommonButton
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || "primary"}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
              startIcon={primaryAction.startIcon}
              className="w-full sm:w-[120px] lg:w-[150px]"
              size="small"
            >
              {primaryAction.label}
            </CommonButton>
          )}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
