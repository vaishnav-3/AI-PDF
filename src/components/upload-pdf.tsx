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
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChangeEvent, useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

const UploadPdfFile = ({ children }: { children: React.ReactNode }) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const insertToDB = useMutation(api.fileStorage.insertFileToDB);

  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    //insert storage id to db
    const insertDB = await insertToDB({
      fileId: fileId,
      fileName: filename,
      createdBy: user?.primaryEmailAddress?.emailAddress!,
      storageId: storageId,
    });

    setLoading(false);
    setFile(null);
    setFilename("");
    inputRef.current!.value = "";
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <div className=" flex gap-2 justify-end">
            <DialogClose>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={onUpload}>
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UploadPdfFile;
