import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface FoodItem {
  _id?: string;
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  expiryDate: string;
  description: string;
  dietary: string[];
  vendor: {
    name: string;
    id: string;
    location: string;
  };
  ingredients: string[];
  emissions?: {
    saved: number;
    total: number;
  };
  image?: string;
}

interface EmissionsCalculation {
  total: number;
  saved: number;
  breakdown: Array<{
    ingredient: string;
    emissions: number;
  }>;
}

async function calculateEmissions(dishName: string, ingredients: string[]): Promise<EmissionsCalculation> {
  const response = await axios.post(`${API_URL}/emissions/calculate`, {
    dishName,
    ingredients
  });
  return response.data;
}

export const api = {
  async createFoodItem(item: Omit<FoodItem, '_id' | 'emissions'>, ingredients: string[]): Promise<FoodItem> {
    // Calculate emissions using backend endpoint
    const emissionsData = await calculateEmissions(item.name, ingredients);
    
    const itemWithEmissions = {
      ...item,
      ingredients: ingredients,
      emissions: {
        saved: emissionsData.saved,
        total: emissionsData.total
      }
    };
    
    const response = await axios.post(`${API_URL}/food-items`, itemWithEmissions);
    return response.data;
  },

  async getFoodItems(): Promise<FoodItem[]> {
    const response = await axios.get(`${API_URL}/food-items`);
    return response.data;
  },

  async updateFoodItem(id: string, item: Partial<FoodItem>): Promise<FoodItem> {
    const response = await axios.put(`${API_URL}/food-items/${id}`, item);
    return response.data;
  },

  async deleteFoodItem(id: string): Promise<void> {
    await axios.delete(`${API_URL}/food-items/${id}`);
  }
};