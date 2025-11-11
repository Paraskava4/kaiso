// /src/admin/components/pages/SiteMenuPanel.jsx
"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectMenu, setMenus, setSubMenus, reorderMenus, reorderSubMenus, refreshMenuData } from "../../../redux/pages/pagesSlice";
import MenuItemRow from "./MenuItemRow";
import TypeCard from "./TypeCard";
import DividerLine from "../../../components/shared/DividerLine";
import { fetchAndProcessAllSiteData, hideSiteMenu, hideSiteSubMenu, updateSiteMenuIndex, updateSiteSubMenuIndex } from "../../../api/pages";
import { Typography } from "@mui/material";
import { toast } from "react-hot-toast";

const SiteMenuPanel = () => {
    const menus = useSelector((state) => state?.pages?.menus || []);
    const subMenus = useSelector((state) => state?.pages?.subMenus || []);
    const selectedMenuId = useSelector((state) => state?.pages?.selectedMenuId);
    const selectedPageId = useSelector((state) => state?.pages?.selectedPageId);
    const dispatch = useDispatch();
    const [draggingId, setDraggingId] = React.useState(null);
    const [dragType, setDragType] = React.useState(null);
    const [dragOverId, setDragOverId] = React.useState(null);
    const [dragParentId, setDragParentId] = React.useState(null);

    const toggleMenuVisibility = async (menu) => {
        try {
            await hideSiteMenu(menu._id);
            // Optimistically toggle local state
            if (Array.isArray(menus)) {
                dispatch(setMenus(menus.map((m) => (m._id === menu._id ? { ...m, isHide: !m.isHide } : m))));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // DRAG HELPERS
    const handleDragStart = (id, type) => (e) => {
        setDraggingId(id);
        setDragType(type);
        if (type === "submenu" && Array.isArray(subMenus)) {
            const found = subMenus.find((s) => s._id === id);
            const parentId = found?.siteMenuId?._id || null;
            setDragParentId(parentId);
        } else {
            setDragParentId(null);
        }
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
    };

    const handleDragOver = (targetId, type) => (e) => {
        e.preventDefault();
        if (dragType !== type) return; // block cross-type
        setDragOverId(targetId);
    };

    const handleDragLeave = () => setDragOverId(null);

    const handleDragEnd = () => {
        // Reset all drag states when drag operation ends
        // This handles cases where items are dropped outside valid zones
        setDraggingId(null);
        setDragOverId(null);
        setDragParentId(null);
        setDragType(null);
    };

    const handleDropMenu = async (targetId) => {
        if (dragType !== "menu" || !draggingId || !Array.isArray(menus)) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }

        // If dropped on the same item, treat as no change
        if (draggingId === targetId) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }


        const orderedIds = [...menus].sort((a, b) => a.index - b.index).map((m) => m._id);
        const from = orderedIds.indexOf(draggingId);
        const to = orderedIds.indexOf(targetId);


        if (from === -1 || to === -1) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }

        // Check if the drop would result in no actual change (adjacent positions)
        if (Math.abs(from - to) <= 1 && from !== to) {
            // If dropping right next to current position, check if it's actually a change
            const newOrderedIds = [...orderedIds];
            newOrderedIds.splice(to, 0, newOrderedIds.splice(from, 1)[0]);

            // Compare if the final order would be the same
            const isNoChange = orderedIds.every((id, index) => id === newOrderedIds[index]);
            if (isNoChange) {
                setDraggingId(null);
                setDragOverId(null);
                setDragParentId(null);
                return;
            }
        }

        // Reorder the array
        orderedIds.splice(to, 0, orderedIds.splice(from, 1)[0]);

        // Optimistically update local state
        dispatch(reorderMenus(orderedIds));

        try {
            await updateSiteMenuIndex(orderedIds);
            // Refresh data from server to ensure consistency using unified API
            const result = await fetchAndProcessAllSiteData();
            if (result.success) {
                const { menus: allMenus, subMenus: allSubMenus } = result.data;
                dispatch(refreshMenuData({ menus: allMenus, subMenus: allSubMenus }));
                toast.success("Menu order updated");
            } else {
                console.error("Failed to refresh data after update:", result.error);
                toast.error("Updated but failed to refresh data");
            }
        } catch (err) {
            console.error("Failed to update menu order:", err);
            // Revert optimistic update by refreshing from server
            try {
                const result = await fetchAndProcessAllSiteData();
                if (result.success) {
                    const { menus: allMenus, subMenus: allSubMenus } = result.data;
                    dispatch(refreshMenuData({ menus: allMenus, subMenus: allSubMenus }));
                }
            } catch (refreshErr) {
                console.error("Failed to refresh data:", refreshErr);
            }
            toast.error("Failed to update order");
        }

        setDraggingId(null);
        setDragOverId(null);
        setDragParentId(null);
    };

    const handleDropSub = (parentId) => async (targetId) => {
        if (dragType !== "submenu" || !draggingId || !Array.isArray(subMenus)) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }

        // If dropped on the same item, treat as no change
        if (draggingId === targetId) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }


        const siblings = [...subMenus.filter((s) => s.siteMenuId && s.siteMenuId._id === parentId)].sort((a, b) => a.index - b.index);
        const ids = siblings.map((s) => s._id);
        const from = ids.indexOf(draggingId);
        const to = ids.indexOf(targetId);


        if (from === -1 || to === -1) {
            setDraggingId(null);
            setDragOverId(null);
            setDragParentId(null);
            return;
        }

        // Check if the drop would result in no actual change (adjacent positions)
        if (Math.abs(from - to) <= 1 && from !== to) {
            // If dropping right next to current position, check if it's actually a change
            const newIds = [...ids];
            newIds.splice(to, 0, newIds.splice(from, 1)[0]);

            // Compare if the final order would be the same
            const isNoChange = ids.every((id, index) => id === newIds[index]);
            if (isNoChange) {
                setDraggingId(null);
                setDragOverId(null);
                setDragParentId(null);
                return;
            }
        }

        // Reorder the array
        ids.splice(to, 0, ids.splice(from, 1)[0]);

        // Optimistically update local state
        dispatch(reorderSubMenus({ parentId, subMenuIds: ids }));

        try {
            await updateSiteSubMenuIndex(ids);
            // Refresh data from server to ensure consistency using unified API
            const result = await fetchAndProcessAllSiteData();
            if (result.success) {
                const { menus: allMenus, subMenus: allSubMenus } = result.data;
                dispatch(refreshMenuData({ menus: allMenus, subMenus: allSubMenus }));
                toast.success("Sub menu order updated");
            } else {
                console.error("Failed to refresh data after submenu update:", result.error);
                toast.error("Updated but failed to refresh data");
            }
        } catch (err) {
            console.error("Failed to update submenu order:", err);
            // Revert optimistic update by refreshing from server
            try {
                const result = await fetchAndProcessAllSiteData();
                if (result.success) {
                    const { menus: allMenus, subMenus: allSubMenus } = result.data;
                    dispatch(refreshMenuData({ menus: allMenus, subMenus: allSubMenus }));
                }
            } catch (refreshErr) {
                console.error("Failed to refresh data:", refreshErr);
            }
            toast.error("Failed to update order");
        }

        setDraggingId(null);
        setDragOverId(null);
        setDragParentId(null);
    };

    const toggleSubMenuVisibility = async (sub) => {
        try {
            // Get the parent menu ID from the submenu's siteMenuId
            const siteMenuId = sub.siteMenuId?._id;
            if (!siteMenuId) {
                console.error("Cannot toggle submenu visibility: missing parent menu ID");
                toast.error("Cannot toggle submenu: missing parent menu");
                return;
            }

            await hideSiteSubMenu(siteMenuId, sub._id);
            if (Array.isArray(subMenus)) {
                dispatch(setSubMenus(subMenus.map((s) => (s._id === sub._id ? { ...s, isHide: !sub.isHide } : s))));
            }
            toast.success(`Submenu ${sub.isHide ? "shown" : "hidden"} successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to toggle submenu visibility");
        }
    };

    // Data loading is now handled by the parent Pages component

    // Early return if data is not available
    if (!Array.isArray(menus) || !Array.isArray(subMenus)) {
        return (
            <section className="max-w-120 w-full bg-white p-5 border-r border-zinc-700/30 text-zinc-700 min-h-screen">
                <header className="text-lg font-medium text-zinc-800">
                    <Typography variant="h6">Site Menu</Typography>
                </header>
                <DividerLine />
                <Typography variant="body2" color="text.secondary">
                    Loading menus...
                </Typography>
            </section>
        );
    }

    // Filter menus belonging to the currently selected site page and sort by index
    // Also exclude menus with name "Become a Reseller"
    const filteredMenus = menus
        .filter((menu) => menu.sitePageId && menu.sitePageId._id === selectedPageId)
        .filter((menu) => menu.name !== "Become a Reseller")
        .sort((a, b) => (a.index || 0) - (b.index || 0));

    // Filter submenus belonging to the currently selected site page
    const filteredSubMenus = subMenus.filter((subMenu) => subMenu.sitePageId && subMenu.sitePageId._id === selectedPageId);

    // Separate menus with and without type
    // Additional filtering to exclude "Become a Reseller" menus (redundant but explicit)
    const menusWithType = filteredMenus.filter((menu) => menu.categoryId && menu.categoryId.type);
    const menusWithoutType = filteredMenus.filter((menu) => !menu.categoryId || !menu.categoryId.type);

    // Group menus by type
    const menusByType = menusWithType.reduce((acc, menu) => {
        const type = menu.categoryId.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(menu);
        return acc;
    }, {});

    // Check if we should use TypeCard (only if there are 2 or more types)
    const shouldUseTypeCard = Object.keys(menusByType).length > 1;

    // If only one type, treat those menus as regular menus
    const regularMenus = shouldUseTypeCard ? menusWithoutType : [...menusWithoutType, ...menusWithType];

    // Group submenus by their parent menu and sort children by index for regular menus
    const menuWithSubMenus = regularMenus.map((menu) => ({
        ...menu,
        children: filteredSubMenus
            .filter((subMenu) => subMenu.siteMenuId && subMenu.siteMenuId._id === menu._id)
            .sort((a, b) => (a.index || 0) - (b.index || 0)),
    }));

    const handleContainerDrop = (e) => {
        e.preventDefault();
        // If dropped in empty area, just reset drag states
        handleDragEnd();
    };

    const handleContainerDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <section
            className="max-w-120 w-full bg-white p-5 border-r border-zinc-700/30 text-zinc-700 min-h-screen"
            onDrop={handleContainerDrop}
            onDragOver={handleContainerDragOver}
        >
            <header className="text-lg font-medium text-zinc-800">
                <Typography variant="h6">Site Menu</Typography>
            </header>
            <DividerLine />
            <nav className="text-base">
                {menuWithSubMenus.length === 0 && Object.keys(menusByType).length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No menus available
                    </Typography>
                ) : (
                    <>
                        {/* Render Type Cards only if there are 2 or more types */}
                        {shouldUseTypeCard && (
                            <TypeCard
                                menusByType={menusByType}
                                subMenus={filteredSubMenus}
                                selectedMenuId={selectedMenuId}
                                draggingId={draggingId}
                                dragOverId={dragOverId}
                                dragParentId={dragParentId}
                                dragType={dragType}
                                onSelectMenu={(menuId) => dispatch(selectMenu(menuId))}
                                onToggleMenuVisibility={toggleMenuVisibility}
                                onToggleSubMenuVisibility={toggleSubMenuVisibility}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDropMenu={handleDropMenu}
                                onDropSub={handleDropSub}
                                onDragEnd={handleDragEnd}
                            />
                        )}

                        {/* Render Regular Menus */}
                        {menuWithSubMenus.map((item) => (
                            <div key={item._id} className="mb-2">
                                <MenuItemRow
                                    text={item.name}
                                    hasChildren={item.children.length > 0}
                                    isExpanded={true} // Consider making this dynamic with state
                                    hasIcon={true}
                                    isSelected={item._id === selectedMenuId}
                                    isHidden={item.isHide}
                                    // Drag state flags for visual feedback
                                    isDragging={draggingId === item._id}
                                    isDragOver={dragOverId === item._id}
                                    isDimmed={
                                        !!draggingId &&
                                        ((dragType === "menu" && draggingId !== item._id) || (dragType === "submenu" && dragParentId !== item._id))
                                    }
                                    onClick={() => dispatch(selectMenu(item._id))}
                                    onToggleVisibility={() => toggleMenuVisibility(item)}
                                    onDragStart={handleDragStart(item._id, "menu")}
                                    onDragOver={handleDragOver(item._id, "menu")}
                                    onDragLeave={handleDragLeave}
                                    onDrop={() => handleDropMenu(item._id)}
                                    onDragEnd={handleDragEnd}
                                />
                                {item.children.length > 0 && (
                                    <div className="pl-5 mt-2">
                                        {item.children.map((child) => (
                                            <MenuItemRow
                                                key={child._id}
                                                text={child.name}
                                                isChild={true}
                                                // Drag flags
                                                isDragging={draggingId === child._id}
                                                isDragOver={dragOverId === child._id}
                                                isDimmed={!!draggingId && dragType === "submenu" && (dragParentId !== item._id || draggingId === child._id)}
                                                isSelected={child._id === selectedMenuId}
                                                isHidden={child.isHide}
                                                // Disable onClick for sub-menu items to prevent SEO editor panel from opening
                                                onClick={null}
                                                onToggleVisibility={() => toggleSubMenuVisibility(child)}
                                                onDragStart={handleDragStart(child._id, "submenu")}
                                                onDragOver={handleDragOver(child._id, "submenu")}
                                                onDragLeave={handleDragLeave}
                                                onDrop={() => handleDropSub(item._id)(child._id)}
                                                onDragEnd={handleDragEnd}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </nav>
        </section>
    );
};

export default SiteMenuPanel;