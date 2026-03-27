import { memo, useCallback } from "react";
import { type Seat as SeatType } from "../types/seat";
import { useSeatStore } from "../store/useSeatStore";
import { Armchair } from "@phosphor-icons/react";
import clsx from "clsx";

function SeatComponent({ seat }: { seat: SeatType }) {
  const selectSeat = useSeatStore((state) => state.selectSeat);
  const deselectSeat = useSeatStore((state) => state.deselectSeat);

  const handleClick = useCallback(() => {
    if (seat.status === "available") {
      selectSeat(seat.id);
    } else if (seat.status === "selected") {
      deselectSeat(seat.id);
    }
  }, [seat.status, seat.id, selectSeat, deselectSeat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const isVIP = seat.tier === "VIP";
  const isUnavailable = seat.status === "unavailable";
  const isSelected = seat.status === "selected";
  const isAvailable = seat.status === "available";

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isUnavailable ? -1 : 0}
      aria-label={`Seat ${seat.id}, ${seat.tier}, ₹${seat.price}, ${seat.status}`}
      aria-pressed={isSelected}
      aria-disabled={isUnavailable}
      className={clsx(
        "relative flex items-center justify-center transition-transform duration-300 ease-out select-none shrink-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 rounded-md",
        isVIP ? "w-12 h-12 sm:w-14 sm:h-14" : "w-10 h-10 sm:w-12 sm:h-12",
        {
          "cursor-pointer hover:scale-110": isAvailable || isSelected,
          "cursor-not-allowed opacity-40 dark:opacity-50": isUnavailable,
        }
      )}
    >
      <Armchair 
        size={isVIP ? 48 : 36} 
        weight={isSelected ? "fill" : isVIP ? "duotone" : "regular"}
        className={clsx(
          "transition-colors duration-300",
          {
            // Available
            "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300": isAvailable && !isVIP,
            "text-amber-600/70 hover:text-amber-600 dark:text-amber-500/70 dark:hover:text-amber-400": isAvailable && isVIP,
            
            // Selected
            "text-zinc-900 dark:text-zinc-100 drop-shadow-md": isSelected && !isVIP,
            "text-amber-500 dark:text-amber-400 drop-shadow-lg": isSelected && isVIP,
            
            // Unavailable
            "text-zinc-300 dark:text-zinc-500": isUnavailable && !isVIP,
            "text-amber-900/30 dark:text-amber-700/50": isUnavailable && isVIP,
          }
        )}
      />
      
      {/* Tiny checkmark if selected */}
      {isSelected && (
        <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-[10px] font-bold text-background shadow-sm ring-2 ring-background">
          ✓
        </span>
      )}
    </div>
  );
}

const Seat = memo(SeatComponent);
export default Seat;