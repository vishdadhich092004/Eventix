import { useSeatStore } from "../store/useSeatStore";
import Seat from "./Seat";
const COLS = 10;

export default function SeatGrid() {
  const seats = useSeatStore((state) => state.seats);

  const seatArray = Object.values(seats).sort((a, b) => {
    if (a.row === b.row) return a.col - b.col;
    return a.row - b.row;
  });

  return (
    <div
      className="grid gap-2 p-4"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {seatArray.map((seat) => (
        <Seat key={seat.id} seat={seat} />
      ))}
    </div>
  );
}