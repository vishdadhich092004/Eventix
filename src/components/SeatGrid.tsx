import { useMemo } from "react";
import { useSeatStore } from "../store/useSeatStore";
import { CONFIG } from "../lib/config";
import Seat from "./Seat";
import Legend from "./Legend";

export default function SeatGrid() {
  const seats = useSeatStore((state) => state.seats);

  const rows = useMemo(() => {
    const seatArray = Object.values(seats).sort((a, b) => {
      if (a.row === b.row) return a.col - b.col;
      return a.row - b.row;
    });

    // Group into rows
    const grouped: (typeof seatArray)[] = [];
    for (let i = 0; i < seatArray.length; i += CONFIG.VENUE_COLS) {
      grouped.push(seatArray.slice(i, i + CONFIG.VENUE_COLS));
    }
    return grouped;
  }, [seats]);

  return (
    <div className="flex flex-col items-center gap-6 animate-[fadeInUp_0.5s_ease-out]">
      <Legend />

      <div
        className="relative px-2 sm:px-6 py-6 rounded-2xl border border-transparent"
        role="group"
        aria-label="Seat selection grid"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
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
                <span className="w-4 sm:w-6 text-right text-xs font-semibold text-muted-foreground mr-1 sm:mr-3">
                  {String.fromCharCode(65 + rowIdx)}
                </span>

                {row.map((seat, colIdx) => (
                  <div key={seat.id} className="flex items-center">
                    <Seat seat={seat} />
                    {/* Aisle gap */}
                    {colIdx === CONFIG.AISLE_AFTER_COL && <div className="w-6 sm:w-10 md:w-16" />}
                  </div>
                ))}

                <span className="w-4 sm:w-6 text-left text-xs font-semibold text-muted-foreground ml-1 sm:ml-3">
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