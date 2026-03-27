import { useState, useEffect, useRef } from "react";
import { useSeatStore } from "../store/useSeatStore";

/**
 * Single interval that computes seconds-left for ALL selected seats.
 * Returns a Map<seatId, secondsRemaining>.
 * Avoids per-seat intervals — O(n) scan per tick.
 */
export function useCountdown() {
  const selectedSeatIds = useSeatStore((s) => s.selectedSeatIds);
  const seats = useSeatStore((s) => s.seats);
  const [countdowns, setCountdowns] = useState<Map<string, number>>(new Map());
  const selectedRef = useRef(selectedSeatIds);
  const seatsRef = useRef(seats);

  // Keep refs in sync without triggering interval restarts
  selectedRef.current = selectedSeatIds;
  seatsRef.current = seats;

  const isActive = selectedSeatIds.length > 0;

  useEffect(() => {
    if (!isActive) {
      // Clear countdowns if nothing is active
      setCountdowns(new Map());
      return;
    }

    const tick = () => {
      const now = Date.now();
      const next = new Map<string, number>();

      for (const id of selectedRef.current) {
        const seat = seatsRef.current[id];
        if (seat?.reservedUntil) {
          const remaining = Math.max(
            0,
            Math.ceil((seat.reservedUntil - now) / 1000)
          );
          next.set(id, remaining);
        }
      }

      setCountdowns(next);
    };

    tick(); // immediate first tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return countdowns;
}
