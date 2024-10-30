import { create } from "zustand";

interface AppStore {
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  getTotalSteps: () => number;
}

const useAppStore = create<AppStore>((set, get) => ({
  step: 1,
  phoneNumber: "",
  otp: "",
  setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
  setOtp: (otp: string) => set({ otp }),
  nextStep: () => set({ step: get().step + 1 }),
  prevStep: () => set({ step: get().step - 1 }),
  getTotalSteps: () => 5,
}));

export default useAppStore;
