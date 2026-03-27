import { useEffect } from "react";
import { useSeatStore } from "../store/useSeatStore";

export const useTimer = () => {
  const releaseExpiredSeats = useSeatStore(
    (state) => state.releaseExpiredSeats
  );
  // Optimization: only run timer if we actually have selected seats
  const hasSelectedSeats = useSeatStore(
    (state) => state.selectedSeatIds.length > 0
  );

  useEffect(() => {
    if (!hasSelectedSeats) return;

    const interval = setInterval(() => {
      releaseExpiredSeats();
    }, 1000); // every second

    return () => clearInterval(interval);
  }, [hasSelectedSeats, releaseExpiredSeats]);
};