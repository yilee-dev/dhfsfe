import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/api/apiClient";

export type FileSummary = {
  totalCount: number;
  totalSize: number;
  normalCount: number;
  normalSize: number;
  installCount: number;
  installSize: number;
  uninstallCount: number;
  uninstallSize: number;
};

export const useFileSummary = (folderId: number | null) => {
  return useQuery({
    queryKey: ["file-summary", folderId ?? null],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (folderId != null) p.append("folderId", String(folderId)); // 루트면 미전송
      return apiGet<FileSummary>(`/api/files/summary?${p.toString()}`);
    },
    enabled: folderId === null, // 루트에서만 사용
    staleTime: 10_000,
  });
};
