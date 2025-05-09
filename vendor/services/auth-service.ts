import axios from "axios";
import { User } from "@/context/auth-context";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
};

const API_URL = "http://localhost:4000/api/vendor";

export const authService = {
  // --- Real Login Function ---
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);

      const responseData = response.data;

      if (responseData.token) {
        // Store the token in localStorage
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));

        // Return user data in expected format
        return {
          success: true,
          user: {
            id: responseData.user.id || responseData.user._id,
            email: responseData.user.email,
            name: responseData.user.name,
            businessName: responseData.user.businessName,
            location: responseData.user.location,
          },
        };
      } else {
        return {
          success: false,
          error: "Login failed. Please try again.",
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  },

  // --- Logout Function ---
  logout: async (): Promise<void> => {
    localStorage.removeItem("currentUser");
  },
};
