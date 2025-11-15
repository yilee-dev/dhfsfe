import { useNavigate } from "react-router";
import { FolderItemDropdown } from "./FolderItemDropdown";
import type { IFolder } from "@/hooks/useFolderList";

export const FolderItem = (folder: IFolder) => {
  const nav = useNavigate();
  return (
    <div
      className="card card-border bg-base-100 cursor-pointer hover:shadow transition-all"
      onClick={() => nav(`/folders/${folder.id}`)}
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-box flex items-center p-1.5 bg-primary/5 text-primary">
            <span className="iconify lucide--folder-archive size-5" />
          </div>
          <span className="text-sm font-medium truncate">{folder.name}</span>
          <div className="ms-auto">
            <FolderItemDropdown />
          </div>
        </div>

        {/* ✅ 파일/폴더 수 표시 */}
        <div className="text-base-content/70 mt-2 flex items-center text-xs">
          <span className="me-3">
            📁 {folder.directFolderCount ?? 0} Folders
          </span>
          <span>📄 {folder.directFileCount ?? 0} Files</span>
        </div>
      </div>
    </div>
  );
};
