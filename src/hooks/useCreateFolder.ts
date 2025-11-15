import { apiPost } from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IFolder } from "./useFolderList";

export type CreateFolderRequest = {
  parentId: number | null;
  name: string;
  scope: "SHARED" | "PRIVATE";
};

export function useCreateFolder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (req: CreateFolderRequest) =>
      apiPost<IFolder>("/api/folders", req),

    onMutate: async (req) => {
      const key: [string, number | null, number] = [
        "folder-list",
        req.parentId ?? null,
        20,
      ];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<any>(key);

      // 첫 페이지에 새 폴더를 미리 끼워 넣기 (무한스크롤 구조 고려)
      qc.setQueryData(key, (old: any) => {
        if (!old) return old;
        const optimistic: IFolder = {
          id: Math.floor(Math.random() * 1e9) * -1, // 임시 음수 id
          name: req.name,
          parentId: req.parentId,
          ownerId: 0,
          scope: req.scope,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          isDeleted: false,
        };
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              items: [optimistic, ...old.pages[0].items],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { prev, key };
    },

    onError: (_e, _req, ctx) => {
      if (ctx?.prev && ctx.key) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSuccess: (_data, req) => {
      const key: [string, number | null, number] = [
        "folder-list",
        req.parentId ?? null,
        20,
      ];
      qc.invalidateQueries({ queryKey: key });
    },
  });
}
