interface RegisterData {
  name: string
  email: string
  password: string
  organization: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    organization: string
  }
  token: string
}

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulated user database
const users: RegisterData[] = []

export const userService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate API call
    await delay(1000)

    // Check if user already exists
    const existingUser = users.find((user) => user.email === data.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Add user to "database"
    users.push(data)

    // Return user data and token
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        organization: data.organization,
      },
      token: Math.random().toString(36).substr(2, 9),
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    // Simulate API call
    await delay(1000)

    // Find user
    const user = users.find((u) => u.email === data.email && u.password === data.password)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Return user data and token
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: user.email,
        organization: user.organization,
      },
      token: Math.random().toString(36).substr(2, 9),
    }
  },
}
