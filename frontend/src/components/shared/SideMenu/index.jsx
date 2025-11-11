"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronDown, CircleDot } from "lucide-react";
import { useGetAllMenuQuery, useGetMenuAccessQuery } from "@/api/menu";
import { isStatusInclude } from "@/utils/axiosInstance";
import { isValidArray } from "@/utils/validation/array";
import { getLocalStorage, setLocalStorage } from "@/utils/localStorage";
import { useAccess } from "@/utils/constants/accessContext";

const MenuItem = ({ icon: Icon, text, rightIcon: RightIcon, isActive = false, onClick, indent = false, isSubItem = false }) => {
    return (
        <li>
            <button
                className={`flex justify-between items-center px-4 py-3.5 mt-2 w-full rounded-xl transition duration-200 hover:bg-[#243252] hover:bg-opacity-20 focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-opacity-50 ${
                    isActive ? "bg-[#243252] bg-opacity-40 border border-[#3B4F73]" : ""
                }`}
                onClick={onClick}
                aria-current={isActive ? "page" : undefined}
            >
                <div className={`flex gap-2 items-center w-full ${indent ? "pl-3" : ""}`}>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={text} width={20} height={20} className="object-contain text-white" />
                    ) : (
                        <Icon className="text-white w-5 h-5" />
                    )}
                    <span className={`text-white ${isSubItem ? "text-xs" : ""}`}>{text}</span>
                </div>
                {RightIcon && <RightIcon className="text-white w-5 h-5" />}
            </button>
        </li>
    );
};

const SideMenu = () => {
    const { updateAccess } = useAccess();
    const [menuData, setMenuData] = useState([]);
    const [session, setSession] = useState(null);
    const [limitedMenuAccess, setLimitedMenuAccess] = useState([]);
    const [showTabsOnSideBar, setShowTabsOnSideBar] = useState([]);

    const router = useRouter();
    const pathname = usePathname();

    // Extract route parts after /admin/
    const match = pathname.match(/\/admin\/?(.+)?$/);
    const routePart = match && match[1] ? match[1] : "home";
    const [activeMain, activeSub] = routePart.split("/");
    const activeItem = activeMain || "home";

    const userId = session?.user?._id;

    const { data: getAllMenuDataResponse } = useGetAllMenuQuery();
    const { data: getMenuAccessResponse } = useGetMenuAccessQuery({ userId: userId }, { skip: !userId });

    useEffect(() => {
        const sessionData = getLocalStorage("session");
        if (sessionData) {
            setSession(JSON.parse(sessionData));
        }
    }, []);

    useEffect(() => {
        if (!isStatusInclude(getAllMenuDataResponse?.status)) return;
        setMenuData(getAllMenuDataResponse?.data);
    }, [getAllMenuDataResponse]);

    useEffect(() => {
        if (!isStatusInclude(getMenuAccessResponse?.status)) return;
        setLimitedMenuAccess(getMenuAccessResponse?.data);
    }, [getMenuAccessResponse, userId]);

    // Build dynamic menu items from API
    const dynamicMenuItems = React.useMemo(() => {
        const routeIdByName = {
            Home: "home",
            Masters: "masters",
            Inquires: "inquires",
            Career: "career",
            Reports: "reports",
            Articles: "articles",
            Pages: "pages",
            Reviews: "reviews",
            Role: "role",
        };
        const defaultIcon = "/icons/inquiry.png";
        const iconById = {
            home: "/icons/Home.png",
            masters: "/icons/Masters.png",
            inquires: "/icons/inquiry.png",
            career: "/icons/inquiry.png",
            reports: "/icons/Reports.png",
            articles: "/icons/Articles.png",
            pages: "/icons/Pages.png",
            reviews: "/icons/Reviews.png",
            role: "/icons/Role.png",
        };

        if (!Array.isArray(menuData) || menuData.length === 0) return [];

        return menuData.map((menu) => {
            const text = menu?.name || "";
            const id = routeIdByName[text] || (typeof text === "string" ? text.toLowerCase().replace(/\s+/g, "-") : "");
            const icon = iconById[id] || defaultIcon;

            let subItems;
            if (id === "inquires") {
                subItems = [
                    { id: "request-for-sample", text: "Request for sample", icon: CircleDot },
                    { id: "checkouts", text: "Checkouts", icon: CircleDot },
                    { id: "inquiry-before-buy", text: "Inquiry Before Buy", icon: CircleDot },
                    { id: "become-a-reseller", text: "Become a Reseller", icon: CircleDot },
                    { id: "contact-us", text: "Contact-us", icon: CircleDot },
                    { id: "need-customization", text: "Need Customization", icon: CircleDot },
                    { id: "other", text: "Other", icon: CircleDot },
                ];
            } else if (id === "reports") {
                subItems = [{ id: "domain", text: "Domain", icon: CircleDot }];
            } else if (id === "articles") {
                subItems = [
                    { id: "domain", text: "Domain", icon: CircleDot },
                    { id: "blog-list-pages", text: "Blog List Pages", icon: CircleDot },
                ];
            }

            return {
                id,
                text,
                icon,
                subItems,
                access_id: menu?._id,
            };
        });
    }, [menuData]);

    useEffect(() => {
        const accessSidebar = dynamicMenuItems
            ?.map((sidebarItem) => {
                const matchedAccess = limitedMenuAccess?.find((limitedMenuAccessItem) => sidebarItem?.access_id === limitedMenuAccessItem?.menuId?._id);
                const access = matchedAccess?.read || matchedAccess?.create || matchedAccess?.update || matchedAccess?.delete;
                if (matchedAccess && access) {
                    return {
                        ...sidebarItem, // Include all existing sidebar item properties
                        menuId: matchedAccess?.menuId,
                        create: matchedAccess?.create,
                        read: matchedAccess?.read,
                        update: matchedAccess?.update,
                        delete: matchedAccess?.delete,
                    };
                }
                return null; // Exclude items that don't match
            })
            .filter(Boolean); // Remove null values

        if (isValidArray(accessSidebar)) {
            setShowTabsOnSideBar([...accessSidebar]);
        }
    }, [limitedMenuAccess, dynamicMenuItems]);

    // Ensure access context reflects the current route's menu on load and route change
    useEffect(() => {
        const current = showTabsOnSideBar?.find((m) => m.id === activeItem);
        if (current) {
            const nextAccess = {
                create: current?.create,
                read: current?.read,
                update: current?.update,
                delete: current?.delete,
                menuId: current?.menuId?._id,
            };
            setLocalStorage("ACCESS_ARRAY_STOR", JSON.stringify(nextAccess));
            updateAccess(nextAccess);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeItem, showTabsOnSideBar]);

    // Automatically expand menu section if current route is inside its submenu
    const [expanded, setExpanded] = useState(() => {
        const init = {};
        const parentWithSub = dynamicMenuItems.find((m) => m.subItems && m.id === activeItem);
        if (parentWithSub) {
            init[parentWithSub.id] = true;
        }
        return init;
    });

    const handleMenuItemClick = (item) => {
        if (item.subItems) {
            setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
        }
        const nextAccess = {
            create: item?.create,
            read: item?.read,
            update: item?.update,
            delete: item?.delete,
            menuId: item?.menuId?._id,
        };
        setLocalStorage("ACCESS_ARRAY_STOR", JSON.stringify(nextAccess));
        updateAccess(nextAccess);
        router.push(`/admin/${item.id}`);
    };

    const handleSubItemClick = (parentId, sub) => {
        router.push(`/admin/${parentId}/${sub.id}`);
    };

    return (
        <nav
            className="text-sm font-medium overflow-x-hidden text-white bg-[#0C1C3F] w-full sm:max-w-[210px] max-sm:w-[60%] h-full overflow-y-auto scrollbar-hide"
            role="navigation"
            aria-label="Main navigation"
            style={{
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
            }}
        >
            <style jsx>{`
                nav::-webkit-scrollbar {
                    display: none; /* Chrome, Safari and Opera */
                    width: 0;
                    background: transparent;
                }
            `}</style>
            <div className="w-full">
                {/* <header className="px-4 py-3 text-white">
                    <h1 className="text-sm font-medium">Kaiso</h1>
                </header> */}
                <ul className="list-none p-0 m-0">
                    {isValidArray(showTabsOnSideBar) &&
                        showTabsOnSideBar?.map((item) => (
                            <React.Fragment key={item.id}>
                                <MenuItem
                                    icon={item.icon}
                                    text={item.text}
                                    rightIcon={item.subItems ? (expanded[item.id] ? ChevronDown : ChevronRight) : null}
                                    isActive={item.id === activeItem}
                                    onClick={() => handleMenuItemClick(item)}
                                />
                                {item.subItems && expanded[item.id] && (
                                    <ul className="list-none p-0 m-0">
                                        {item.subItems.map((sub) => (
                                            <MenuItem
                                                key={sub.id}
                                                icon={sub.icon}
                                                text={sub.text}
                                                isActive={item.id === activeItem && sub.id === activeSub}
                                                onClick={() => handleSubItemClick(item.id, sub)}
                                                indent
                                                isSubItem
                                            />
                                        ))}
                                    </ul>
                                )}
                            </React.Fragment>
                        ))}
                </ul>
            </div>
        </nav>
    );
};

export default SideMenu;
