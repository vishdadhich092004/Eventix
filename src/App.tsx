import { useEffect } from "react";
import { useSeatStore } from "./store/useSeatStore"
import { generateSeats } from "./seed/generateSeats";
import SeatGrid from "./components/SeatGrid";
function App() {
  const initSeats = useSeatStore((state)=> state.initSeats);
  useEffect(()=>{
    const seats = generateSeats();
    initSeats(seats);
  },[])
  return (

    <div className="min-h-screen flex justify-center items-center">
      <SeatGrid />
    </div>
  );
}

export default App