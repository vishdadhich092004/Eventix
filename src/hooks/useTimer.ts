import { useEffect } from "react";
import { useSeatStore } from "../store/useSeatStore";

export const useTimer = () => {
  const releaseExpiredSeats = useSeatStore(
    (state) => state.releaseExpiredSeats
  );

  useEffect(() => {
    const interval = setInterval(() => {
      releaseExpiredSeats();
    }, 1000); // every second

    return () => clearInterval(interval);
  }, []);
};