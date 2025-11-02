import axios from "axios";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

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
};

type CursorParam = {
  id: IFolder["parentId"];
  cursor: number | null;
  size: number;
};

type ICursorFolderPageResponse = {
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

  const path = id === null ? "/api/folders" : `/api/folders/${id}`;
  const res = await axios.get(
    `${import.meta.env.VITE_API_SERVER_HOST}${path}?${params.toString()}`
  );

  return res.data as ICursorFolderPageResponse;
};

export const useFolderList = (id: number | null, size: number = 20) => {
  return useInfiniteQuery<
    ICursorFolderPageResponse,
    Error,
    InfiniteData<ICursorFolderPageResponse>,
    [string, number | null, number],
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
