import { useInView } from "react-intersection-observer";
import { useFolderList, type IFolder } from "@/hooks/useFolderList";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FolderItem } from "./FolderItem";

export type FolderListProps = {
  folderId?: number;
};

export const useGetFolderId = (defaultFolderId: number): number => {
  const params = useParams<{ id?: string }>();
  const id = Number(params.id);
  return Number.isFinite(id) ? id : defaultFolderId;
};

const FolderList = ({ folderId = 1 }: FolderListProps) => {
  const id = useGetFolderId(folderId);

  const [ref, inView] = useInView();

  const nav = useNavigate();

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFolderList(id, 5);

  const folders = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-scroll max-h-50">
        {folders.map((folder) => (
          <FolderItem key={folder.id} {...folder} />
        ))}
        {hasNextPage ? <li ref={ref}>로딩</li> : ""}
      </div>
    </div>
  );
};

export default FolderList;
