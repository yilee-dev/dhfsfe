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
        <div className="flex h-screen min-w-0 grow flex-col overflow-auto">
          <Topbar />
          <div id="layout-content" className="overflow-hidden py-4">
            {children}
          </div>
        </div>
      </div>
      <Rightbar />
    </div>
  );
};

export default FileAppLayout;
