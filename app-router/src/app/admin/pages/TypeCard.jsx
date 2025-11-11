// /src/admin/components/pages/TypeCard.jsx
"use client";
import React, { useState } from "react";
import MenuItemRow from "./MenuItemRow";

const TypeCard = ({
    menusByType,
    subMenus,
    selectedMenuId,
    draggingId,
    dragOverId,
    dragParentId,
    dragType,
    onSelectMenu,
    onToggleMenuVisibility,
    onToggleSubMenuVisibility,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDropMenu,
    onDropSub,
    onDragEnd,
}) => {
    const types = Object.keys(menusByType);
    const [activeTab, setActiveTab] = useState(types[0] || '');

    const renderMenuContent = (menus) => {
        // Filter out menus with name "Become a Reseller"
        const filteredMenus = menus.filter((menu) => menu.name !== "Become a Reseller");
        
        return filteredMenus.map((menu) => {
            const menuSubMenus = subMenus.filter(
                (subMenu) => subMenu.siteMenuId && subMenu.siteMenuId._id === menu._id
            ).sort((a, b) => (a.index || 0) - (b.index || 0));

            return (
                <div key={menu._id} className="mb-2">
                    <MenuItemRow
                        text={menu.name}
                        hasChildren={menuSubMenus.length > 0}
                        isExpanded={true}
                        hasIcon={true}
                        isSelected={menu._id === selectedMenuId}
                        isHidden={menu.isHide}
                        isDragging={draggingId === menu._id}
                        isDragOver={dragOverId === menu._id}
                        isDimmed={!!draggingId && ((dragType === 'menu' && draggingId !== menu._id) || (dragType === 'submenu' && dragParentId !== menu._id))}
                        onClick={() => onSelectMenu(menu._id)}
                        onToggleVisibility={() => onToggleMenuVisibility(menu)}
                        onDragStart={onDragStart(menu._id, 'menu')}
                        onDragOver={onDragOver(menu._id, 'menu')}
                        onDragLeave={onDragLeave}
                        onDrop={() => onDropMenu(menu._id)}
                        onDragEnd={onDragEnd}
                    />
                    {menuSubMenus.length > 0 && (
                        <div className="pl-5 mt-2">
                            {menuSubMenus.map((subMenu) => (
                                <MenuItemRow
                                    key={subMenu._id}
                                    text={subMenu.name}
                                    isChild={true}
                                    isDragging={draggingId === subMenu._id}
                                    isDragOver={dragOverId === subMenu._id}
                                    isDimmed={!!draggingId && dragType === 'submenu' && (dragParentId !== menu._id || draggingId === subMenu._id)}
                                    isSelected={subMenu._id === selectedMenuId}
                                    isHidden={subMenu.isHide}
                                    onClick={() => onSelectMenu(subMenu._id)}
                                    onToggleVisibility={() => onToggleSubMenuVisibility(subMenu)}
                                    onDragStart={onDragStart(subMenu._id, 'submenu')}
                                    onDragOver={onDragOver(subMenu._id, 'submenu')}
                                    onDragLeave={onDragLeave}
                                    onDrop={() => onDropSub(menu._id)(subMenu._id)}
                                    onDragEnd={onDragEnd}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="mb-4">
            {/* Tab Navigation */}
            <nav className="flex bg-gray-50 border-b border-gray-300">
                {types.map((type, index) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-6 py-3 text-base font-medium transition-all duration-200 relative flex-1 ${
                            activeTab === type
                                ? 'text-gray-900 bg-white border-b-2 border-red-500'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        } ${index === 0 ? 'rounded-tl-md' : ''} ${index === types.length - 1 ? 'rounded-tr-md' : ''}`}
                        style={{
                            borderBottom: activeTab === type ? '2px solid #ef4444' : 'none',
                            marginBottom: activeTab === type ? '-1px' : '0',
                        }}
                    >
                        {type}
                    </button>
                ))}
            </nav>

            {/* Tab Content */}
            <div className="mt-4 bg-white">
                {activeTab && menusByType[activeTab] && (
                    <div>
                        {renderMenuContent(menusByType[activeTab])}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypeCard;