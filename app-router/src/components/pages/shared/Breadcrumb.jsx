"use client"; // Required for client-side hooks in App Router

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Breadcrumb = ({ items }) => {
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState(null);

    // Set current path when pathname is available
    useEffect(() => {
        if (pathname) {
            setCurrentPath(pathname);
        }
    }, [pathname]);

    // Generate default breadcrumbs from pathname if no items provided
    const defaultItems = currentPath
        ? currentPath
              .split("/")
              .filter((segment) => segment)
              .map((segment, index, array) => ({
                  label: segment.charAt(0).toUpperCase() + segment.slice(1),
                  href: "/" + array.slice(0, index + 1).join("/"),
              }))
        : [];

    const breadcrumbItems = items || defaultItems;

    // Don't render until we have a valid path (handles SSR)
    if (!currentPath) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className=" ">
            <ol className="flex items-center flex-wrap gap-1 sm:gap-2 text-[12px] text-gray-600">
                <li className="flex-shrink-0">
                    <Link href="/" className="hover:text-gray-800 transition-colors font-medium">
                        Home
                    </Link>
                </li>
                {breadcrumbItems.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <span className="text-gray-400 mx-1">/</span>
                        {index === breadcrumbItems.length - 1 ? (
                            <span className="text-gray-800 font-medium">{item.label}</span>
                        ) : item.onClick ? (
                            <button onClick={item.onClick} className="hover:text-gray-800 transition-colors text-left font-medium" title={item.label}>
                                {item.label}
                            </button>
                        ) : (
                            <Link href={item.href} className="hover:text-gray-800 transition-colors font-medium" title={item.label}>
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
