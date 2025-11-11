"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

let Quill;
let Table;
let TableBetter;
let tableModuleRegistered = false;
let tableBetterModuleRegistered = false;

export default function TextEditor({ onChange, value, isLoadingEditor }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const isUpdatingRef = useRef(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !editorRef.current || quillRef.current) return;
        if (typeof isLoadingEditor === "function") isLoadingEditor(true);

        let isMounted = true;

        (async () => {
            try {
                const quillLib = await import("quill");
                Quill = quillLib.default ?? quillLib;
                Table = (await import("quill/modules/table")).default;
                TableBetter = (await import("quill-table-better")).default;

                if (isMounted && typeof Quill?.register === "function") {
                    if (!tableModuleRegistered) {
                        Quill.register("modules/table", Table);
                        tableModuleRegistered = true;
                    }
                    if (!tableBetterModuleRegistered) {
                        Quill.register({ "modules/table-better": TableBetter }, true);
                        tableBetterModuleRegistered = true;
                    }
                    Quill.debug = "error";
                }

                if (isMounted && !quillRef.current) {
                    quillRef.current = new Quill(editorRef.current, {
                        theme: "snow",
                        modules: {
                            toolbar: [
                                [{ font: [] }, { size: [] }],
                                ["bold", "italic", "underline", "strike"],
                                [{ color: [] }, { background: [] }],
                                [{ script: "super" }, { script: "sub" }],
                                [{ header: 1 }, { header: 2 }, { header: 3 }, "blockquote", "code-block"],
                                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                ["table-better"],
                                [{ direction: "rtl" }, { align: [] }],
                                ["link", "image", "video"],
                                ["clean"],
                            ],
                            table: false,
                            "table-better": {
                                language: "en_US",
                                toolbarTable: true,
                            },
                            keyboard: {
                                bindings: TableBetter?.keyboardBindings,
                            },
                        },
                        scrollingContainer: null,
                    });

                    setIsEditorReady(true);

                    quillRef.current.on("text-change", () => {
                        if (isUpdatingRef.current) return;
                        const html = quillRef.current.root.innerHTML;
                        const text = quillRef.current.getText();
                        if (onChange) {
                            onChange({
                                html: html,
                                text: text.trim(),
                                delta: quillRef.current.getContents(),
                            });
                        }
                    });
                }
            } catch (error) {
                console.error("Error initializing Quill editor:", error);
            } finally {
                if (isMounted && typeof isLoadingEditor === "function") isLoadingEditor(false);
            }
        })();

        return () => {
            isMounted = false;
            if (quillRef.current) {
                quillRef.current.off("text-change");
                quillRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (quillRef.current && isEditorReady && value !== undefined && quillRef.current.root.innerHTML !== value) {
            isUpdatingRef.current = true;
            try {
                // Preserve current selection to avoid jumping to bottom
                const previousSelection = quillRef.current.getSelection();

                // Clear existing content
                quillRef.current.deleteText(0, quillRef.current.getLength());

                // Use updateContents as recommended by quill-table-better to properly render tables
                const delta = quillRef.current.clipboard.convert({ html: value || "" });
                quillRef.current.updateContents(delta, Quill.sources.USER);

                // Restore previous selection (bounded to content length) without forcing scroll
                if (previousSelection && typeof previousSelection.index === "number") {
                    const safeIndex = Math.min(previousSelection.index, quillRef.current.getLength() - 1);
                    const safeLength = Math.min(previousSelection.length || 0, Math.max(quillRef.current.getLength() - safeIndex, 0));
                    quillRef.current.setSelection(safeIndex, safeLength, Quill.sources.SILENT);
                }
            } finally {
                isUpdatingRef.current = false;
            }
        }
    }, [value, isEditorReady]);

    return (
        <div className="height-of-text-editor">
            <div ref={editorRef} />
        </div>
    );
}
