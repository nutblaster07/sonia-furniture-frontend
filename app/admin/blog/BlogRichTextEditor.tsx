
"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown } from "@tiptap/markdown";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function BlogRichTextEditor({
  value,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-3 outline-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getMarkdown() !== value) {
      editor.commands.setContent(value, {
        contentType: "markdown",
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[280px] p-4">Loading editor...</div>;
  }

  const buttonClass = (active = false) =>
    `rounded-md border px-3 py-2 text-sm ${
      active
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }`;

  
function addLink() {
  const activeEditor = editor;
  if (!activeEditor) return;

  const url = window.prompt(
    "Enter a link URL:",
    activeEditor.getAttributes("link").href || "",
  );

  if (url === null) return;

  if (url.trim() === "") {
    activeEditor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .run();
    return;
  }

  try {
    const parsed = new URL(url.trim());

    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      window.alert("Enter a valid HTTP, HTTPS, or email URL.");
      return;
    }

    activeEditor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: parsed.href })
      .run();
  } catch {
    window.alert("Enter a valid URL, including https://");
  }
}


  const toolbarButton = (
    label: string,
    action: () => void,
    active = false,
  ) => (
    <button
      key={label}
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={action}
      className={buttonClass(active)}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">
        {toolbarButton("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {toolbarButton("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {toolbarButton("Heading 1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {toolbarButton("Heading 2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {toolbarButton("Bullet list", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {toolbarButton("Numbered list", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {toolbarButton("Link", addLink, editor.isActive("link"))}
        {toolbarButton("Clear formatting", () => editor.chain().focus().unsetAllMarks().run())}
      </div>

      <EditorContent editor={editor} />

      <p className="border-t px-4 py-2 text-xs text-gray-500">
        Use the toolbar to format text. Markdown is generated automatically when you save.
      </p>
    </div>
  );
}
