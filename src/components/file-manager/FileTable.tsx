import { useInView } from "react-intersection-observer";
import { FileTableRow, type IFileTableRow } from "./FileTableRow";
import { useGetFolderId } from "./FolderList";
import { useFileList } from "@/hooks/useFileList";
import { useEffect } from "react";

type FileListProps = {
  folderId?: number;
};

export const FileTable = ({ folderId = 1 }: FileListProps) => {
  const id = useGetFolderId(folderId);

  const [ref, inView] = useInView();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFileList(id);

  const files = data?.pages.flatMap((file) => file.items) ?? [];

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="card card-border bg-base-100">
      <div className="card-body p-0">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="inline-flex items-center gap-3">
            <div className="dropdown dropdown-bottom dropdown-start">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square border-base-300 btn-sm"
                aria-label="Add"
              >
                <span className="iconify lucide--plus size-4" />
              </div>
              <div
                tabIndex={0}
                className="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow"
              >
                <ul className="menu w-full p-1.5">
                  <li>
                    <div>
                      <span className="iconify lucide--folder size-4" />
                      New Folder
                    </div>
                  </li>
                </ul>
                <hr className="border-base-300" />
                <ul className="menu w-full p-1.5">
                  <li>
                    <div>
                      <span className="iconify lucide--folder-up size-4" />
                      Upload Folder
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="iconify lucide--file-up size-4" />
                      Upload File
                    </div>
                  </li>
                </ul>
                <hr className="border-base-300" />
                <ul className="menu w-full p-1.5">
                  <li>
                    <div>
                      <span className="iconify lucide--file-text size-4" />
                      Create Document
                    </div>
                  </li>
                  <li>
                    <div>
                      <span className="iconify lucide--file-spreadsheet size-4" />
                      Create Sheet
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <button className="btn-outline border-base-300 btn btn-sm hidden sm:flex">
              <span className="iconify lucide--folder-git-2 size-4" />
              <span>Organize</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-3">
            <label className="input input-sm">
              <span className="iconify lucide--search text-base-content/80 size-4" />
              <input
                type="search"
                className="grow"
                placeholder="Search along files"
                aria-label="Search chat"
              />
            </label>
            <div className="hidden sm:block">
              <select
                className="select select-sm w-32"
                defaultValue=""
                aria-label="File type"
              >
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
            <div className="inline-flex items-center gap-1">
              <button
                className="btn btn-sm btn-ghost btn-square"
                aria-label="Grid"
              >
                <span className="iconify lucide--grid-2x2 size-4" />
              </button>
              <button
                className="btn btn-sm btn-soft btn-square"
                aria-label="List"
              >
                <span className="iconify lucide--list size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="rounded-box mt-2 table">
            <thead>
              <tr>
                <th>
                  <input
                    className="checkbox checkbox-sm"
                    aria-label="Checkbox example"
                    type="checkbox"
                  />
                </th>
                <th>Name</th>
                <th>Size</th>
                <th>Created At</th>
                <th>Owner</th>
                <th>Shared With</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {files.map((item, index) => (
                <FileTableRow key={index} {...item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
