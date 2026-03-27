import { Armchair } from "@phosphor-icons/react";

export default function Legend() {
  const items = [
    { label: "Available", iconColor: "text-zinc-400 dark:text-zinc-500", weight: "regular" as const },
    { label: "Selected", iconColor: "text-zinc-900 dark:text-zinc-100", weight: "fill" as const },
    { label: "Unavailable", iconColor: "text-zinc-300 dark:text-zinc-500 opacity-40 dark:opacity-50", weight: "regular" as const },
    { label: "VIP", iconColor: "text-amber-600/70 dark:text-amber-500/70", weight: "duotone" as const },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          <Armchair size={20} weight={item.weight} className={item.iconColor} />
          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
