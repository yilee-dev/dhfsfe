// FileTable.tsx
import { useInView } from "react-intersection-observer";
import { FileTableRow } from "./FileTableRow";
import { useGetFolderId } from "./FolderList";
import { useFileList, type IFile } from "@/hooks/useFileList";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import useCustomLogin from "@/hooks/useCustomLogin";
import { UploadForm } from "./UploadForm";
import { RootSummary } from "./RootSummary";

type FileListProps = { folderId?: number | null };

export const FileTable = ({ folderId = 1 }: FileListProps) => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  // 루트면 null로 처리, 폴더 화면이면 전달된 기본값 사용
  const effectiveDefault = isRoot ? null : folderId ?? null;
  const id = useGetFolderId(effectiveDefault);

  const [ref, inView] = useInView();
  const { isLogin } = useCustomLogin();
  const [openUpload, setOpenUpload] = useState(false);

  const [rootTypes, setRootTypes] = useState<
    Array<IFile["fileType"]> | undefined
  >(undefined);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFileList(isRoot ? null : id, 20, isRoot ? rootTypes : undefined);

  const files = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handlePlusClick = () => {
    if (!isLogin || id === null) return;
    setOpenUpload(true);
  };

  const plusDisabled = !isLogin || id === null;

  return (
    <div className="card card-border bg-base-100">
      <div className="card-body p-0">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="inline-flex items-center gap-3">
            <button
              className={`btn btn-ghost btn-square border-base-300 btn-sm ${
                plusDisabled ? "btn-disabled opacity-60" : ""
              }`}
              aria-label="Add"
              onClick={handlePlusClick}
              title={
                plusDisabled
                  ? "로그인 후 폴더를 선택하면 업로드할 수 있어요"
                  : "파일 업로드"
              }
            >
              <span className="iconify lucide--plus size-4" />
            </button>
          </div>

          <div className="inline-flex items-center gap-3">
            <label className="input input-sm">
              <span className="iconify lucide--search text-base-content/80 size-4" />
              <input
                type="search"
                className="grow"
                placeholder="Search along files"
                // TODO: 서버 검색 파라미터 연결 시 onChange 핸들러 추가
              />
            </label>

            {/* 루트에서는 파일 타입 드롭다운 대신 요약 카드에서 선택 */}
            {!isRoot && (
              <div className="hidden sm:block">
                <select className="select select-sm w-36" defaultValue="">
                  <option value="" disabled>
                    File type
                  </option>
                  <option>Images</option>
                  <option>Videos</option>
                  <option>Documents</option>
                  <option>Archives</option>
                  <option>Other</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ✅ 루트면 요약 카드 노출 (NORMAL/INSTALL/UNINSTALL) */}
        {isRoot && (
          <div className="px-5 pt-4">
            <RootSummary onSelect={(t) => setRootTypes([t])} />
            {rootTypes == null && (
              <div className="mt-2 text-xs text-base-content/70">
                타입 카드를 클릭하면 해당 타입의 파일 목록이 표시됩니다.
              </div>
            )}
          </div>
        )}

        {/* 테이블 */}
        <div className="overflow-auto">
          <table className="rounded-box mt-3 table">
            <thead>
              <tr>
                <th>
                  <input className="checkbox checkbox-sm" type="checkbox" />
                </th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Created At</th>
                <th>Owner</th>
                <th>Shared With</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* 루트에서 타입 미선택이면 안내만 표시 */}
              {isRoot && !rootTypes && (
                <tr>
                  <td colSpan={8}>
                    <div className="py-6 text-center text-sm opacity-70">
                      상단 요약 카드에서 파일 타입을 선택하세요.
                    </div>
                  </td>
                </tr>
              )}

              {files.map((item, index) => (
                <FileTableRow key={index} {...item} />
              ))}

              {hasNextPage && (
                <tr>
                  <td colSpan={8}>
                    <div ref={ref} className="py-3 text-center text-sm">
                      더 불러오는 중...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && files.length === 0 && (!isRoot || !!rootTypes) && (
                <tr>
                  <td colSpan={8}>
                    <div className="py-6 text-center text-sm opacity-70">
                      표시할 파일이 없습니다.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 업로드 모달 */}
      {isLogin && id !== null && openUpload && (
        <UploadForm folderId={id} onClose={() => setOpenUpload(false)} />
      )}
    </div>
  );
};
