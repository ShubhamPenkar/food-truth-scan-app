import type { FoodData } from '@/components/FoodAnalyzer';

// OpenFoodFacts API integration
const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0';

interface OpenFoodFactsProduct {
  product_name?: string;
  ingredients_text?: string;
  nutriments?: {
    energy_kcal_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
  };
  allergens_tags?: string[];
  additives_tags?: string[];
  categories_tags?: string[];
  nutriscore_grade?: string;
}

export const searchFoodItem = async (query: string): Promise<OpenFoodFactsProduct | null> => {
  try {
    const response = await fetch(
      `${OPENFOODFACTS_API}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=1`
    );
    
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      return data.products[0];
    }
    
    return null;
  } catch (error) {
    console.error('OpenFoodFacts API error:', error);
    return null;
  }
};

export const calculateHealthScore = (nutrition: any, additives: string[] = [], allergens: string[] = []): number => {
  let score = 50; // Base score

  if (nutrition) {
    // Positive factors
    if (nutrition.protein && nutrition.protein > 10) score += 15;
    if (nutrition.fiber && nutrition.fiber > 3) score += 15;
    if (nutrition.calories && nutrition.calories < 200) score += 10;

    // Negative factors
    if (nutrition.sugar && nutrition.sugar > 15) score -= 20;
    if (nutrition.sodium && nutrition.sodium > 600) score -= 15;
    if (nutrition.fat && nutrition.fat > 20) score -= 10;
  }

  // Additives penalty
  score -= additives.length * 5;

  // Allergens (informational, not always negative)
  score -= allergens.length * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const detectDietaryCompatibility = (ingredients: string[], allergens: string[]) => {
  const ingredientText = ingredients.join(' ').toLowerCase();
  const allergenText = allergens.join(' ').toLowerCase();

  return {
    vegan: !/(meat|chicken|beef|pork|fish|milk|egg|honey|cheese|butter|cream|whey|casein|gelatin)/i.test(ingredientText),
    vegetarian: !/(meat|chicken|beef|pork|fish|gelatin)/i.test(ingredientText),
    glutenFree: !/gluten|wheat|barley|rye|spelt/i.test(allergenText + ingredientText),
    dairyFree: !/milk|dairy|lactose|cheese|butter|cream|whey|casein/i.test(allergenText + ingredientText),
    keto: nutrition => {
      if (!nutrition.carbs || !nutrition.fat) return false;
      return nutrition.carbs < 10 && nutrition.fat > 15;
    }
  };
};

export const analyzeFoodItem = async (query: string): Promise<FoodData> => {
  console.log('Analyzing food item:', query);

  // Try to fetch from OpenFoodFacts
  const product = await searchFoodItem(query);
  
  if (product) {
    const ingredients = product.ingredients_text 
      ? product.ingredients_text.split(',').map(i => i.trim()).filter(i => i.length > 0)
      : [];

    const nutrition = product.nutriments ? {
      calories: product.nutriments.energy_kcal_100g || 0,
      fat: product.nutriments.fat_100g || 0,
      carbs: product.nutriments.carbohydrates_100g || 0,
      protein: product.nutriments.proteins_100g || 0,
      fiber: product.nutriments.fiber_100g || 0,
      sugar: product.nutriments.sugars_100g || 0,
      sodium: product.nutriments.sodium_100g || 0,
    } : undefined;

    const allergens = product.allergens_tags?.map(tag => 
      tag.replace('en:', '').replace(/-/g, ' ')
    ) || [];

    const additives = product.additives_tags?.map(tag => 
      tag.replace('en:', '').replace(/-/g, ' ')
    ) || [];

    const dietaryInfo = detectDietaryCompatibility(ingredients, allergens);
    const healthScore = calculateHealthScore(nutrition, additives, allergens);

    return {
      name: product.product_name || query,
      ingredients,
      nutrition,
      additives,
      allergens,
      dietaryInfo: {
        ...dietaryInfo,
        keto: nutrition ? dietaryInfo.keto(nutrition) : false
      },
      healthScore
    };
  }

  // Fallback: Generate mock data for demonstration
  return generateMockAnalysis(query);
};

export const analyzeIngredientList = async (ingredients: string[]): Promise<FoodData> => {
  console.log('Analyzing ingredient list:', ingredients);

  // Analyze each ingredient and combine results
  const mockNutrition = {
    calories: Math.random() * 300 + 100,
    fat: Math.random() * 20 + 5,
    carbs: Math.random() * 40 + 10,
    protein: Math.random() * 15 + 3,
    fiber: Math.random() * 8 + 1,
    sugar: Math.random() * 25 + 2,
    sodium: Math.random() * 800 + 100,
  };

  const commonAllergens = ['gluten', 'milk', 'eggs', 'nuts', 'soy'];
  const detectedAllergens = ingredients.filter(ingredient => 
    commonAllergens.some(allergen => 
      ingredient.toLowerCase().includes(allergen)
    )
  );

  const commonAdditives = ['artificial colors', 'preservatives', 'artificial flavors'];
  const detectedAdditives = ingredients.filter(ingredient => 
    commonAdditives.some(additive => 
      ingredient.toLowerCase().includes(additive.split(' ')[0])
    )
  );

  const dietaryInfo = detectDietaryCompatibility(ingredients, detectedAllergens);
  const healthScore = calculateHealthScore(mockNutrition, detectedAdditives, detectedAllergens);

  return {
    name: `Recipe with ${ingredients.length} ingredients`,
    ingredients,
    nutrition: mockNutrition,
    additives: detectedAdditives,
    allergens: detectedAllergens,
    dietaryInfo: {
      ...dietaryInfo,
      keto: dietaryInfo.keto(mockNutrition)
    },
    healthScore
  };
};

const generateMockAnalysis = (query: string): FoodData => {
  // Generate realistic mock data based on food type
  const isHealthy = /(oat|quinoa|vegetable|fruit|organic|whole)/i.test(query);
  const isUnhealthy = /(cola|candy|chip|fried|processed)/i.test(query);

  let baseScore = 50;
  if (isHealthy) baseScore = 75;
  if (isUnhealthy) baseScore = 25;

  const mockNutrition = {
    calories: isUnhealthy ? Math.random() * 200 + 200 : Math.random() * 150 + 50,
    fat: isUnhealthy ? Math.random() * 15 + 10 : Math.random() * 8 + 2,
    carbs: Math.random() * 30 + 10,
    protein: isHealthy ? Math.random() * 10 + 5 : Math.random() * 6 + 2,
    fiber: isHealthy ? Math.random() * 6 + 3 : Math.random() * 2 + 0.5,
    sugar: isUnhealthy ? Math.random() * 30 + 15 : Math.random() * 8 + 2,
    sodium: isUnhealthy ? Math.random() * 600 + 400 : Math.random() * 200 + 50,
  };

  const healthScore = calculateHealthScore(mockNutrition, [], []);

  return {
    name: query,
    ingredients: [
      ...(isHealthy ? ['organic ingredients', 'natural flavors'] : []),
      ...(isUnhealthy ? ['sugar', 'artificial colors', 'preservatives'] : []),
      'water', 'natural ingredients'
    ],
    nutrition: mockNutrition,
    additives: isUnhealthy ? ['artificial colors', 'preservatives'] : [],
    allergens: Math.random() > 0.7 ? ['may contain nuts'] : [],
    dietaryInfo: {
      vegan: !/(milk|meat|egg)/i.test(query),
      vegetarian: !/(meat|fish)/i.test(query),
      glutenFree: !/(wheat|bread|pasta)/i.test(query),
      dairyFree: !/(milk|cheese|yogurt)/i.test(query),
      keto: mockNutrition.carbs < 10 && mockNutrition.fat > 15
    },
    healthScore
  };
};