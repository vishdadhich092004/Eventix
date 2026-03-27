import { type Seat, SeatPrice } from "../types/seat";
import { CONFIG } from "../lib/config";

export const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];

    for (let row = 0; row < CONFIG.VENUE_ROWS; row++) {
        for (let col = 0; col < CONFIG.VENUE_COLS; col++) {
            const rowLabel = String.fromCharCode(65 + row);
            const seatNumber = col + 1;

            const id = `${rowLabel}${seatNumber}`;

            const tier = row < CONFIG.VIP_ROWS ? "VIP" : "General";

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