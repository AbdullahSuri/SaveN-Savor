"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'

// API base URL - should match your existing API
const API_URL = 'http://localhost:4000/api';

// Define the User type
export type User = {
  id: string;
  email: string;
  name: string;
  businessName: string;
  location: string;
}

// Registration data type
export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  vendorName: string;
  location: string;
  vendorType: string;
}

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  error: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call the API to login
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.user) {
        // store the current user
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Set the user data
        setUser({
          id: data.user._id || data.user.id,
          email: data.user.email,
          name: data.user.name || data.vendorName || 'User',
          businessName: data.user.businessName,
          location: data.user.location,
        });

        return true;
      } else {
        setError("Invalid credentials");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid email or password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegistrationData) => {
    setLoading(true);
    setError(null);

    try {
      // Call the API to register
      const response = await axios.post(`${API_URL}/auth/register`, data);

      const responseData = response.data;

      if (responseData.user) {
        // Store the token
        localStorage.setItem("currentUser", JSON.stringify(responseData.user));

        // Set the user data
        setUser({
          id: responseData.user._id || responseData.user.id,
          email: responseData.user.email,
          name: responseData.user.name || data.vendorName || 'User',
          businessName: responseData.user.businessName,
          location: responseData.user.location,
        });

        return true;
      } else {
        setError("Registration failed");
        return false;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

  // // Mock login for demo purposes
  // const mockLogin = async (email: string, password: string) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // For demo purposes, we'll use hardcoded credentials
  //     if (email === "admin@spicegarden.com" && password === "password") {
  //       // Create mock user data
  //       const userData: User = {
  //         id: "vendor-123",
  //         email: "admin@spicegarden.com",
  //         name: "Spice Garden Admin",
  //       };

  //       // Store a mock token
  //       localStorage.setItem("auth_token", "mock_token_12345");

  //       // Set the user data
  //       setUser(userData);

  //       return true;
  //     } else {
  //       setError("Invalid email or password");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setError("An error occurred during login");
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Mock registration for demo purposes
  // const mockRegister = async (data: RegistrationData) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // For demo purposes, simulate a successful registration
  //     // In a real app, this would validate and store the user data

  //     // Create mock user data
  //     const userData: User = {
  //       id: "new-vendor-" + Date.now(),
  //       email: data.email,
  //       name: data.name,
  //       role: "vendor",
  //     };

  //     // Store a mock token
  //     localStorage.setItem("auth_token", "mock_register_token_" + Date.now());

  //     // Set the user data
  //     setUser(userData);

  //     return true;
  //   } catch (err) {
  //     console.error("Registration error:", err);
  //     setError("An error occurred during registration");
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        // Use the real login function if in production, otherwise use the mock login
        login: process.env.NODE_ENV === 'production' ? login : login,
        // Use the real register function if in production, otherwise use the mock register 
        register: process.env.NODE_ENV === 'production' ? register : register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}