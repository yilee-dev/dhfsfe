import { type IStatItem, StatItem } from "./StatItem";

const statItems: IStatItem[] = [];

export const StatList = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
      {statItems.map((item, index) => (
        <StatItem {...item} key={index} />
      ))}
    </div>
  );
};
