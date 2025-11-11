"use client";
import React from "react";
import Image from "next/image";
import { Upload, Check } from "lucide-react";

const FormControls = {
  TextInput: ({ label, id, value, onChange, type = "text", ...props }) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
        {...props}
      />
    </div>
  ),

  FileUpload: ({ label, id, onChange, preview }) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <label
        htmlFor={id}
        className="flex items-center justify-between px-3 py-2 border rounded cursor-pointer"
      >
        <span className="truncate">
          {preview ? "File selected" : `Upload ${label}`}
        </span>
        {preview ? (
          <Check className="text-green-500" size={24} />
        ) : (
          <Upload className="text-gray-500" size={24} />
        )}
      </label>
      <input
        type="file"
        id={id}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />
      {preview && (
        <div className="mt-2 h-20 bg-gray-100 rounded overflow-hidden">
          <Image src={preview} alt="Preview" className="h-full mx-auto" width={100} height={100} quality={100} />
        </div>
      )}
    </div>
  ),

  Dropdown: ({ label, id, value, onChange, options }) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  ),
};

export default FormControls;