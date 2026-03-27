import { create } from "zustand";
import { type Seat } from "../types/seat";
import { toast } from "sonner";

type Store = {
    seats: Record<string, Seat>;
    selectedSeatIds: string[];

    initSeats: (seats: Seat[]) => void;

    selectSeat: (id: string) => void;
    deselectSeat: (id: string) => void;

    markUnavailable: (id: string) => void;

    releaseExpiredSeats: () => void;
};

const RESERVE_TIME = 5 * 60 * 1000; // 5 mins

export const useSeatStore = create<Store>((set, get) => ({
    seats: {},
    selectedSeatIds: [],

    initSeats: (seatsArray) => {
        const seatsMap: Record<string, Seat> = {};
        seatsArray.forEach((seat) => {
            seatsMap[seat.id] = seat;
        });

        set({ seats: seatsMap });
    },

    selectSeat: (id) => {
        const { seats, selectedSeatIds } = get();
        const seat = seats[id];

        // Reject if not available
        if (!seat || seat.status !== "available") {
            toast.error("Seat just taken!");
            return;
        }

        const updatedSeat: Seat = {
            ...seat,
            status: "selected",
            reservedUntil: Date.now() + RESERVE_TIME,
        };

        set({
            seats: {
                ...seats,
                [id]: updatedSeat,
            },
            selectedSeatIds: [...selectedSeatIds, id],
        });
    },

    deselectSeat: (id) => {
        const { seats, selectedSeatIds } = get();
        const seat = seats[id];

        if (!seat) return;

        set({
            seats: {
                ...seats,
                [id]: {
                    ...seat,
                    status: "available",
                    reservedUntil: null,
                },
            },
            selectedSeatIds: selectedSeatIds.filter((s) => s !== id),
        });
    },

    markUnavailable: (id) => {
        const { seats, selectedSeatIds } = get();
        const seat = seats[id];

        if (!seat) return;

        const isSelected = selectedSeatIds.includes(id);

        set({
            seats: {
                ...seats,
                [id]: {
                    ...seat,
                    status: "unavailable",
                    reservedUntil: null,
                },
            },
            selectedSeatIds: isSelected
                ? selectedSeatIds.filter((s) => s !== id)
                : selectedSeatIds,
        });

        if (isSelected) {
            toast.error("Seat taken by someone else!");
        }
    },

    releaseExpiredSeats: () => {
        const { seats, selectedSeatIds } = get();
        const now = Date.now();

        const updatedSeats = { ...seats };
        let updatedSelected = [...selectedSeatIds];

        Object.values(seats).forEach((seat) => {
            if (
                seat.status === "selected" &&
                seat.reservedUntil &&
                seat.reservedUntil < now
            ) {
                updatedSeats[seat.id] = {
                    ...seat,
                    status: "available",
                    reservedUntil: null,
                };

                updatedSelected = updatedSelected.filter((id) => id !== seat.id);
            }
        });

        set({
            seats: updatedSeats,
            selectedSeatIds: updatedSelected,
        });
    },
}));