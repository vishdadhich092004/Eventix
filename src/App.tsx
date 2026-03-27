import { useEffect } from "react";
import { useSeatStore } from "./store/useSeatStore"
import { generateSeats } from "./seed/generateSeats";

function App() {
  const initSeats = useSeatStore((state)=> state.initSeats);
  useEffect(()=>{
    const seats = generateSeats();
    initSeats(seats);
  },[])


const seats = useSeatStore((state)=>state.seats)
console.log(Object.values(seats));
  return (
    <div className="font-bold underline">Eventix</div>
  )
}

export default App