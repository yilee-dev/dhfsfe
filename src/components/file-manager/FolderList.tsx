import { useInView } from "react-intersection-observer";
import { useFolderList, type IFolder } from "@/hooks/useFolderList";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FolderItem } from "./FolderItem";
import { useLocation } from "react-router";

export type FolderListProps = {
  folderId?: number | null;
};

export const useGetFolderId = (
  defaultFolderId: number | null
): number | null => {
  if (!defaultFolderId) return null;
  const params = useParams<{ id?: string }>();
  const fromUrl = params.id ? Number(params.id) : NaN;
  return Number.isFinite(fromUrl) ? fromUrl : defaultFolderId;
};

const FolderList = ({ folderId = null }: FolderListProps) => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  const effectiveDefault = isRoot ? null : folderId;
  const id = useGetFolderId(effectiveDefault);

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
