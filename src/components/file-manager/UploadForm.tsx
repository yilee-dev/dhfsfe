// UploadForm.tsx
import { useEffect, useRef, useState } from "react";
import { useUploadFile } from "@/hooks/useUploadFile";

type Props = {
  folderId: number;
  onClose: () => void;
  open?: boolean;
  onUploaded?: () => void;
};

const FILE_TYPES = ["NORMAL", "INSTALL", "UNINSTALL"] as const;
type FileType = (typeof FILE_TYPES)[number];

const prettySize = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
};

export const UploadForm = ({
  folderId,
  onClose,
  open = true,
  onUploaded,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>("NORMAL");
  const [platform, setPlatform] = useState("windows");
  const [processName, setProcessName] = useState("");
  const [installPath, setInstallPath] = useState("");
  const [commandLine, setCommandLine] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useUploadFile();
  const isAdvanced = fileType !== "NORMAL";
  const canSubmit = !!file && !isPending;

  useEffect(() => {
    if (!isAdvanced) {
      setProcessName("");
      setInstallPath("");
      setCommandLine("");
      setDownloadUrl("");
    }
  }, [isAdvanced]);

  const handlePickFile = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const submit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!file) return;

    await mutateAsync({
      folderId,
      file,
      fileType,
      platform: isAdvanced ? platform : undefined,
      processName: isAdvanced ? processName || undefined : undefined,
      installPath: isAdvanced ? installPath || undefined : undefined,
      commandLine: isAdvanced ? commandLine || undefined : undefined,
      downloadUrl: isAdvanced ? downloadUrl || undefined : undefined,
    });

    onUploaded?.();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[min(720px,95vw)] rounded-2xl bg-base-100 shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h3 className="text-lg font-semibold">파일 업로드</h3>
          <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
            <span className="iconify lucide--x size-5" />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="px-6 py-6 space-y-6">
            {/* 파일 선택 */}
            <div className="rounded-xl border border-dashed border-base-300 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-base-200 p-2">
                  <span className="iconify lucide--file size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {file ? file.name : "선택된 파일 없음"}
                  </div>
                  <div className="text-xs text-base-content/70">
                    {file ? prettySize(file.size) : "최대 2GB · 단일 파일"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {file && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setFile(null)}
                  >
                    제거
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline border-base-300"
                  onClick={handlePickFile}
                >
                  변경
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {/* 파일 타입 */}
            <div className="space-y-2">
              <div className="text-sm font-medium">파일 타입</div>
              <div className="flex gap-2">
                {FILE_TYPES.map((t) => {
                  const active = t === fileType;
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`btn btn-sm flex-1 ${
                        active ? "btn-primary" : "btn-outline border-base-300"
                      }`}
                      onClick={() => setFileType(t)}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INSTALL/UNINSTALL 전용 필드 */}
            <div
              className={`transition-all duration-200 grid grid-cols-1 md:grid-cols-2 gap-4 ${
                isAdvanced ? "opacity-100" : "opacity-60"
              }`}
            >
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Platform</label>
                <select
                  className="select select-sm select-bordered"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  disabled={!isAdvanced}
                >
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                  <option value="macos">MacOS</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Process Name</label>
                <input
                  type="text"
                  className="input input-sm input-bordered"
                  placeholder="예: process.exe"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  disabled={!isAdvanced}
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Install Path</label>
                <input
                  type="text"
                  className="input input-sm input-bordered"
                  placeholder="예: C:\\Program Files\\MyApp"
                  value={installPath}
                  onChange={(e) => setInstallPath(e.target.value)}
                  disabled={!isAdvanced}
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Command Line</label>
                <input
                  type="text"
                  className="input input-sm input-bordered"
                  placeholder="예: /S /quiet"
                  value={commandLine}
                  onChange={(e) => setCommandLine(e.target.value)}
                  disabled={!isAdvanced}
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Download URL</label>
                <input
                  type="url"
                  className="input input-sm input-bordered"
                  placeholder="https://example.com/setup.exe"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  disabled={!isAdvanced}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-300">
            <button type="button" className="btn btn-sm" onClick={onClose}>
              취소
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={!canSubmit}
            >
              {isPending ? "업로드 중..." : "업로드"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
