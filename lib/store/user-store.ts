import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState {
  isFirstTime: boolean
  hasTransactions: boolean
  hasCases: boolean
  registrationDate: string | null
  setFirstTimeComplete: () => void
  setHasTransactions: (value: boolean) => void
  setHasCases: (value: boolean) => void
  setRegistrationDate: (date: string) => void
  resetUserData: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isFirstTime: true,
      hasTransactions: false,
      hasCases: false,
      registrationDate: null,

      setFirstTimeComplete: () => set({ isFirstTime: false }),
      setHasTransactions: (value: boolean) => set({ hasTransactions: value }),
      setHasCases: (value: boolean) => set({ hasCases: value }),
      setRegistrationDate: (date: string) => set({ registrationDate: date }),
      resetUserData: () =>
        set({
          isFirstTime: true,
          hasTransactions: false,
          hasCases: false,
          registrationDate: null,
        }),
    }),
    {
      name: "user-storage",
    },
  ),
)
