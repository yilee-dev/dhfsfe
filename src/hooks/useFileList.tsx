import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { apiGet } from "@/api/apiClient";

export type IFile = {
  id: number;
  originalFilename: string;
  fileSize: number;
  fileType: "NORMAL" | "INSTALL" | "UNINSTALL";
};

type ICursorFilePageResponse = {
  items: IFile[];
  nextCursor: number | null;
  hasNextCursor: boolean;
  size: number;
};

type ICursorQueryParam = {
  folderId?: number | null; // ✅ 선택값으로 변경
  cursor: number | null;
  size: number;
  types?: Array<IFile["fileType"]>;
};

const getFileList = async ({
  folderId,
  cursor,
  size,
  types,
}: ICursorQueryParam): Promise<ICursorFilePageResponse> => {
  const params = new URLSearchParams();
  if (folderId != null) params.append("folderId", String(folderId)); // ✅ 루트면 미전송
  if (cursor != null) params.append("cursor", String(cursor));
  params.append("size", String(size));
  if (types?.length) params.append("types", [...types].sort().join(","));
  return await apiGet<ICursorFilePageResponse>(
    `/api/files?${params.toString()}`
  );
};

export const useFileList = (
  folderId: number | null,
  fileSize: number = 20,
  types?: Array<IFile["fileType"]>
) => {
  const typeKey = types?.length ? [...types].sort().join(",") : undefined;
  const enabled = folderId !== null || !!typeKey; // ✅ 루트(+타입필터)에서도 동작

  return useInfiniteQuery<
    ICursorFilePageResponse,
    Error,
    InfiniteData<ICursorFilePageResponse>,
    [string, number | null, number, string | undefined],
    number | undefined
  >({
    queryKey: ["file-list", folderId, fileSize, typeKey],
    enabled,
    queryFn: ({ pageParam }) =>
      getFileList({
        folderId,
        cursor: pageParam ?? null,
        size: fileSize,
        types,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextCursor ? lastPage.nextCursor ?? undefined : undefined,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
