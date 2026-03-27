import { type Seat as SeatType } from "../types/seat";
import { useSeatStore } from "../store/useSeatStore";
import clsx from "clsx";

export default function Seat({ seat }: { seat: SeatType }) {
  const selectSeat = useSeatStore((state) => state.selectSeat);
  const deselectSeat = useSeatStore((state) => state.deselectSeat);

  const handleClick = () => {
    if (seat.status === "available") {
      selectSeat(seat.id);
    } else if (seat.status === "selected") {
      deselectSeat(seat.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "w-10 h-10 flex items-center justify-center rounded-md text-xs font-medium cursor-pointer transition",
        {
          "bg-green-500 text-white": seat.status === "available",
          "bg-blue-500 text-white": seat.status === "selected",
          "bg-gray-400 text-white cursor-not-allowed":
            seat.status === "unavailable",
        }
      )}
    >
      {seat.id}
    </div>
  );
}