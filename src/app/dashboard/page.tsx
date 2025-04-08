"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from '@clerk/nextjs'

const Page = () => {
  const { user } = useUser();

  // Fetching PDF files for the user
  const pdfFiles = useQuery(api.fileStorage.getUserPdfs, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });

  const isLoading = pdfFiles === undefined; // Check if the query is still loading

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl sm:text-3xl text-center sm:text-start">
          Workspace
        </h2>
        <div>
          <UserButton />
        </div>
      </div>

      <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Show skeleton loading while the data is being fetched */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-slate-100 w-full gap-4 sm:gap-6 flex flex-col items-center p-3 sm:p-4 rounded-lg animate-pulse"
            >
              <div className="bg-gray-300 h-16 sm:h-20 w-16 sm:w-20 rounded-md" />
              <div className="bg-gray-300 h-3 sm:h-4 w-24 sm:w-32 rounded-md mt-2" />
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
              className="flex w-full"
            >
              <div className="bg-slate-100 w-full gap-4 sm:gap-6 flex flex-col items-center p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                <Image
                  src="/pdf.svg"
                  alt={pdfFile.fileName}
                  width={70}
                  height={70}
                  className="w-16 h-16 sm:w-[70px] sm:h-[70px]"
                />
                <p className="text-sm sm:text-base text-center line-clamp-2">
                  {pdfFile.fileName}
                </p>
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
