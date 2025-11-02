import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import axios from "axios";

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
  folderId: number;
  cursor: number | null;
  size: number;
};

const getFileListInFolder = async ({
  folderId,
  cursor,
  size,
}: ICursorQueryParam): Promise<ICursorFilePageResponse> => {
  const params = new URLSearchParams();
  params.append("folderId", String(folderId));

  if (cursor != null) params.append("cursor", String(cursor));
  params.append("size", String(size));

  const res = await axios.get(
    `${import.meta.env.VITE_API_SERVER_HOST}/api/files?${params.toString()}`
  );

  return res.data as ICursorFilePageResponse;
};

export const useFileList = (folderId: number | null, fileSize: number = 20) => {
  return useInfiniteQuery<
    ICursorFilePageResponse,
    Error,
    InfiniteData<ICursorFilePageResponse>,
    [string, number | null, number],
    undefined | number
  >({
    queryKey: ["file-list", folderId, fileSize],
    enabled: folderId !== null,
    queryFn: ({ pageParam }) => {
      return getFileListInFolder({
        folderId: folderId as number,
        cursor: pageParam ?? null,
        size: fileSize,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextCursor ? lastPage.nextCursor : null,
  });
};
