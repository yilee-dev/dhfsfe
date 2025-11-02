import { useNavigate } from "react-router";
import { FolderItemDropdown } from "./FolderItemDropdown";

export type IFolderItem = {
  icon: string;
  iconClass: string;
  name: string;
  filesCount: number;
};

export const FolderItem = (folder: any) => {
  const nav = useNavigate();
  return (
    <div
      className="card card-border bg-base-100 cursor-pointer"
      onClick={() => nav(`/folders/${folder.id}`)}
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-2">
          <div
            className={`rounded-box flex items-center p-1.5 bg-primary/5 text-primary`}
          >
            <span className={`iconify lucide--folder-archive size-5`}></span>
          </div>
          <span className="text-sm font-medium">{folder.name}</span>
          <div className="ms-auto">
            <FolderItemDropdown />
          </div>
        </div>
        <div className="text-base-content/70 mt-2 flex items-center text-xs">
          {0} Files
        </div>
      </div>
    </div>
  );
};
