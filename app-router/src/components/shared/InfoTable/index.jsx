"use client"
import React from 'react';
import { Info, DollarSign, FileText, FileEdit, User, Building, Mail, Phone, Briefcase, FolderTree, Database, MessageSquare } from 'lucide-react';

const getIconForLabel = (label) => {
  const iconMap = {
    "Inquiry ID": <Info size={16} />,
    "Time": <Info size={16} />,
    "Report": <FileText size={16} />,
    "Client Name": <User size={16} />,
    "Company Name": <Building fontSize="small" />,
    "Business Mail": <Mail fontSize="small" />,
    "Contact No": <Phone fontSize="small" />,
    "Job Role": <Briefcase fontSize="small" />,
    "Report ID": <Info fontSize="small" />,
    "Domain": <FolderTree fontSize="small" />,
    "Sub-Domain": <Database fontSize="small" />,
    "Message": <MessageSquare fontSize="small" />,
    "Note": <FileEdit fontSize="small" />,
    "Payment Type": <DollarSign fontSize="small"/>,
  };
  return iconMap[label] || <Info fontSize="small" />
};

export const InfoTableHeader = ({ title, icon }) => {
  return (
    <header className="flex flex-wrap gap-10 justify-between items-center p-3 w-full font-medium leading-snug border-solid bg-slate-200 border-b-[0.5px] border-b-zinc-700 border-b-opacity-30 text-zinc-900 max-md:max-w-full">
      <h1 className="text-zinc-900 flex items-center gap-2">
        {icon}
        {title}
      </h1>
    </header>
  );
};

export const InfoTableRow = ({
  label,
  value,
  isLastRow = false,
  valueColor = "text-zinc-700",
  isMultiline = false
}) => {
  const borderClass = isLastRow
    ? ""
    : "border-solid border-b-[0.5px] border-b-zinc-700 border-b-opacity-30";

  const leadingClass = isMultiline ? "leading-6" : "leading-relaxed";

  return (
    <div className={`flex w-full ${borderClass} max-md:max-w-full`}>
      <div className="gap-3 px-5 py-1.5 leading-relaxed border-solid bg-white bg-opacity-0 border-r-[0.5px] border-r-zinc-700 border-r-opacity-30 text-zinc-600 w-[200px] flex items-start min-w-[200px] max-w-[200px] flex-shrink-0">
        <span className="sr-only">Field: </span>
        <span className="mr-2 opacity-70">{getIconForLabel(label)}</span>
        <span>{label}</span>
      </div>
      <div className={`flex-1 px-5 py-1.5 font-medium border-solid bg-white bg-opacity-0 ${valueColor} ${leadingClass}`} style={{wordBreak: 'break-word', minWidth: '0'}}>
        {value}
      </div>
    </div>
  );
};

const InfoTable = ({ 
  title = "Information Table",
  data = [],
  icon = <Info size={20} />
}) => {
  return (
    <main className="flex flex-col justify-center p-5 text-base bg-white shadow-sm max-w-[800px] w-full" role="main">
      <section
        className="w-full border border-solid border-zinc-700 border-opacity-30 max-md:max-w-full"
        aria-labelledby="info-table-title"
      >
        <InfoTableHeader
          title={title}
          icon={icon}
        />

        <div role="table" aria-label="Information details">
          {data.map((item, index) => (
            <div key={`${item.label}-${index}`} role="row">
              <InfoTableRow
                label={item.label}
                value={item.value}
                valueColor={item.valueColor}
                isLastRow={index === data.length - 1}
                isMultiline={item.isMultiline}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default InfoTable;