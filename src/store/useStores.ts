import useAuthStore from "./authentication";
import useBalanceStore from "./balance";
import useOnboardingStore from "./onboarding";
import useUserStore from "./user";

export const resetStores = () => {
  return () => {
    useOnboardingStore.getState().resetOnboarding();
    useUserStore.getState().reset();
    useAuthStore.getState().reset();
    useBalanceStore.getState().reset();
  };
};
