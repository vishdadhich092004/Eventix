import { useEffect } from "react";
import { useSeatStore } from "./store/useSeatStore";
import { generateSeats } from "./seed/generateSeats";
import Header from "./components/Header";
import SeatGrid from "./components/SeatGrid";
import CartPanel from "./components/CartPanel";
import { useTimer } from "./hooks/useTimer";
import { useConcurrency } from "./hooks/useConcurrency";

function App() {
  const initSeats = useSeatStore((state) => state.initSeats);

  useEffect(() => {
    const seats = generateSeats();
    initSeats(seats);
  }, [initSeats]);

  useTimer();
  useConcurrency();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden relative">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 w-full max-w-full mx-auto">
        {/* Seat Grid — takes the main area */}
        <SeatGrid />
      </main>

      {/* Cart Panel — sliding sidebar constrainted from right */}
      <CartPanel />
    </div>
  );
}

export default App;
