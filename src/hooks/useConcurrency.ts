import { useEffect } from "react";
import { useSeatStore } from "../store/useSeatStore";

export const useConcurrency = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            const { seats, markUnavailable } = useSeatStore.getState();

            const seatArray = Object.values(seats);
            const availableSeats = seatArray.filter(
                (seat) => seat.status === "available"
            );

            if (availableSeats.length === 0) return;

            const count = Math.floor(Math.random() * 2) + 1;

            for (let i = 0; i < count; i++) {
                const randomSeat =
                    availableSeats[
                    Math.floor(Math.random() * availableSeats.length)
                    ];

                if (randomSeat) {
                    markUnavailable(randomSeat.id);
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);
};