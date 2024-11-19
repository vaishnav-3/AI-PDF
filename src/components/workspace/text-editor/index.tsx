"use client";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import EditorElements from "./EditorElements";

const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write here...",
      }),
      Highlight,
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5 w-full",
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
