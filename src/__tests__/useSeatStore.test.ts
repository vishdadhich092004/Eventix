import { describe, it, expect, beforeEach } from "vitest";
import { useSeatStore } from "../store/useSeatStore";
import { generateSeats } from "../seed/generateSeats";

// Reset store before each test
beforeEach(() => {
  useSeatStore.setState({ seats: {}, selectedSeatIds: [] });
  const seats = generateSeats();
  const seatsMap: Record<string, (typeof seats)[0]> = {};
  seats.forEach((s) => (seatsMap[s.id] = s));
  useSeatStore.setState({ seats: seatsMap });
});

describe("useSeatStore", () => {
  it("initializes with 100 seats", () => {
    const { seats } = useSeatStore.getState();
    expect(Object.keys(seats)).toHaveLength(100);
  });

  it("all seats start as available", () => {
    const { seats } = useSeatStore.getState();
    Object.values(seats).forEach((seat) => {
      expect(seat.status).toBe("available");
    });
  });

  it("selectSeat marks seat as selected and adds to cart", () => {
    const { selectSeat } = useSeatStore.getState();
    selectSeat("A1");

    const { seats, selectedSeatIds } = useSeatStore.getState();
    expect(seats["A1"].status).toBe("selected");
    expect(seats["A1"].reservedUntil).toBeTypeOf("number");
    expect(selectedSeatIds).toContain("A1");
  });

  it("selectSeat rejects unavailable seat (conflict resolution)", () => {
    const { markUnavailable, selectSeat } = useSeatStore.getState();
    markUnavailable("A1");
    selectSeat("A1");

    const { seats, selectedSeatIds } = useSeatStore.getState();
    expect(seats["A1"].status).toBe("unavailable");
    expect(selectedSeatIds).not.toContain("A1");
  });

  it("deselectSeat reverts seat to available and removes from cart", () => {
    const { selectSeat, deselectSeat } = useSeatStore.getState();
    selectSeat("B2");
    deselectSeat("B2");

    const { seats, selectedSeatIds } = useSeatStore.getState();
    expect(seats["B2"].status).toBe("available");
    expect(seats["B2"].reservedUntil).toBeNull();
    expect(selectedSeatIds).not.toContain("B2");
  });

  it("markUnavailable removes a selected seat from cart", () => {
    const { selectSeat, markUnavailable } = useSeatStore.getState();
    selectSeat("A3");
    markUnavailable("A3");

    const { seats, selectedSeatIds } = useSeatStore.getState();
    expect(seats["A3"].status).toBe("unavailable");
    expect(selectedSeatIds).not.toContain("A3");
  });

  it("releaseExpiredSeats clears entire cart when a seat expires", () => {
    const { selectSeat } = useSeatStore.getState();
    selectSeat("A1");
    selectSeat("D5");

    // Manually expire A1 by setting reservedUntil to the past
    const { seats } = useSeatStore.getState();
    useSeatStore.setState({
      seats: {
        ...seats,
        A1: { ...seats["A1"], reservedUntil: Date.now() - 1000 },
      },
    });

    useSeatStore.getState().releaseExpiredSeats();

    const state = useSeatStore.getState();
    expect(state.selectedSeatIds).toHaveLength(0);
    expect(state.seats["A1"].status).toBe("available");
    expect(state.seats["D5"].status).toBe("available");
  });

  it("releaseExpiredSeats does nothing when no seats are expired", () => {
    const { selectSeat } = useSeatStore.getState();
    selectSeat("A1");

    useSeatStore.getState().releaseExpiredSeats();

    const state = useSeatStore.getState();
    expect(state.selectedSeatIds).toContain("A1");
    expect(state.seats["A1"].status).toBe("selected");
  });

  it("checkout marks selected seats unavailable and clears cart", () => {
    const { selectSeat, checkout } = useSeatStore.getState();
    selectSeat("A1");
    selectSeat("D5");
    checkout();

    const state = useSeatStore.getState();
    expect(state.selectedSeatIds).toHaveLength(0);
    expect(state.seats["A1"].status).toBe("unavailable");
    expect(state.seats["D5"].status).toBe("unavailable");
  });

  it("checkout rejects empty cart", () => {
    useSeatStore.getState().checkout();

    const state = useSeatStore.getState();
    expect(state.selectedSeatIds).toHaveLength(0);
  });

  it("pricing tiers are correct (VIP=350, General=150)", () => {
    const { seats } = useSeatStore.getState();
    expect(seats["A1"].tier).toBe("VIP");
    expect(seats["A1"].price).toBe(350);
    expect(seats["D1"].tier).toBe("General");
    expect(seats["D1"].price).toBe(150);
  });
});
