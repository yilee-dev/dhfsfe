import { type ISidebarMenuItem } from "@/components/file-manager/SidebarMenuItem";

export const fileManagerMenus: ISidebarMenuItem[] = [
  {
    id: "overview-label",
    isTitle: true,
    label: "파일 관리자",
  },
  {
    id: "dashboards",
    icon: "lucide--monitor-dot",
    label: "대시보드",
    children: [
      {
        id: "dashboards-ecommerce",
        label: "Yet...",
        url: "/",
      },
    ],
  },
  {
    id: "files",
    icon: "lucide--monitor-dot",
    label: "폴더/파일",
    children: [
      {
        id: "dashboards-ecommerce",
        label: "Yet...",
        url: "/",
      },
    ],
  },
];
