// /src/admin/components/pages/SitePagesPanel.jsx
"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPage } from "../../../redux/pages/pagesSlice";
import MenuItemRow from "./MenuItemRow";
import DividerLine from "../../../components/shared/DividerLine";
import { Typography } from "@mui/material";

const SitePagesPanel = () => {
    const pages = useSelector((state) => state.pages.pages);
    const selectedPageId = useSelector((state) => state.pages.selectedPageId);
    const dispatch = useDispatch();

    return (
        <section className="max-w-96 w-full bg-white border-r border-zinc-700/30 p-5 text-zinc-700 ">
            <header className="text-lg font-medium text-zinc-800">
                <Typography variant="h6">Site Pages</Typography>
            </header>
            <DividerLine />
            <nav className="text-base">
                {pages.map((page) => (
                    <MenuItemRow
                        key={page._id}
                        text={page.title || page.name}
                        hasIcon={false}
                        isSelected={page._id === selectedPageId}
                        onClick={() => dispatch(selectPage(page._id))}
                    />
                ))}
            </nav>
        </section>
    );
};

export default SitePagesPanel;
