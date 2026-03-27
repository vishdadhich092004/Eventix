import { useSeatStore } from "../store/useSeatStore";
import { Ticket, ArrowCounterClockwise } from "@phosphor-icons/react";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const seats = useSeatStore((s) => s.seats);
  const seatArray = Object.values(seats);
  const available = seatArray.filter((s) => s.status === "available").length;
  const booked = seatArray.filter((s) => s.status === "unavailable").length;
  const total = seatArray.length;
  const resetAll = useSeatStore((s) => s.resetAll);
  
  // Calculate percentage
  const percentage = total > 0 ? Math.round((booked / total) * 100) : 0;

  return (
    <header className="w-full flex flex-col pt-8 pb-10">
      <div className="mx-auto w-full px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-6 md:gap-0">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Ticket weight="fill" className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Eventix
            </h1>
          </div>

          {/* Stats & Controls */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Available</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{available}</span>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Booked</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{booked}</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col gap-2 w-32 border-l border-zinc-200 dark:border-zinc-800 pl-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Occupancy</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{percentage}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="pl-6 border-l border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <button
                onClick={resetAll}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Reset all seats"
                title="Reset all seats"
              >
                <ArrowCounterClockwise size={18} weight="bold" />
              </button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col items-center mt-12 gap-3 w-full px-6">
        <div className="w-full max-w-2xl h-px bg-linear-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-center">
          Main Stage
        </span>
      </div>
    </header>
  );
}
