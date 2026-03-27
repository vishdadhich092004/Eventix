import { useSeatStore } from "../store/useSeatStore";
import { useCountdown } from "../hooks/useCountdown";
import { X, ShoppingCart } from "@phosphor-icons/react";
import clsx from "clsx";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CartPanel() {
  const seats = useSeatStore((s) => s.seats);
  const selectedSeatIds = useSeatStore((s) => s.selectedSeatIds);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);
  const checkout = useSeatStore((s) => s.checkout);
  const countdowns = useCountdown();

  const selectedSeats = selectedSeatIds
    .map((id) => seats[id])
    .filter(Boolean);

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const isOpen = selectedSeats.length > 0;

  return (
    <>
      {/* Backdrop (mobile only, optional) */}
      <div 
        className={clsx(
          "fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none lg:hidden",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-border flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart size={24} weight="duotone" className="text-primary" />
              Your Selection
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        {/* Seat list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-border">
            {selectedSeats.map((seat) => {
              const secs = countdowns.get(seat.id) ?? 0;
              const isUrgent = secs <= 60;

              return (
                <li
                  key={seat.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={clsx(
                        "inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold shadow-sm",
                        seat.tier === "VIP"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 ring-1 ring-amber-200 dark:ring-amber-800"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 ring-1 ring-zinc-200 dark:ring-zinc-700"
                      )}
                    >
                      {seat.id}
                    </span>
                    <div>
                      <span className="text-sm font-semibold">{seat.tier}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        ₹{seat.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={clsx(
                        "text-sm font-mono tabular-nums",
                        isUrgent
                          ? "text-red-500 font-bold animate-pulse"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatTime(secs)}
                    </span>
                    <button
                      onClick={() => deselectSeat(seat.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label={`Remove seat ${seat.id}`}
                    >
                      <X size={18} weight="bold" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold tracking-tight">₹{total.toLocaleString()}</span>
          </div>
          <button
            onClick={checkout}
            className="w-full py-4 rounded-xl font-semibold text-[15px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md"
          >
            Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"})
          </button>
        </div>
      </div>
    </>
  );
}
