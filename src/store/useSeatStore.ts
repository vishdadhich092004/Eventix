import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  checkout: () => void;
};

import { CONFIG } from "../lib/config";

const RESERVE_TIME = CONFIG.RESERVE_TIME_MS; // 5 mins

export const useSeatStore = create<Store>()(
  persist(
    (set, get) => ({
      seats: {},
      selectedSeatIds: [],

      initSeats: (seatsArray) => {
        const existing = get().seats;
        // Only initialize if store is empty (respects persisted state)
        if (Object.keys(existing).length > 0) return;

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
          toast.error(`Seat ${id} taken by someone else!`);
        }
      },

      releaseExpiredSeats: () => {
        const { seats, selectedSeatIds } = get();
        const now = Date.now();

        const updatedSeats = { ...seats };
        const expiredIds: string[] = [];

        // 1. Find if any seat has expired
        selectedSeatIds.forEach((id) => {
          const seat = seats[id];
          if (
            seat &&
            seat.status === "selected" &&
            seat.reservedUntil &&
            seat.reservedUntil < now
          ) {
            expiredIds.push(seat.id);
          }
        });

        // 2. If any expired, clear the ENTIRE cart
        if (expiredIds.length > 0) {
          selectedSeatIds.forEach((id) => {
            const seat = seats[id];
            if (seat) {
              updatedSeats[id] = {
                ...seat,
                status: "available",
                reservedUntil: null,
              };
            }
          });

          set({
            seats: updatedSeats,
            selectedSeatIds: [], // entirely cleared
          });
          toast.error(
            `Cart cleared! The reservation expired for seat${
              expiredIds.length > 1 ? "s" : ""
            } ${expiredIds.join(", ")}.`
          );
        }
      },

      checkout: () => {
        const { seats, selectedSeatIds } = get();

        if (selectedSeatIds.length === 0) {
          toast.error("No seats selected!");
          return;
        }

        const updatedSeats = { ...seats };
        selectedSeatIds.forEach((id) => {
          const seat = updatedSeats[id];
          if (seat) {
            updatedSeats[id] = {
              ...seat,
              status: "unavailable",
              reservedUntil: null,
            };
          }
        });

        const count = selectedSeatIds.length;
        set({
          seats: updatedSeats,
          selectedSeatIds: [],
        });

        toast.success(
          `🎉 Booked ${count} seat${count > 1 ? "s" : ""} successfully!`
        );
      },
    }),
    {
      name: "seatpulse-storage",
      // Only persist seats and selectedSeatIds
      partialize: (state) => ({
        seats: state.seats,
        selectedSeatIds: state.selectedSeatIds,
      }),
    }
  )
);