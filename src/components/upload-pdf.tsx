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

const UploadPdfFile = ({ children }: { children: React.ReactNode }) => {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="mx-2">
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <h2>Select a file to upload</h2>
          <div>
            <input
              type="file"
              ref={inputRef}
              accept="application/pdf"
              onChange={(e) => onFileSelect(e)}
            />
          </div>
          <div>
            <Label htmlFor="filename">File*</Label>
            <Input
              id="filename"
              placeholder="File Name"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div className=" flex gap-2 justify-end">
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={onUpload} disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UploadPdfFile;
