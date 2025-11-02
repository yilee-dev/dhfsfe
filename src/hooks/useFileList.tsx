import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import axios from "axios";

export type IFile = {
  id: number;
  originalFilename: string;
  storeFilename: string;
  contentType: string;
  fileSize: number;
  folderId: number;
  uploadedById: number;
  version: number;
  deleted: boolean;
  ext: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

type ICursorFilePageResponse = {
  items: IFile[];
  nextCursor: number | null;
  hasNextCursor: boolean;
  size: number;
};

type ICursorQueryParam = {
  folderId: number;
  fileCursor: number | null;
  fileSize: number;
};

const getFileListInFolder = async ({
  folderId,
  fileCursor,
  fileSize,
}: ICursorQueryParam): Promise<ICursorFilePageResponse> => {
  const params = new URLSearchParams();

  const rootFolderId = 1;
  const defaultSize = 20;

  folderId
    ? params.append("folderId", String(folderId))
    : params.append("folderId", String(rootFolderId));

  fileCursor && params.append("fileCursor", String(fileCursor));

  fileSize
    ? params.append("fileSize", String(fileSize))
    : params.append("fileSize", String(defaultSize));

  const res = await axios.get(
    `${import.meta.env.VITE_API_SERVER_HOST}/api/files?${params.toString()}`
  );

  return res.data;
};

export const useFileList = (folderId: number, fileSize: number = 20) => {
  return useInfiniteQuery<
    ICursorFilePageResponse,
    Error,
    InfiniteData<ICursorFilePageResponse>,
    [string, ICursorQueryParam["folderId"], ICursorQueryParam["fileSize"]],
    undefined | number
  >({
    queryKey: ["file-list", folderId, fileSize],
    queryFn: ({ pageParam }) => {
      return getFileListInFolder({
        folderId,
        fileCursor: pageParam ?? null,
        fileSize,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextCursor ? lastPage.nextCursor : null,
  });
};
