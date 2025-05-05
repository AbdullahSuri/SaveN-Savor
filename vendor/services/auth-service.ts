// This file contains the authentication API service
// In a real app, this would make actual API calls to your backend

import { User } from "@/context/auth-context"

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // For demo purposes, we're using a mock authentication
    // In a real app, you would make an API call to your backend
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock credentials check
    if (credentials.email === "admin@spicegarden.com" && credentials.password === "password") {
      return {
        success: true,
        user: {
          id: "user-123",
          email: "admin@spicegarden.com",
          name: "Admin User",
          role: "admin"
        },
        token: "mock_jwt_token_12345"
      }
    }
    
    return {
      success: false,
      error: "Invalid email or password"
    }
  },
  
  // Verify token and get user
  getCurrentUser: async (): Promise<User | null> => {
    // For demo purposes, we'll just check if a token exists
    // In a real app, you would verify the token with your backend
    const token = localStorage.getItem("auth_token")
    
    if (!token) {
      return null
    }
    
    // Mock user data - in a real app, you would verify the token
    // and get the user data from your backend
    return {
      id: "user-123",
      email: "admin@spicegarden.com",
      name: "Admin User",
      role: "admin"
    }
  },
  
  // Logout function
  logout: async (): Promise<void> => {
    // Remove token from localStorage
    localStorage.removeItem("auth_token")
    
    // In a real app, you might want to call your backend to invalidate the token
  }
}