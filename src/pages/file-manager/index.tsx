import { FileTable } from "@/components/file-manager/FileTable";
import { FolderCreateForm } from "@/components/file-manager/FolderCreateForm";
import FolderList from "@/components/file-manager/FolderList";
import { StatList } from "@/components/file-manager/StatList";
import { StorageOverview } from "@/components/file-manager/StorageOverview";
import { UploadButton } from "@/components/file-manager/UploadButton";
import { MetaData } from "@/components/MetaData";
import useCustomLogin from "@/hooks/useCustomLogin";
import { useState } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router";

export type IBreadcrumb = {
  folderId: number;
  pathName: string;
};

const FileApp = () => {
  const { loginState } = useCustomLogin();
  const params = useParams<{ id?: string }>();
  const location = useLocation();

  const [openCreate, setOpenCreate] = useState(false);
  const folderId = params.id ? Number(params.id) : null;
  const isRoot = location.pathname === "/";

  const canCreateFolder = Array.isArray(loginState.roles)
    ? loginState.roles.includes("MANAGER") || loginState.roles.includes("ADMIN")
    : false;

  return (
    <>
      <MetaData title="File Manager App" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 2xl:grid-cols-4 overflow-y-auto">
        <div className="col-span-1 xl:col-span-2 2xl:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium"></h3>
            <div className="inline-flex items-center gap-3">
              <div className="drawer drawer-end">
                <input
                  id="apps-file-overview-drawer"
                  className="drawer-toggle"
                  type="checkbox"
                  aria-label="File Overview Trigger"
                />
                <div className="drawer-content">
                  <label
                    htmlFor="apps-file-overview-drawer"
                    className="btn drawer-button btn-sm btn-ghost border-base-300 flex xl:hidden"
                  >
                    <span className="iconify lucide--folder-kanban size-4" />
                  </label>
                </div>
                <div className="drawer-side z-[50]">
                  <label
                    htmlFor="apps-file-overview-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <div className="w-72">
                    <StorageOverview />
                  </div>
                </div>
              </div>
              {/* <UploadButton /> */}
            </div>
          </div>
          <div className="mt-6">
            <StatList />
          </div>
          <div className="flex justify-between items-center relative">
            <h3 className="font-medium">
              {isRoot ? "루트 디렉터리" : `폴더 #${folderId}`}
            </h3>
            {canCreateFolder && (
              <button
                onClick={() => setOpenCreate(true)}
                className="btn btn-sm btn-outline border-base-300"
              >
                <span className="iconify lucide--folder-plus size-4"></span>
              </button>
            )}
            {openCreate && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <FolderCreateForm
                  parentId={folderId ?? null}
                  onClose={() => setOpenCreate(false)}
                />
              </div>
            )}
          </div>
          <div className="mt-3">
            <FolderList folderId={folderId} />
          </div>
          <h3 className="mt-6 font-medium">Files</h3>
          <div className="mt-3">
            <FileTable />
          </div>
        </div>
        <div className="hidden xl:col-span-1 xl:block 2xl:col-span-1">
          <StorageOverview />
        </div>
      </div>
    </>
  );
};

export default FileApp;
