// features/home/hooks/useRouteStore.ts
import { create } from "zustand";

type RouteStop = {
  name: string;
  description?: string;
};

type RouteStore = {
  origin: RouteStop | null;
  destination: { city: RouteStop } | null;
  setOrigin: (origin: RouteStop | null) => void;
  setDestination: (destination: { city: RouteStop } | null) => void;
  reset: () => void;
};

export const useRouteStore = create<RouteStore>((set) => ({
  origin: null,
  destination: null,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  reset: () => set({ origin: null, destination: null }),
}));
