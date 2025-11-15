// components/file-manager/UploadFileButton.tsx
import { useState } from "react";
import { UploadForm } from "./UploadForm";
import useCustomLogin from "@/hooks/useCustomLogin";

type Props = {
  folderId: number;
  onUploaded?: () => void;
};

export const UploadFileButton = ({ folderId, onUploaded }: Props) => {
  const [open, setOpen] = useState(false);
  const { isLogin } = useCustomLogin();

  const onClick = () => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button className="btn btn-sm btn-primary" onClick={onClick}>
        <span className="iconify lucide--file-up size-4" />
        업로드
      </button>
      {open && (
        <UploadForm
          folderId={folderId}
          onUploaded={onUploaded}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
