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
  image?: {
    data: string;
    contentType: string;
  };
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
  async createFoodItem(item: Omit<FoodItem, '_id' | 'emissions'>, ingredients: string[], imageFile?: File): Promise<FoodItem> {
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
    
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    
    // Append all fields to FormData
    formData.append('name', itemWithEmissions.name);
    formData.append('category', itemWithEmissions.category);
    formData.append('originalPrice', itemWithEmissions.originalPrice.toString());
    formData.append('discountedPrice', itemWithEmissions.discountedPrice.toString());
    formData.append('quantity', itemWithEmissions.quantity.toString());
    formData.append('expiryDate', itemWithEmissions.expiryDate);
    formData.append('description', itemWithEmissions.description);
    formData.append('dietary', JSON.stringify(itemWithEmissions.dietary));
    formData.append('vendor', JSON.stringify(itemWithEmissions.vendor));
    formData.append('ingredients', JSON.stringify(itemWithEmissions.ingredients));
    formData.append('emissions', JSON.stringify(itemWithEmissions.emissions));
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await axios.post(`${API_URL}/food-items`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFoodItems(): Promise<FoodItem[]> {
    const response = await axios.get(`${API_URL}/food-items`);
    return response.data;
  },

  async updateFoodItem(id: string, item: Partial<FoodItem>, imageFile?: File): Promise<FoodItem> {
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    
    // Append all fields that are being updated
    Object.entries(item).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await axios.put(`${API_URL}/food-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteFoodItem(id: string): Promise<void> {
    await axios.delete(`${API_URL}/food-items/${id}`);
  },
  
  // Add method to get image URL
  getImageUrl(itemId: string): string {
    return `${API_URL}/food-items/${itemId}/image`;
  }
};