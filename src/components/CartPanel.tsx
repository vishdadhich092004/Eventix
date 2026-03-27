import { useState, useEffect } from "react";
import { useSeatStore } from "../store/useSeatStore";
import { useCountdown } from "../hooks/useCountdown";
import { X, ShoppingCart, Ticket, Timer } from "@phosphor-icons/react";
import clsx from "clsx";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CartPanel() {
  const [isMobileClosed, setIsMobileClosed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const seats = useSeatStore((s) => s.seats);
  const selectedSeatIds = useSeatStore((s) => s.selectedSeatIds);
  const deselectSeat = useSeatStore((s) => s.deselectSeat);
  const checkout = useSeatStore((s) => s.checkout);
  const countdowns = useCountdown();

  const selectedSeats = selectedSeatIds
    .map((id) => seats[id])
    .filter(Boolean);

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const hasItems = selectedSeats.length > 0;

  // Single cart timer: use the soonest-expiring seat
  const cartSecondsLeft = hasItems
    ? Math.min(...Array.from(countdowns.values()))
    : 0;
  const isUrgent = cartSecondsLeft <= 60;
  
  // Reset confirming state when cart changes
  useEffect(() => {
    setConfirming(false);
  }, [selectedSeatIds.length]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      setIsMobileClosed(false);
    }
  }, [selectedSeats.length]);

  const isPanelOpen = hasItems && !isMobileClosed;

  const handleCheckout = () => {
    checkout();
    setConfirming(false);
  };

  return (
    <>
      {/* Backdrop (mobile only, optional) */}
      <div 
        className={clsx(
          "fixed inset-0 bg-background/50 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none lg:hidden",
          isPanelOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
        onClick={() => setIsMobileClosed(true)}
      />

      {/* Floating Action Button */}
      <div 
        className={clsx(
          "fixed bottom-6 right-4 sm:right-6 z-40 transition-all duration-300",
          hasItems && isMobileClosed ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={() => setIsMobileClosed(false)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-5 py-3.5 rounded-full shadow-xl font-semibold shadow-zinc-900/20 dark:shadow-zinc-100/10 hover:scale-105 active:scale-95 transition-transform"
        >
          <Ticket weight="fill" className="w-5 h-5" />
          View Cart ({selectedSeats.length})
        </button>
      </div>

      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          !hasItems ? "translate-x-full" : isMobileClosed ? "translate-x-full" : "translate-x-0"
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
          <button 
            onClick={() => setIsMobileClosed(true)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Cart-wide countdown timer */}
        {hasItems && (
          <div
            className={clsx(
              "px-6 py-3 flex items-center justify-between border-b border-border transition-colors",
              isUrgent
                ? "bg-red-50 dark:bg-red-950/30"
                : "bg-amber-50/50 dark:bg-amber-950/20"
            )}
          >
            <div className="flex items-center gap-2">
              <Timer
                size={18}
                weight="fill"
                className={clsx(
                  isUrgent
                    ? "text-red-500 animate-pulse"
                    : "text-amber-600 dark:text-amber-500"
                )}
              />
              <span className={clsx(
                "text-sm font-medium",
                isUrgent
                  ? "text-red-600 dark:text-red-400"
                  : "text-amber-700 dark:text-amber-400"
              )}>
                {isUrgent ? "Hurry! Reservation expiring" : "Reservation held for"}
              </span>
            </div>
            <span
              className={clsx(
                "text-lg font-mono font-bold tabular-nums",
                isUrgent
                  ? "text-red-500 animate-pulse"
                  : "text-amber-700 dark:text-amber-400"
              )}
            >
              {formatTime(cartSecondsLeft)}
            </span>
          </div>
        )}

        {/* Seat list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-border">
            {selectedSeats.map((seat) => (
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

                  <button
                    onClick={() => deselectSeat(seat.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label={`Remove seat ${seat.id}`}
                  >
                    <X size={18} weight="bold" />
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold tracking-tight">₹{total.toLocaleString()}</span>
          </div>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full py-4 rounded-xl font-semibold text-[15px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"})
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">Confirm your booking?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
