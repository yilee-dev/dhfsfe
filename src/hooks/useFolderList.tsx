import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { apiGet } from "@/api/apiClient";

export type IFolder = {
  id: number;
  name: string;
  parentId: number | null;
  ownerId: number;
  scope: "PRIVATE" | "SHARED";
  createdAt: string;
  updatedAt: string | null;
  deletedAt?: string | null;
  isDeleted: boolean;
  directFileCount: number; // ✅ 직접 파일 개수
  directFolderCount: number; // ✅ 직접 폴더 개수
};

type ICursorFolderPageResponse = {
  items: IFolder[];
  nextCursor: number | null;
  hasNextCursor: boolean;
  size: number;
};

export const useFolderList = (parentId: number | null, size: number = 20) => {
  return useInfiniteQuery<
    ICursorFolderPageResponse,
    Error,
    InfiniteData<ICursorFolderPageResponse>,
    [string, number | null, number],
    number | undefined
  >({
    queryKey: ["folder-list", parentId ?? null, size],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam != null) params.append("folderCursor", String(pageParam));
      params.append("folderSize", String(size));

      const path =
        parentId == null ? "/api/folders" : `/api/folders/${parentId}`;
      return await apiGet<ICursorFolderPageResponse>(
        `${path}?${params.toString()}`
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextCursor ? lastPage.nextCursor ?? undefined : undefined,
  });
};
