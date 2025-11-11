"use client";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

let Quill;
let Table;
let TableBetter;

export default function TextEditor({ onChange, value, isLoadingEditor }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const isUpdatingRef = useRef(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !editorRef.current) return;
        if (typeof isLoadingEditor === "function") isLoadingEditor(true);
        (async () => {
            const quillLib = await import("quill");
            Quill = quillLib.default ?? quillLib;
            Table = (await import("quill/modules/table")).default;
            TableBetter = (await import("quill-table-better")).default;

            if (typeof Quill?.register === "function") {
                Quill.register("modules/table", Table);
                Quill.register({ "modules/table-better": TableBetter }, true);
            }

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
            });

            // Set initial value only after editor is ready
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

            // quill-table-better provides its own toolbar and UI; no custom handler needed

            if (typeof isLoadingEditor === "function") isLoadingEditor(true);
        })();
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
