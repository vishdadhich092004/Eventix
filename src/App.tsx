import { useEffect } from "react";
import { useSeatStore } from "./store/useSeatStore"
import { generateSeats } from "./seed/generateSeats";
import SeatGrid from "./components/SeatGrid";
import { useTimer } from "./hooks/useTimer";
import { useConcurrency } from "./hooks/useConcurrency";
import { Toaster } from "sonner";
function App() {
  const initSeats = useSeatStore((state)=> state.initSeats);
  useEffect(()=>{
    const seats = generateSeats();
    initSeats(seats);
  },[])
  useTimer();
  useConcurrency();   
  return (
    <>
    <Toaster richColors position="top-right" />
    <div className="min-h-screen flex justify-center items-center">
      <SeatGrid />
    </div>
    </>
  );
}

export default App;