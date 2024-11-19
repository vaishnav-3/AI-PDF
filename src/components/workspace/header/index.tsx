import { UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";
import Link from "next/link";

const WorkspaceHeader = () => {
  return (
    <div className="shadow-md p-3 flex justify-between">
      <div>
        <Link href="#" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Notely.ai</span>
          </div>
        </Link>
      </div>
      <UserButton />
    </div>
  );
};
export default WorkspaceHeader;
