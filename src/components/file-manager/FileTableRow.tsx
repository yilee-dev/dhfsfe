import type { IFile } from "@/hooks/useFileList";
import { type ReactNode } from "react";

export const FileTableRow = ({
  id,
  originalFilename,
  fileSize,
  fileType,
}: Partial<IFile>) => {
  return (
    <tr className="hover:bg-base-200">
      <td>
        <input
          className="checkbox checkbox-sm"
          aria-label="Checkbox example"
          type="checkbox"
        />
      </td>
      <td className="flex items-center space-x-3 truncate">
        <div className="bg-base-200 text-base-content/80 rounded-box flex items-center p-1.5">
          <span className={`iconify  size-5`} />
        </div>
        <div className="text-sm font-medium">{originalFilename}</div>
      </td>
      <td>{fileSize}</td>
      <td>{fileType}</td>
      <td>
        <button
          className="btn btn-ghost btn-square btn-sm"
          aria-label="Show file"
        >
          <span className="iconify lucide--eye text-base-content/80 size-4" />
        </button>
      </td>
    </tr>
  );
};
