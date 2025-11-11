"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";

/**
 * SearchBox with built-in Fuse.js fuzzy search.
 * Props:
 *  - data: array of objects to search
 *  - keys: optional Fuse.js key list (defaults to all object keys)
 *  - onResults: callback(filteredArray)
 *  - placeholder, className: styling
 */
const SearchBox = ({ data = [], keys = [], onResults = () => {}, placeholder = "Search...", className = "", ...props }) => {
    const [query, setQuery] = useState("");

    // Memoize Fuse instance when data/keys change
    const fuse = useMemo(() => {
        if (!data.length) return null;
        const searchKeys = keys.length ? keys : Object.keys(data[0]);
        return new Fuse(data, {
            keys: searchKeys,
            threshold: 0.3, // fuzzy but relevant
            ignoreLocation: true,
        });
    }, [data, keys]);

    // Run search whenever query or data changes
    useEffect(() => {
        if (!fuse) return;
        if (!query.trim()) {
            onResults(data);
        } else {
            const resultItems = fuse.search(query).map((r) => r.item);
            onResults(resultItems);
        }
    }, [query, fuse, data, onResults]);

    return (
        <div className={`relative w-full sm:w-auto ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 lg:w-60 text-sm"
                {...props}
            />
        </div>
    );
};

export default SearchBox;
