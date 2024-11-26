import { useAction, useMutation } from "convex/react";
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
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { chatSession } from "@/config/Gemini";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const EditorElements = ({ editor }: { editor: any }) => {
  const { fileId } = useParams();
  const vectorSearch = useAction(api.myActions.search);
  const { user } = useUser();
  const addNotes = useMutation(api.notes.saveNotes);
  if (!editor) {
    return null;
  }

  const onAIAssist = async () => {
    toast("AI is generating your answer please wait...");
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ""
    );

    const vectors = await vectorSearch({
      fileId: fileId as string,
      query: selectedText,
    });

    const jsonParsed = JSON.parse(vectors);
    let textContent = "";

    jsonParsed &&
      jsonParsed.forEach((d: any) => {
        textContent += d.pageContent;
      });

    const prompt = `For given question: ${selectedText} format the content: ${textContent} like an answer to the question in points and use bullets if necessary, give proper length answer based on the content provided Note: please give output in html format and give body section only also keep the answer to the point dont go out of the question's context`;
    const answer = await chatSession.sendMessage(prompt);
    const allText = editor.getHTML();
    const finalAns = answer.response
      .text()
      .replaceAll("```", "")
      .replaceAll("html", "");
    console.log(finalAns);
    editor.commands.setContent(allText + "<strong>Answer:</strong>" + finalAns);

    await addNotes({
      fileId: fileId as string,
      notes: editor.getHTML(),
      createdBy: user?.primaryEmailAddress?.emailAddress as string,
    });
  };

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
        <button className="hover:text-blue-500" onClick={onAIAssist}>
          <Sparkles />
        </button>
      </div>
    </div>
  );
};
export default EditorElements;
