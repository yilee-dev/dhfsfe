import { useInView } from "react-intersection-observer";
import { useFolderList } from "@/hooks/useFolderList";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router";
import { FolderItem } from "./FolderItem";

export type FolderListProps = {
  folderId?: number | null;
};

// ✅ 훅은 항상 호출되도록 구현 (조기 return 금지)
export const useGetFolderId = (
  defaultFolderId: number | null
): number | null => {
  const params = useParams<{ id?: string }>(); // 항상 호출
  const fromUrl = params.id ? Number(params.id) : NaN;
  const resolved = Number.isFinite(fromUrl) ? fromUrl : defaultFolderId;
  return resolved ?? null;
};

const FolderList = ({ folderId = null }: FolderListProps) => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  // 루트에서는 기본값을 null 취급
  const effectiveDefault = isRoot ? null : folderId;
  const id = useGetFolderId(effectiveDefault);

  const [ref, inView] = useInView();
  const nav = useNavigate();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFolderList(id);

  const folders = data?.pages.flatMap((page) => page.items) ?? [];

  // ✅ 의존성 모두 명시
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-scroll max-h-50">
        {folders.map((folder) => (
          <FolderItem key={folder.id} {...folder} />
        ))}
        {hasNextPage ? (
          <div ref={ref} className="col-span-full text-center py-2">
            로딩…
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FolderList;
