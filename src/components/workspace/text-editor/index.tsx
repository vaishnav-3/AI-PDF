"use client";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import EditorElements from "./EditorElements";
import TextAlign from "@tiptap/extension-text-align";
const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write here...",
      }),
      Highlight,
      TextAlign,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
  });

  return (
    <div>
      <div>
        <EditorElements editor={editor} />
      </div>
      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
export default TextEditor;
