const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// Initialize Gemini with service account
let genAI = null;
let model = null;

async function initializeGemini() {
  try {
    const credentialsPath = path.resolve(__dirname, '../credentials/save-n-savor-26ebdf8139b8.json');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    
    const auth = new GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/generative-language']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (accessToken.token) {
      genAI = new GoogleGenerativeAI(accessToken.token);
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log('Gemini initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing Gemini:', error);
  }
}

// Call initialization when server starts
initializeGemini();

// Base emissions data
const baseEmissionsData = {
  meat: {
    beef: 60.0,
    chicken: 5.7,
    pork: 6.0,
    lamb: 39.2,
    turkey: 10.9,
  },
  dairy: {
    milk: 1.9,
    cheese: 21.0,
    yogurt: 2.5,
    eggs: 4.2,
  },
  grains: {
    rice: 2.7,
    wheat: 1.4,
    corn: 1.1,
    oats: 1.6,
  },
  vegetables: {
    tomatoes: 1.1,
    potatoes: 0.3,
    onions: 0.3,
    carrots: 0.3,
    lettuce: 0.4,
  },
  fruits: {
    apples: 0.3,
    bananas: 0.7,
    oranges: 0.4,
    mangoes: 0.8,
  },
  oils: {
    'olive oil': 5.4,
    'vegetable oil': 3.1,
    butter: 9.0,
  },
  spices: {
    default: 0.1,
  },
};

// Calculate emissions endpoint
router.post('/calculate', async (req, res) => {
  try {
    const { dishName, ingredients } = req.body;
    
    if (!dishName || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    let estimatedIngredients = [];
    
    // Try to use Gemini if available
    if (model) {
      try {
        const prompt = `
        Estimate the typical weight in grams for each ingredient in this dish:
        Dish: ${dishName}
        Ingredients: ${ingredients.join(', ')}
        
        Consider typical serving sizes and recipe proportions.
        Return as JSON:
        {
          "ingredients": [
            {"name": "ingredient1", "weight": 200},
            {"name": "ingredient2", "weight": 150}
          ]
        }
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        const parsedResponse = JSON.parse(jsonStr);
        
        estimatedIngredients = parsedResponse.ingredients.map(ing => ({
          ...ing,
          category: findCategory(ing.name),
          emissionsFactor: getEmissionsFactor(findCategory(ing.name) || 'unknown', ing.name)
        }));
      } catch (error) {
        console.error('Error using Gemini:', error);
        // Fall back to simple estimation
      }
    }
    
    // Use simple estimation if Gemini fails or isn't available
    if (estimatedIngredients.length === 0) {
      estimatedIngredients = ingredients.map(ingredient => {
        const weight = estimatePortionSize(ingredient);
        const category = findCategory(ingredient);
        return {
          name: ingredient,
          weight: weight,
          category: category || 'unknown',
          emissionsFactor: getEmissionsFactor(category || 'unknown', ingredient)
        };
      });
    }
    
    // Calculate emissions
    let totalEmissions = 0;
    const breakdown = [];
    
    for (const ingredient of estimatedIngredients) {
      const emissions = (ingredient.weight / 1000) * ingredient.emissionsFactor;
      totalEmissions += emissions;
      breakdown.push({
        ingredient: ingredient.name,
        emissions: emissions
      });
    }
    
    // Add waste factor (20%)
    totalEmissions *= 1.2;
    
    // Calculate savings (assuming 70% would have been wasted)
    const saved = totalEmissions * 0.7;
    
    res.json({
      total: totalEmissions,
      saved: saved,
      breakdown: breakdown
    });
    
  } catch (error) {
    console.error('Error calculating emissions:', error);
    res.status(500).json({ error: 'Failed to calculate emissions' });
  }
});

// Helper functions
function findCategory(ingredientName) {
  const normalizedName = ingredientName.toLowerCase();
  
  for (const [category, items] of Object.entries(baseEmissionsData)) {
    for (const item of Object.keys(items)) {
      if (normalizedName.includes(item) || item.includes(normalizedName)) {
        return category;
      }
    }
  }
  
  return null;
}

function getEmissionsFactor(category, item) {
  const categoryData = baseEmissionsData[category];
  if (categoryData && categoryData[item] !== undefined) {
    return categoryData[item];
  }
  
  return getCategoryAverage(category);
}

function getCategoryAverage(category) {
  const categoryData = baseEmissionsData[category];
  if (!categoryData) return 3.0;
  
  const values = Object.values(categoryData);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  return isNaN(avg) ? 3.0 : avg;
}

function estimatePortionSize(ingredient) {
  const cleanIngredient = ingredient.toLowerCase();
  
  if (cleanIngredient.includes('rice') || cleanIngredient.includes('pasta') || cleanIngredient.includes('grain')) {
    return 150; // 150g
  } else if (cleanIngredient.includes('meat') || cleanIngredient.includes('chicken') || cleanIngredient.includes('fish')) {
    return 200; // 200g
  } else if (cleanIngredient.includes('vegetable') || cleanIngredient.includes('fruit')) {
    return 100; // 100g
  } else if (cleanIngredient.includes('sauce') || cleanIngredient.includes('oil') || cleanIngredient.includes('dressing')) {
    return 50; // 50g
  } else if (cleanIngredient.includes('spice') || cleanIngredient.includes('seasoning')) {
    return 10; // 10g
  } else {
    return 100; // Default 100g
  }
}

module.exports = router;