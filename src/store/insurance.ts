import {
  InsuranceProductsData,
  PersonalInfoData,
  VehicleInfoData,
} from "@/types/insurance";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface InsuranceState {
  products: InsuranceProductsData;
  personalInfo: Partial<PersonalInfoData>;
  vehicleInfo: Partial<VehicleInfoData>;
  setProducts: (products: InsuranceProductsData) => void;
  setPersonalInfo: (info: Partial<PersonalInfoData>) => void;
  setVehicleInfo: (info: Partial<VehicleInfoData>) => void;
  resetProducts: () => void;
  clearPersonalInfo: () => void;
  clearVehicleInfo: () => void;
  resetPurchaseFlow: () => void;
}

const initialProducts: InsuranceProductsData = {
  third_party_motor_insurance: {
    private: {},
    commercial: {},
  },
};
const initialPersonalInfo: Partial<PersonalInfoData> = {};
const initialVehicleInfo: Partial<VehicleInfoData> = {};

type PersistedInsuranceState = {
  products?: InsuranceProductsData;
  personalInfo?: Partial<PersonalInfoData> & {
    dateOfBirth?: string | Date;
  };
  vehicleInfo?: Partial<VehicleInfoData>;
};

const useInsuranceStore = create<InsuranceState>()(
  devtools(
    persist(
      (set) => ({
        products: initialProducts,
        personalInfo: initialPersonalInfo,
        vehicleInfo: initialVehicleInfo,
        setProducts: (products) => set({ products }),
        setPersonalInfo: (info) =>
          set((state) => ({
            personalInfo: { ...state.personalInfo, ...info },
          })),
        setVehicleInfo: (info) =>
          set((state) => ({ vehicleInfo: { ...state.vehicleInfo, ...info } })),
        resetProducts: () =>
          set({
            products: initialProducts,
          }),
        clearPersonalInfo: () =>
          set({
            personalInfo: initialPersonalInfo,
          }),
        clearVehicleInfo: () =>
          set({
            vehicleInfo: initialVehicleInfo,
          }),
        resetPurchaseFlow: () =>
          set({
            personalInfo: initialPersonalInfo,
            vehicleInfo: initialVehicleInfo,
          }),
      }),
      {
        name: "insurance-storage",
        partialize: (state) => ({
          products: state.products,
          personalInfo: {
            ...state.personalInfo,
            proofOfIdentity: undefined,
          },
          vehicleInfo: {
            ...state.vehicleInfo,
          },
        }),
        merge: (persistedState, currentState) => {
          const typedPersistedState = persistedState as PersistedInsuranceState;
          const persistedDateOfBirth =
            typedPersistedState.personalInfo?.dateOfBirth;

          return {
            ...currentState,
            ...typedPersistedState,
            personalInfo: {
              ...currentState.personalInfo,
              ...typedPersistedState.personalInfo,
              dateOfBirth: persistedDateOfBirth
                ? new Date(persistedDateOfBirth)
                : undefined,
              proofOfIdentity: undefined,
            },
            vehicleInfo: {
              ...currentState.vehicleInfo,
              ...typedPersistedState.vehicleInfo,
            },
          };
        },
      },
    ),
  ),
);

export default useInsuranceStore;
