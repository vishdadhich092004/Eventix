# Eventix — Live Seat Booking

A real-time, high-concurrency seat selection interface for venue ticket booking. Built with React, TypeScript, and Zustand.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433D37?logo=data:image/svg+xml;base64,&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **100-seat venue layout** — 10×10 grid with VIP (₹350) and General (₹150) tiers, center aisle, and row labels
- **Real-time concurrency simulation** — every 5 seconds, 1–2 available seats are randomly marked as taken to simulate concurrent users
- **5-minute reservation timer** — selecting a seat starts a countdown; if unconfirmed, the entire cart expires and seats revert to available
- **Conflict resolution** — clicking a seat at the exact moment it becomes unavailable shows a "Seat just taken!" toast
- **Sliding cart panel** — shows selected seats, per-seat pricing, total, and a global countdown timer with urgency state
- **Checkout confirmation** — confirmation dialog before finalizing a booking
- **Dark/Light mode** — animated theme toggle using the View Transitions API
- **State persistence** — cart and seat state survive page refreshes via Zustand persist middleware
- **Accessible** — full keyboard navigation, ARIA roles, screen reader labels

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| State | Zustand (with persist middleware) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Icons | Phosphor Icons |
| Notifications | Sonner |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── CartPanel.tsx       # Sliding cart sidebar with timer & checkout
│   ├── Header.tsx          # App header with stats & occupancy bar
│   ├── Legend.tsx           # Seat status legend
│   ├── Seat.tsx            # Individual seat component (memoized)
│   ├── SeatGrid.tsx        # Venue grid layout with VIP/General sections
│   ├── mode-toggle.tsx     # Theme toggle wrapper
│   ├── theme-provider.tsx  # Dark/Light theme context
│   └── ui/                 # shadcn/ui primitives
├── hooks/
│   ├── useConcurrency.ts   # Simulates other users buying seats (5s interval)
│   ├── useCountdown.ts     # Single interval countdown for all selected seats
│   └── useTimer.ts         # Checks for expired reservations
├── lib/
│   ├── config.ts           # Centralized venue & timing configuration
│   └── utils.ts            # Tailwind merge utility
├── seed/
│   └── generateSeats.ts    # Generates 100-seat venue layout
├── store/
│   └── useSeatStore.ts     # Zustand store with all seat actions
├── types/
│   └── seat.ts             # Seat type definitions & pricing
├── App.tsx                 # Root component
├── main.tsx                # Entry point with providers
└── index.css               # Design tokens & global styles
```

## Design Decisions

- **Global cart timer** — uses the soonest-expiring seat's countdown; if any seat expires, the entire cart clears (prevents partial stale reservations)
- **Single countdown interval** — `useCountdown` runs one `setInterval` for all seats (O(n) per tick) instead of per-seat intervals
- **Optimistic conflict resolution** — `selectSeat` checks status synchronously before mutation; the concurrency simulation uses the same `markUnavailable` action, ensuring atomic state transitions
- **Seat memoization** — `React.memo` on `Seat` + `useCallback` on handlers minimizes rerenders on the 100-element grid
