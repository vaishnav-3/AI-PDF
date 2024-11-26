"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const { user } = useUser();

  // Fetching PDF files for the user
  const pdfFiles = useQuery(api.fileStorage.getUserPdfs, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });

  const isLoading = pdfFiles === undefined; // Check if the query is still loading

  return (
    <div className="p-12">
      <h2 className="font-bold text-3xl text-center sm:text-start">
        Workspace
      </h2>

      <div className="mt-10 grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Show skeleton loading while the data is being fetched */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-slate-100 w-full gap-6 flex flex-col items-center p-4 rounded-lg animate-pulse"
            >
              <div className="bg-gray-300 h-20 w-20 rounded-md" />
              <div className="bg-gray-300 h-4 w-32 rounded-md mt-2" />
            </div>
          ))}

        {/* Show PDF files if available */}
        {!isLoading &&
          pdfFiles &&
          pdfFiles.length > 0 &&
          pdfFiles.map((pdfFile) => (
            <Link
              href={"/workspace/" + pdfFile.fileId}
              key={pdfFile._id}
              className="flex"
            >
              <div className="bg-slate-100 w-full gap-6 flex flex-col items-center p-4 rounded-lg cursor-pointer">
                <Image
                  src="/pdf.svg"
                  alt={pdfFile.fileName}
                  height={70}
                  width={80}
                />
                <h3 className="capitalize font-bold text-sm text-center">
                  {pdfFile.fileName}
                </h3>
              </div>
            </Link>
          ))}

        {/* Show "No notes yet" if no PDF files are found */}
        {!isLoading && pdfFiles && pdfFiles.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center">
            <Image
              src="/empty-folder.png"
              alt="No notes"
              width={150}
              height={150}
            />
            <h3 className="mt-4 font-bold text-lg text-gray-600">
              No notes yet
            </h3>
            <p className="text-gray-500 text-center">
              Start uploading to see your files here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
