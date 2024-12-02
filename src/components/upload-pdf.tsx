"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChangeEvent, useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

const UploadPdfFile = ({
  children,
  limitReached,
}: {
  children: React.ReactNode;
  limitReached: boolean;
}) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const insertToDB = useMutation(api.fileStorage.insertFileToDB);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embedDocument = useAction(api.myActions.ingest);

  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    setLoading(true);
    //post url from convex similar as presigned url
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const { storageId } = await result.json();
    const fileId = uuidv4();
    const fileUrl = await getFileUrl({ storageId });

    //insert storage id to db
    await insertToDB({
      fileId: fileId,
      fileName: filename == "" ? "Untitled File" : filename,
      fileUrl: fileUrl!,
      createdBy: user?.primaryEmailAddress?.emailAddress!,
      storageId: storageId,
    });

    const response = await axios.get("/api/pdf-loader?pdfUrl=" + fileUrl);

    await embedDocument({
      splitText: response.data.result,
      fileId: fileId,
    });

    setLoading(false);
    setOpen(false);
    setFile(null);
    setFilename("");
    inputRef.current!.value = "";
    toast("file is ready for note taking!!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="mx-2">
        <Button
          className="bg-blue-500 hover:bg-blue-400"
          disabled={limitReached}
        >
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Upload PDF</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <h2 className="text-sm sm:text-base">Select a file to upload</h2>
          <div className="w-full">
            <input
              type="file"
              ref={inputRef}
              accept="application/pdf"
              onChange={(e) => onFileSelect(e)}
              className="w-full text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filename" className="text-sm sm:text-base">
              File Name
            </Label>
            <Input
              id="filename"
              placeholder="File Name"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="text-sm sm:text-base px-3 py-1 h-auto"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={onUpload}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-400 text-sm sm:text-base px-3 py-1 h-auto"
            >
              {loading ? (
                <Loader2Icon className="animate-spin h-4 w-4" />
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UploadPdfFile;
