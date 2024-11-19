import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  Sparkles,
  Strikethrough,
} from "lucide-react";

const EditorElements = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group p-5">
      <div className="button-group flex gap-6">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "is-active text-blue-500"
              : ""
          }
        >
          <Heading1 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "is-active text-blue-500"
              : ""
          }
        >
          <Heading2 />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "is-active text-blue-500"
              : ""
          }
        >
          <Heading3 />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active text-blue-500 " : ""}
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active text-blue-500" : ""}
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active text-blue-500" : ""}
        >
          <Strikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={
            editor.isActive("highlight") ? "is-active text-blue-500" : ""
          }
        >
          <Highlighter />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "is-active text-blue-500" : ""
          }
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock") ? "is-active text-blue-500" : ""
          }
        >
          <Code />
        </button>
        <button>
          <Sparkles />
        </button>
      </div>
    </div>
  );
};
export default EditorElements;
