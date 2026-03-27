import { useSeatStore } from "../store/useSeatStore";

export default function Header() {
  const seats = useSeatStore((s) => s.seats);
  const seatArray = Object.values(seats);
  const available = seatArray.filter((s) => s.status === "available").length;
  const total = seatArray.length;

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 shadow-sm">
            <span className="text-lg font-bold text-background">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Eventix
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Live Seat Booking</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-border shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{available}</span>
              <span className="text-muted-foreground">/{total} available</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stage indicator */}
      <div className="flex flex-col items-center pt-8 pb-2 gap-3">
        <div className="w-48 sm:w-72 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground uppercase">
          Stage
        </span>
      </div>
    </header>
  );
}
