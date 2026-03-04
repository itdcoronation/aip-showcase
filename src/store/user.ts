import { RiskAnswers } from "@/types/risk-profile";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BasicInfo {
  email: string;
  bvn: string;
  phone: string;
  first_name: string;
  last_name: string;
}

interface RiskProfileInfo {
  risk_category: string;
  risk_answers: RiskAnswers | null;
}

interface UserState {
  staging_id: string;
  setStagingID: (step: string) => void;
  basic_info: BasicInfo;
  setBasicInfo: (info: BasicInfo) => void;
  risk_profile: RiskProfileInfo;
  setRiskProfile: (info: RiskProfileInfo) => void;
  reset: () => void;
}

const initialBasicInfo: BasicInfo = {
  email: "",
  bvn: "",
  phone: "",
  first_name: "",
  last_name: "",
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      staging_id: "",
      setStagingID: (staging_id) => set({ staging_id }),
      basic_info: initialBasicInfo,
      setBasicInfo: (data) => set({ basic_info: data }),
      risk_profile: { risk_category: "", risk_answers: null },
      setRiskProfile: (data) => set({ risk_profile: data }),
      reset: () =>
        set({
          staging_id: "",
          basic_info: initialBasicInfo,
          risk_profile: { risk_category: "", risk_answers: null },
        }),
    }),
    {
      name: "user-storage", // Key for localStorage
    }
  )
);

export default useUserStore;
