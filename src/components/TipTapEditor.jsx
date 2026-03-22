import React, { useCallback, useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { uploadBlogImage } from "services/api/blog";
import { toast } from "react-toastify";

/* ─── Custom Floating Bubble Menu ─────────────────────────────────── */
const FloatingMenu = ({ editor }) => {
  const [pos, setPos]             = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl]     = useState("");
  const menuRef                   = useRef(null);
  const menuFocusedRef            = useRef(false); // true saat fokus ada di dalam menu
  const savedSelectionRef         = useRef(null);  // simpan seleksi sebelum input muncul

  /* Hitung posisi menu berdasarkan seleksi teks */
  const computePos = useCallback(() => {
    if (!editor) return;
    const { empty } = editor.state.selection;
    if (empty) { setPos(null); setShowLinkInput(false); return; }

    const domSel = window.getSelection();
    if (!domSel || domSel.rangeCount === 0) { setPos(null); return; }
    const range    = domSel.getRangeAt(0);
    const rect     = range.getBoundingClientRect();
    if (!rect || rect.width === 0) { setPos(null); return; }

    const editorEl   = editor.view.dom.closest(".tiptap-editor-container");
    const editorRect = editorEl ? editorEl.getBoundingClientRect() : { top: 0, left: 0 };
    const menuH      = menuRef.current ? menuRef.current.offsetHeight : 40;

    setPos({
      top:  rect.top  - editorRect.top  - menuH - 8,
      left: Math.max(0, rect.left - editorRect.left + rect.width / 2),
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      // Kalau menu sedang fokus (link input terbuka), jangan update posisi
      if (menuFocusedRef.current) return;
      computePos();
    };

    const handleBlur = () => {
      // Sembunyikan menu HANYA jika fokus tidak ada di dalam menu itu sendiri
      if (!menuFocusedRef.current) {
        setPos(null);
        setShowLinkInput(false);
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("blur",            handleBlur);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("blur",            handleBlur);
    };
  }, [editor, computePos]);

  if (!editor || !pos) return null;

  /* ── Helpers ── */
  const bubbleBtn = (onClick, active, title, children) => (
    <button
      key={title}
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      style={{
        background:   active ? "rgba(255,255,255,0.2)" : "transparent",
        border:       "none",
        borderRadius: 4,
        padding:      "4px 8px",
        cursor:       "pointer",
        color:        "#fff",
        fontSize:     13,
        fontWeight:   active ? 700 : 400,
        lineHeight:   1,
      }}
    >
      {children}
    </button>
  );

  const sep = (
    <span style={{
      display:    "inline-block", width: 1,
      background: "rgba(255,255,255,0.25)",
      alignSelf:  "stretch", margin: "2px 3px",
    }} />
  );

  /* Buka link input: simpan seleksi dulu */
  const handleOpenLink = () => {
    savedSelectionRef.current = {
      from: editor.state.selection.from,
      to:   editor.state.selection.to,
    };
    setLinkUrl(editor.getAttributes("link").href || "");
    setShowLinkInput(true);
  };

  /* Terapkan link dengan merestore seleksi yang tersimpan */
  const handleSetLink = () => {
    const url = linkUrl.trim();
    // Restore seleksi dulu sebelum apply
    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current;
      editor.commands.setTextSelection({ from, to });
    }
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      const href = url.startsWith("http") ? url : `https://${url}`;
      editor.chain().focus().setLink({ href, target: "_blank" }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
    savedSelectionRef.current = null;
    menuFocusedRef.current = false;
  };

  const handleCancelLink = () => {
    setShowLinkInput(false);
    setLinkUrl("");
    savedSelectionRef.current = null;
    menuFocusedRef.current = false;
    editor.commands.focus();
  };

  return (
    <div
      ref={menuRef}
      onMouseDown={(e) => e.preventDefault()}
      onFocusCapture={() => { menuFocusedRef.current = true; }}
      onBlurCapture={(e) => {
        // Cek apakah fokus masih di dalam menu
        if (!menuRef.current?.contains(e.relatedTarget)) {
          menuFocusedRef.current = false;
        }
      }}
      style={{
        position:   "absolute",
        top:        pos.top,
        left:       pos.left,
        transform:  "translateX(-50%)",
        zIndex:     9999,
        background: "#1e293b",
        borderRadius: 8,
        boxShadow:  "0 4px 20px rgba(0,0,0,0.4)",
        padding:    "3px 6px",
        display:    "flex",
        alignItems: "center",
        gap:        2,
        whiteSpace: "nowrap",
        pointerEvents: "all",
      }}
    >
      {/* tiny arrow */}
      <span style={{
        position: "absolute", bottom: -6, left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: "6px solid #1e293b",
      }} />

      {!showLinkInput ? (
        <>
          {bubbleBtn(() => editor.chain().focus().toggleBold().run(),   editor.isActive("bold"),   "Tebal",  <b>B</b>)}
          {bubbleBtn(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), "Miring", <em>I</em>)}
          {bubbleBtn(() => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"), "Coret",  <s>S</s>)}
          {bubbleBtn(() => editor.chain().focus().toggleCode().run(),   editor.isActive("code"),   "Code",
            <code style={{ fontFamily: "monospace", fontSize: 12 }}>{"<>"}</code>)}
          {sep}
          {bubbleBtn(handleOpenLink, editor.isActive("link"), "Tambah / Edit Link",
            <i className="fas fa-link" style={{ fontSize: 11 }} />)}
          {editor.isActive("link") && bubbleBtn(
            () => editor.chain().focus().unsetLink().run(),
            false, "Hapus Link",
            <i className="fas fa-unlink" style={{ fontSize: 11 }} />
          )}
        </>
      ) : (
        /* Link input inline */
        <>
          <input
            autoFocus
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleSetLink(); }
              if (e.key === "Escape") handleCancelLink();
            }}
            style={{
              background:    "rgba(255,255,255,0.1)",
              border:        "1px solid rgba(255,255,255,0.25)",
              borderRadius:  4,
              color:         "#fff",
              padding:       "3px 8px",
              fontSize:      12,
              outline:       "none",
              width:         200,
            }}
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSetLink(); }}
            title="Simpan"
            style={{ background: "#22c55e", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", color: "#fff", fontSize: 12 }}
          ><i className="fas fa-check" /></button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleCancelLink(); }}
            title="Batal"
            style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", color: "#fff", fontSize: 12 }}
          ><i className="fas fa-times" /></button>
        </>
      )}
    </div>
  );
};

/* ─── Static Toolbar (Compact) ────────────────────────────────────── */
const StaticToolbar = ({ editor }) => {
  const fileInputRef = useRef(null);

  const addImage = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2000000) { toast.error("Ukuran gambar maksimal 2MB"); return; }
    try {
      const id = toast.loading("Mengunggah gambar...");
      const res = await uploadBlogImage(file);
      let imageUrl = res.url;
      if (imageUrl && !imageUrl.startsWith("http")) imageUrl = "https://go.harmonylaundry.my.id" + imageUrl;
      editor.chain().focus().setImage({ src: imageUrl }).run();
      toast.update(id, { render: "Gambar berhasil diunggah", type: "success", isLoading: false, autoClose: 3000 });
    } catch { toast.error("Gagal mengunggah gambar"); }
    e.target.value = "";
  }, [editor]);

  if (!editor) return null;

  const btn = (onClick, active, title, children) => (
    <button
      key={title}
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      style={{
        background: active ? "#e9ecef" : "transparent",
        border:     "none",
        borderRadius: 4,
        padding:    "4px 8px",
        cursor:     "pointer",
        fontWeight: active ? 700 : 400,
        color:      active ? "#495057" : "#6c757d",
        fontSize:   13,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );

  const sep = (id) => <span key={`sep-${id}`} style={{ display: "inline-block", width: 1, background: "#dee2e6", alignSelf: "stretch", margin: "2px 4px" }} />;

  return (
    <div style={{
      display:     "flex",
      flexWrap:    "wrap",
      alignItems:  "center",
      gap:         2,
      padding:     "6px 8px",
      borderBottom: "1px solid #dee2e6",
      background:  "#f8f9fa",
      borderTopLeftRadius:  "inherit",
      borderTopRightRadius: "inherit",
    }}>
      {btn(() => editor.chain().focus().setParagraph().run(),                   editor.isActive("paragraph"),              "Paragraf",  "P")}
      {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(),      editor.isActive("heading",  { level: 1 }), "Heading 1", "H1")}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(),      editor.isActive("heading",  { level: 2 }), "Heading 2", "H2")}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(),      editor.isActive("heading",  { level: 3 }), "Heading 3", "H3")}
      {sep('heading')}
      {btn(() => editor.chain().focus().setTextAlign("left").run(),             editor.isActive({ textAlign: "left" }),    "Kiri",      <i className="fas fa-align-left" />)}
      {btn(() => editor.chain().focus().setTextAlign("center").run(),           editor.isActive({ textAlign: "center" }),  "Tengah",    <i className="fas fa-align-center" />)}
      {btn(() => editor.chain().focus().setTextAlign("right").run(),            editor.isActive({ textAlign: "right" }),   "Kanan",     <i className="fas fa-align-right" />)}
      {btn(() => editor.chain().focus().setTextAlign("justify").run(),          editor.isActive({ textAlign: "justify" }), "Justify",   <i className="fas fa-align-justify" />)}
      {sep('align')}
      {btn(() => editor.chain().focus().toggleBulletList().run(),               editor.isActive("bulletList"),  "Bullet",     <i className="fas fa-list-ul" />)}
      {btn(() => editor.chain().focus().toggleOrderedList().run(),              editor.isActive("orderedList"), "Numbered",   <i className="fas fa-list-ol" />)}
      {btn(() => editor.chain().focus().toggleBlockquote().run(),               editor.isActive("blockquote"), "Blockquote", <i className="fas fa-quote-right" />)}
      {sep('list')}
      <button
        type="button" title="Sisipkan Gambar"
        onMouseDown={(e) => { e.preventDefault(); fileInputRef.current.click(); }}
        style={{ background: "transparent", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", color: "#6c757d", fontSize: 13 }}
      >
        <i className="fas fa-image" />
      </button>
      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={addImage} />
      {sep('media')}
      {btn(() => editor.chain().focus().undo().run(), false, "Undo", <i className="fas fa-undo" />)}
      {btn(() => editor.chain().focus().redo().run(), false, "Redo", <i className="fas fa-redo" />)}
    </div>
  );
};

/* ─── Main TipTap Editor Component ────────────────────────────────── */
export const TipTapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    editorProps: {
      attributes: {
        class: "tiptap-inner",
        style: "min-height: 380px; height: auto; cursor: text; outline: none; padding: 14px;",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div
      className="tiptap-editor-container form-control"
      style={{ display: "flex", flexDirection: "column", height: "auto", minHeight: 430, padding: 0, position: "relative", overflow: "visible" }}
    >
      <StaticToolbar editor={editor} />
      <FloatingMenu   editor={editor} />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <EditorContent editor={editor} style={{ flexGrow: 1, display: "flex", flexDirection: "column" }} />
      </div>
    </div>
  );
};

export default TipTapEditor;
