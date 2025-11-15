// hooks/useUploadFile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import jwtAxios from "@/util/jwtUtil";
import { getCookie } from "@/util/cookieUtil";

export type UploadDTO = {
  folderId: number;
  file: File;
  fileType: "NORMAL" | "INSTALL" | "UNINSTALL";
  platform?: string;
  processName?: string;
  installPath?: string;
  commandLine?: string;
  downloadUrl?: string;
};

type UploadResp = { id: number };

export const useUploadFile = () => {
  const qc = useQueryClient();

  return useMutation<UploadResp, Error, UploadDTO>({
    mutationFn: async (dto) => {
      // 쿠키에서 로그인 정보 확인 (백엔드 principal 전환 전까지 uploaderId 필요)
      const raw = getCookie("member");
      const member = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!member?.id) throw new Error("REQUIRE_LOGIN");

      const fd = new FormData();
      fd.append("folderId", String(dto.folderId));
      fd.append("uploaderId", String(member.id));
      fd.append("fileType", dto.fileType);
      if (dto.platform) fd.append("platform", dto.platform);
      if (dto.processName) fd.append("processName", dto.processName);
      if (dto.installPath) fd.append("installPath", dto.installPath);
      if (dto.commandLine) fd.append("commandLine", dto.commandLine);
      if (dto.downloadUrl) fd.append("downloadUrl", dto.downloadUrl);
      fd.append("file", dto.file);

      const url = `${import.meta.env.VITE_API_SERVER_HOST}/api/files`;
      const res = await jwtAxios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data as UploadResp;
    },
    onSuccess: (_res, dto) => {
      // 업로드 성공 시 해당 폴더의 파일 목록 갱신
      qc.invalidateQueries({ queryKey: ["file-list", dto.folderId] });
    },
  });
};
