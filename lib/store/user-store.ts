import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string
  name: string
  email: string
  organization: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  organization: string
}

interface UserState {
  user: User | null
  token: string | null
  registeredUsers: RegisterData[]
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  registerUser: (data: RegisterData) => Promise<{ user: User; token: string }>
  loginUser: (email: string, password: string) => Promise<{ user: User; token: string }>
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      registeredUsers: [],
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      registerUser: async (data) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const { registeredUsers } = get()
        
        // Check if user already exists
        if (registeredUsers.some((user) => user.email === data.email)) {
          throw new Error("User already exists")
        }

        // Create new user
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          email: data.email,
          organization: data.organization,
        }

        // Add to registered users
        set((state) => ({
          registeredUsers: [...state.registeredUsers, data],
        }))

        // Generate token
        const token = Math.random().toString(36).substr(2, 9)

        return { user: newUser, token }
      },
      loginUser: async (email, password) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const { registeredUsers } = get()
        
        // Find user
        const user = registeredUsers.find(
          (u) => u.email === email && u.password === password
        )

        if (!user) {
          throw new Error("Invalid credentials")
        }

        // Create user object
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          name: user.name,
          email: user.email,
          organization: user.organization,
        }

        // Generate token
        const token = Math.random().toString(36).substr(2, 9)

        return { user: userData, token }
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "user-storage",
    }
  )
) 