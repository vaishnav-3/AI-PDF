"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const PdfViewer = ({ fileId }: { fileId: string }) => {
  const pdfRecord = useQuery(api.fileStorage.getPdfRecord, {
    fileId: fileId,
  });
  console.log(pdfRecord);
  return (
    <div>
      <iframe
        src={pdfRecord![0].fileUrl + "#toolbar=0"}
        width={"100%"}
        className="h-[90vh]"
      />
    </div>
  );
};
export default PdfViewer;
