export type SeatStatus = "available" | "unavailable" | "selected";

export type SeatTier = "VIP" | "General";

export const SeatPrice = {
    VIP: 350,
    General: 150,
} as const
export type Seat = {
    id: string;
    tier: SeatTier;
    status: SeatStatus;
    price: number;
    reservedUntil: number | null // store the timestamp in (ms)
    row: number;
    col: number;
}