import { type Seat, SeatPrice } from "../types/seat";

const ROWS = 10;
const COLS = 10;

const VIP_ROWS = 3;

export const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const rowLabel = String.fromCharCode(65 + row);
            const seatNumber = col + 1;

            const id = `${rowLabel}${seatNumber}`;

            const tier = row < VIP_ROWS ? "VIP" : "General";

            seats.push({
                id,
                row,
                price: tier === "VIP" ? SeatPrice.VIP : SeatPrice.General,
                reservedUntil: null,
                col,
                tier,
                status: "available",
            });
        }
    }

    return seats;
};