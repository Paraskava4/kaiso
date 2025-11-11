import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Search..."}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
        </div>
    );
};

export default SearchInput;