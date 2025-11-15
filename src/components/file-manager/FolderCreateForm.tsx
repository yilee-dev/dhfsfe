import { useState } from "react";
import { useCreateFolder } from "@/hooks/useCreateFolder";
import useCustomLogin from "@/hooks/useCustomLogin";

type Props = {
  parentId: number | null;
  onClose: () => void;
};

export const FolderCreateForm = ({ parentId, onClose }: Props) => {
  const { isLogin, exceptionHandle } = useCustomLogin();
  const { mutateAsync, isPending } = useCreateFolder();
  const [name, setName] = useState("");
  const [scope, setScope] = useState<"PRIVATE" | "SHARED">("PRIVATE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!name.trim()) {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      await mutateAsync({
        parentId,
        name: name.trim(),
        scope,
      });
      onClose();
      setName("");
      setScope("PRIVATE");
    } catch (ex) {
      exceptionHandle(ex);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-5 rounded-lg shadow-lg w-80 flex flex-col gap-3"
    >
      <h3 className="text-lg font-semibold mb-2">새 폴더 생성</h3>

      <label className="form-control">
        <span className="label-text text-sm">폴더 이름</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 프로젝트 A"
          className="input input-sm input-bordered"
        />
      </label>

      <label className="form-control">
        <span className="label-text text-sm">공유 범위</span>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as "PRIVATE" | "SHARED")}
          className="select select-sm select-bordered"
        >
          <option value="PRIVATE">PRIVATE (나만 보기)</option>
          <option value="SHARED">SHARED (공유됨)</option>
        </select>
      </label>

      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-sm">
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-sm btn-primary"
        >
          {isPending ? "생성 중..." : "생성"}
        </button>
      </div>
    </form>
  );
};
