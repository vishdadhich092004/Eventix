# Eventix — High-Concurrency Event Ticket Booking

A live seat selection interface for a venue that simulates real-time concurrency — seats can be taken by other users at any moment, and your selections are held under a countdown timer.

> **Assignment**: Option 3 — High-Concurrency Event Ticket Booking

---

## Features

### 1. Data & API
- **Mock Venue Layout** — 100 seats (10 rows × 10 columns) across two pricing tiers:
  | Tier | Rows | Price |
  |------|------|-------|
  | VIP | A – C (first 3 rows) | ₹350 |
  | General | D – J (remaining 7 rows) | ₹100 |
- **Concurrency Simulation** — An interval fires every **5 seconds**, randomly marking **1–2 available seats** as "Unavailable" to simulate other users purchasing tickets in real time.

### 2. Seat Selection Interface
- **Visual Seat Map** — A grid layout with seats rendered as armchair icons, color-coded by tier and status:
  - *Available* — Muted / clickable
  - *Selected by You* — Bold fill + checkmark indicator
  - *Unavailable* — Faded / disabled
- **VIP / General Divider** — Visual separator with distinct VIP labeling
- **Center Aisle** — Aisle gap after column 5 for realistic venue feel
- **Sliding Cart Panel** — Side panel showing selected seats, cart total, individual seat breakdown, and a checkout button with responsive mobile behavior

### 3. Core Logic
- **5-Minute Countdown Timer** — Selecting a seat puts it in a "Reserved" state. A **global countdown timer** (based on the soonest-expiring seat) is displayed in the cart. If the timer hits `0:00` before checkout, the **entire cart is cleared** and all seats revert to "Available."
- **Conflict Resolution** — If you click a seat at the exact moment the concurrency interval marks it unavailable, the store **rejects the click** and shows a **"Seat just taken!"** toast notification.
- **Checkout** — Confirms the booking, marks selected seats as permanently unavailable, and clears the cart.
- **Reset** — A reset button to restore all seats back to available state.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| State Management | Zustand (with `persist` middleware) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Icons | Phosphor Icons |
| Notifications | Sonner (toast library) |
| Theming | next-themes (dark/light mode) |

---

## Project Structure

```
src/
├── components/
│   ├── CartPanel.tsx        # Sliding cart sidebar with timer & checkout
│   ├── Header.tsx           # App header with live stats & occupancy bar
│   ├── Legend.tsx            # Seat status legend
│   ├── Seat.tsx             # Individual seat (memoized for performance)
│   ├── SeatGrid.tsx         # Venue grid layout with rows & aisle
│   ├── mode-toggle.tsx      # Light/dark theme toggle
│   ├── theme-provider.tsx   # Theme context provider
│   └── ui/                  # shadcn/ui primitives
├── hooks/
│   ├── useConcurrency.ts    # Simulates other users buying seats (5s interval)
│   ├── useCountdown.ts      # Single interval computing time-left for all seats
│   └── useTimer.ts          # Releases expired seat reservations
├── lib/
│   ├── config.ts            # Centralized app config (grid size, timer durations)
│   └── utils.ts             # Utility helpers (cn)
├── seed/
│   └── generateSeats.ts     # Generates the 100-seat venue layout
├── store/
│   └── useSeatStore.ts      # Zustand store — all seat & cart state logic
├── types/
│   └── seat.ts              # TypeScript types (Seat, SeatTier, SeatStatus)
├── App.tsx                  # Root component, initializes hooks
├── main.tsx                 # Entry point with ThemeProvider & Toaster
└── index.css                # Global styles & Tailwind imports
```

---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/vishdadhich092004/Eventix.git
cd Eventix

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## How It Works

### Concurrency Simulation
The `useConcurrency` hook sets up a `setInterval` that runs every 5 seconds. On each tick, it picks 1–2 random available seats and marks them as unavailable via the Zustand store, simulating real-time competition for tickets.

### Seat Reservation & Timer
1. Clicking an available seat calls `selectSeat()`, setting its status to `"selected"` and recording a `reservedUntil` timestamp (now + 5 minutes).
2. The `useTimer` hook runs every second, calling `releaseExpiredSeats()` — if **any** seat's reservation has expired, the **entire cart is cleared**.
3. The `useCountdown` hook computes seconds-left for all selected seats in a single interval (avoids per-seat timers), returning a `Map<seatId, secondsRemaining>`.

### Conflict Resolution
When `selectSeat(id)` is called, it reads the current seat status from the store. If the seat is anything other than `"available"` (e.g., the concurrency interval just marked it `"unavailable"`), the action is rejected and a `"Seat just taken!"` toast appears.

### State Persistence
Zustand's `persist` middleware saves seat and cart state to `localStorage`, so refreshing the page doesn't lose your selections.

---

## Configuration

All tunable parameters are in `src/lib/config.ts`:

```ts
export const CONFIG = {
  VENUE_COLS: 10,
  VENUE_ROWS: 10,
  VIP_ROWS: 3,
  AISLE_AFTER_COL: 4,
  RESERVE_TIME_MS: 5 * 60 * 1000,   // 5 minutes
  CONCURRENCY_INTERVAL_MS: 5000,     // 5 seconds
};
```

---

## Assignment Requirement Mapping

| Requirement | Implementation |
|---|---|
| ≥100 seats with pricing tiers | 100 seats: VIP (₹350) & General (₹100) |
| Concurrency simulation (5s interval, 1-2 seats) | `useConcurrency` hook |
| Visual seat map with color-coded statuses | `SeatGrid` + `Seat` components with tier/status styling |
| Side panel with cart total & checkout | `CartPanel` sliding sidebar |
| 5-min countdown on seat selection | `reservedUntil` timestamp + `useCountdown` / `useTimer` hooks |
| Cart cleared if timer expires | `releaseExpiredSeats()` clears entire cart |
| Conflict resolution with error message | `selectSeat()` rejects if not `"available"`, shows toast |
