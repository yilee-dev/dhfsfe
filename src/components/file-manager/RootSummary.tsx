import { useFileSummary } from "@/hooks/useFileSummary";

type Props = { onSelect: (t: "NORMAL" | "INSTALL" | "UNINSTALL") => void };

export const RootSummary = ({ onSelect }: Props) => {
  const { data, isLoading } = useFileSummary(null);
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="skeleton h-16" />
        <div className="skeleton h-16" />
        <div className="skeleton h-16" />
      </div>
    );
  }

  const Card = ({
    label,
    count,
    type,
  }: {
    label: string;
    count: number;
    type: "NORMAL" | "INSTALL" | "UNINSTALL";
  }) => (
    <button
      className="card card-border bg-base-100 p-3 text-left hover:shadow transition"
      onClick={() => onSelect(type)}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs opacity-70 mt-1">
        {count.toLocaleString()} files
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card label="Normal" count={data.normalCount} type="NORMAL" />
      <Card label="Install" count={data.installCount} type="INSTALL" />
      <Card label="Uninstall" count={data.uninstallCount} type="UNINSTALL" />
    </div>
  );
};
