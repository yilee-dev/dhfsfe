import { Sidebar } from "@/components/file-manager/Sidebar";
import type { ReactNode } from "react";
import { fileManagerMenus } from "./menu";
import { Topbar } from "@/components/file-manager/Topbar";
import { Rightbar } from "@/components/file-manager/Rightbar";

const FileAppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="size-full">
      <div className="flex">
        <Sidebar menuItems={fileManagerMenus} />
        <div className="flex h-screen min-w-0 min-h-screen grow flex-col overflow-y-scroll">
          <Topbar />
          <div id="layout-content" className="py-4">
            {children}
          </div>
        </div>
      </div>
      <Rightbar />
    </div>
  );
};

export default FileAppLayout;
