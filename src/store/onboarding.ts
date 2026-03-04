import { OnboardingStepData } from "@/modules/onboarding/_components/layout";
import { OnboardingStatus, RetrieveOnboardingData } from "@/types/onboarding";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingStepTracker {
  personal_info: boolean;
  bank_info: boolean;
  next_of_kin: boolean;
  kyc: boolean;
  risk_profile: boolean;
}

interface OnboardingState {
  title: string;
  description: string;
  isOnboarded: boolean;
  setTitle: (step: string) => void;
  setDescription: (step: string) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  steps: OnboardingStepData[];
  setSteps: (steps: OnboardingStepData[]) => void;
  currentStep: string;
  completedSteps: string[];
  setCurrentStep: (step: string) => void;
  markStepComplete: (step: string) => void;

  // API States for onboarding
  completion_percentage: string;
  setCompletionPercentage: (percentage: string) => void;
  onboarding_status: OnboardingStatus;
  setOnboardingStatus: (onboarded: OnboardingStatus) => void;
  completion_status: OnboardingStepTracker;
  updateCompletionStatus: (status: Partial<OnboardingStepTracker>) => void;

  data: RetrieveOnboardingData | null;
  setData: (data: RetrieveOnboardingData) => void;
  resetOnboarding: () => void;
}

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      title: "Welcome Philip Ofei 👋🏾",
      description: "Complete a few quick steps to start enjoying our platform.",
      isOnboarded: false,
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      steps: [],
      setSteps: (steps) => set({ steps }),
      currentStep: "personal",
      completedSteps: [],
      setCurrentStep: (step) => set({ currentStep: step }),
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),
      completion_percentage: "",
      setCompletionPercentage: (completion_percentage) =>
        set({ completion_percentage }),
      onboarding_status: "draft" as OnboardingStatus,
      setOnboardingStatus: (onboarding_status) => set({ onboarding_status }),
      completion_status: {
        personal_info: false,
        bank_info: false,
        next_of_kin: false,
        kyc: false,
        risk_profile: false,
      },
      updateCompletionStatus: (completion_status) =>
        set((prev) => ({
          ...prev,
          completion_status: {
            ...prev.completion_status,
            ...completion_status,
          },
        })),
      data: null,
      setData: (data) => set({ data }),
      resetOnboarding: () =>
        set({ currentStep: "personal", completedSteps: [] }),
    }),
    {
      name: "onboarding-storage", // Key for localStorage
      partialize: (state) => ({
        steps: state.steps,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        completion_percentage: state.completion_percentage,
        onboarding_status: state.onboarding_status,
        completion_status: state.completion_status,
        isOnboarded: state.isOnboarded,
        data: state.data,
      }),
    }
  )
);

export default useOnboardingStore;
