import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  email: string;
  setEmail: (step: string) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      reset: () => set({ email: "" }),
    }),
    {
      name: "authentication-storage", // Key for localStorage
    }
  )
);

export default useAuthStore;
