"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  const { user } = useUser();
  const pdfFiles = useQuery(api.fileStorage.getUserPdfs, {
    email: user?.primaryEmailAddress?.emailAddress as string,
  });
  console.log(pdfFiles);

  return (
    <div className="p-12">
      <h2 className="font-bold text-3xl ">Workspace</h2>
      <div className="mt-10 grid grid-cols  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {pdfFiles &&
          pdfFiles.map((pdfFile) => {
            return (
              <Link href={"/workspace/" + pdfFile.fileId} className="flex">
                <div
                  key={pdfFile._id}
                  className="bg-slate-100 w-full gap-6 flex flex-col items-center p-4 rounded-lg cursor-pointer"
                >
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
            );
          })}
      </div>
    </div>
  );
};
export default page;
