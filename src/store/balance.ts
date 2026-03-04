import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BalanceState {
  hideBalance: boolean;
  setHideBalance: (show: boolean) => void;
  reset: () => void;
}

const useBalanceStore = create<BalanceState>()(
  persist(
    (set) => ({
      hideBalance: false,
      setHideBalance: (hideBalance) => set({ hideBalance }),
      reset: () => set({ hideBalance: false }),
    }),
    {
      name: "balance-storage", // Key for localStorage
    }
  )
);

export default useBalanceStore;
