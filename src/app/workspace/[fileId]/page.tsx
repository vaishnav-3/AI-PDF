import WorkspaceHeader from "@/components/workspace/header";
import PdfViewer from "@/components/workspace/pdf-viewer";
import TextEditor from "@/components/workspace/text-editor";

interface paramsTypes {
  params: {
    fileId: string;
  };
}

const page = async ({ params }: paramsTypes) => {
  const { fileId } = await params;

  return (
    <div>
      <WorkspaceHeader />
      <div className="grid grid-cols-2 gap-5">
        <div>
          <TextEditor />
        </div>
        <div>
          <PdfViewer fileId={fileId} />
        </div>
      </div>
    </div>
  );
};
export default page;
