// src/components/file-manager/NewFolderButton.tsx
import { useState } from "react";
import { FolderCreateForm } from "./FolderCreateForm";

export const NewFolderButton = ({ parentId }: { parentId: number | null }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-sm btn-outline border-base-300"
      >
        <span className="iconify lucide--folder-plus size-4" />새 폴더
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <FolderCreateForm
            parentId={parentId}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
