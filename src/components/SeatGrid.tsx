import { useMemo, useRef } from "react";
import { useSeatStore } from "../store/useSeatStore";
import { CONFIG } from "../lib/config";
import Seat from "./Seat";
import Legend from "./Legend";

export default function SeatGrid() {
  const seats = useSeatStore((state) => state.seats);

  // Derive seat IDs once — the layout (row/col) never changes after init.
  // We only recompute when the number of seats changes (i.e. on init).
  const seatCount = Object.keys(seats).length;
  const layoutRef = useRef<string[][]>([]);

  const rows = useMemo(() => {
    const seatArray = Object.values(seats).sort((a, b) => {
      if (a.row === b.row) return a.col - b.col;
      return a.row - b.row;
    });

    // Store only IDs grouped by row — stable across status changes
    const grouped: string[][] = [];
    for (let i = 0; i < seatArray.length; i += CONFIG.VENUE_COLS) {
      grouped.push(seatArray.slice(i, i + CONFIG.VENUE_COLS).map((s) => s.id));
    }
    layoutRef.current = grouped;
    return grouped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatCount]);

  return (
    <div className="flex flex-col items-center gap-6 animate-[fadeInUp_0.5s_ease-out] w-full max-w-full">
      <Legend />

      <div
        className="relative px-2 sm:px-6 py-6 rounded-2xl border border-transparent w-full max-w-full overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none" }}
        role="group"
        aria-label="Seat selection grid"
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 min-w-max w-max mx-auto px-2 sm:px-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx}>
              {/* VIP / General divider */}
              {rowIdx === CONFIG.VIP_ROWS && (
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    General Admission
                  </span>
                  <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Row label */}
                <span className="w-4 sm:w-6 text-right text-xs font-semibold text-muted-foreground mr-1 sm:mr-3 shrink-0">
                  {String.fromCharCode(65 + rowIdx)}
                </span>

                {row.map((seatId, colIdx) => (
                  <div key={seatId} className="flex items-center">
                    <Seat seatId={seatId} />
                    {/* Aisle gap */}
                    {colIdx === CONFIG.AISLE_AFTER_COL && <div className="w-6 sm:w-10 md:w-16 shrink-0" />}
                  </div>
                ))}

                <span className="w-4 sm:w-6 text-left text-xs font-semibold text-muted-foreground ml-1 sm:ml-3 shrink-0">
                  {String.fromCharCode(65 + rowIdx)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* VIP label */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background border border-border shadow-sm">
          <span className="text-[10px] font-bold tracking-[0.2em] text-amber-600 dark:text-amber-500 uppercase">
            VIP Section
          </span>
        </div>
      </div>
    </div>
  );
}