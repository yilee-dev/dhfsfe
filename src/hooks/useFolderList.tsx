import axios from "axios";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

export type IFolder = {
  id: number;
  name: string;
  parentId: number | null;
  createdById: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type ICurrentFolder = {
  id: IFolder["id"];
  name: IFolder["name"];
  parentId: IFolder["parentId"];
  permissions: string[];
  fileCount?: number;
};

type CursorParam = {
  id: IFolder["id"];
  cursor: number | null;
  size: number;
};

type ICursorFolderPageResponse = {
  current: ICurrentFolder;
  items: IFolder[];
  nextCursor: CursorParam["cursor"];
  hasNextCursor: boolean;
  size: number;
};

const getFolderWithChildFolder = async ({
  id,
  cursor,
  size,
}: CursorParam): Promise<ICursorFolderPageResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append("folderCursor", String(cursor));
  params.append("folderSize", String(size));

  const res = await axios.get(
    `http://localhost:8080/api/folders/${id}?${params.toString()}`
  );

  return res.data;
};

export const useFolderList = (id: number, size: number = 20) => {
  return useInfiniteQuery<
    ICursorFolderPageResponse,
    Error,
    InfiniteData<ICursorFolderPageResponse>,
    [string, number, number],
    undefined | number
  >({
    queryKey: ["folder-list", id, size],
    queryFn: ({ pageParam }) =>
      getFolderWithChildFolder({
        id,
        cursor: pageParam ?? null,
        size,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextCursor ? lastPage.nextCursor : null;
    },
  });
};
