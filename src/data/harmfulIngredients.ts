// Comprehensive database of harmful/controversial ingredients
export interface HarmfulIngredient {
  name: string;
  aliases: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  bannedRegions: string[];
  category: 'additive' | 'preservative' | 'coloring' | 'sweetener' | 'oil' | 'allergen';
  description: string;
}

export const harmfulIngredients: HarmfulIngredient[] = [
  {
    name: 'Red Dye 40',
    aliases: ['Allura Red AC', 'FD&C Red No. 40', 'E129'],
    severity: 'medium',
    warnings: ['May cause hyperactivity in children', 'Potential carcinogen'],
    bannedRegions: ['Norway', 'Finland', 'France'],
    category: 'coloring',
    description: 'Artificial food coloring linked to behavioral issues in children'
  },
  {
    name: 'Trans Fats',
    aliases: ['Partially Hydrogenated Oil', 'Hydrogenated Vegetable Oil'],
    severity: 'critical',
    warnings: ['Increases heart disease risk', 'Raises bad cholesterol'],
    bannedRegions: ['Denmark', 'Switzerland', 'New York'],
    category: 'oil',
    description: 'Artificial fats that significantly increase cardiovascular disease risk'
  },
  {
    name: 'TBHQ',
    aliases: ['Tertiary Butylhydroquinone', 'tBHQ'],
    severity: 'medium',
    warnings: ['Potential carcinogen', 'May cause nausea'],
    bannedRegions: ['Japan', 'European Union'],
    category: 'preservative',
    description: 'Petroleum-derived preservative with potential health risks'
  },
  {
    name: 'Palm Oil',
    aliases: ['Elaeis guineensis', 'Palm Kernel Oil'],
    severity: 'low',
    warnings: ['Environmental concern', 'High in saturated fats'],
    bannedRegions: [],
    category: 'oil',
    description: 'Controversial oil due to environmental impact and health concerns'
  },
  {
    name: 'High Fructose Corn Syrup',
    aliases: ['HFCS', 'Corn Syrup', 'Glucose-Fructose Syrup'],
    severity: 'medium',
    warnings: ['Linked to obesity', 'May cause insulin resistance'],
    bannedRegions: [],
    category: 'sweetener',
    description: 'Processed sweetener linked to metabolic disorders'
  },
  {
    name: 'Aspartame',
    aliases: ['NutraSweet', 'Equal', 'E951'],
    severity: 'medium',
    warnings: ['Potential neurological effects', 'May cause headaches'],
    bannedRegions: [],
    category: 'sweetener',
    description: 'Artificial sweetener with controversial health effects'
  },
  {
    name: 'MSG',
    aliases: ['Monosodium Glutamate', 'E621', 'Glutamic Acid'],
    severity: 'low',
    warnings: ['May cause headaches', 'Sensitivity reactions'],
    bannedRegions: [],
    category: 'additive',
    description: 'Flavor enhancer that may cause adverse reactions in sensitive individuals'
  },
  {
    name: 'Sodium Nitrite',
    aliases: ['E250', 'Sodium Nitrate', 'E251'],
    severity: 'medium',
    warnings: ['Potential carcinogen', 'Forms nitrosamines'],
    bannedRegions: [],
    category: 'preservative',
    description: 'Preservative that may form cancer-causing compounds'
  }
];

export const getIngredientRisk = (ingredient: string): HarmfulIngredient | null => {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  
  return harmfulIngredients.find(harmful => 
    harmful.name.toLowerCase().includes(normalizedIngredient) ||
    harmful.aliases.some(alias => 
      alias.toLowerCase().includes(normalizedIngredient) ||
      normalizedIngredient.includes(alias.toLowerCase())
    )
  ) || null;
};

export const analyzeSafety = (ingredients: string[]) => {
  const risks = ingredients
    .map(ingredient => getIngredientRisk(ingredient))
    .filter(Boolean) as HarmfulIngredient[];
  
  const severityScore = risks.reduce((score, risk) => {
    switch (risk.severity) {
      case 'critical': return score + 4;
      case 'high': return score + 3;
      case 'medium': return score + 2;
      case 'low': return score + 1;
      default: return score;
    }
  }, 0);
  
  const maxPossibleScore = ingredients.length * 4;
  const safetyPercentage = Math.max(0, ((maxPossibleScore - severityScore) / maxPossibleScore) * 100);
  
  return {
    risks,
    safetyScore: Math.round(safetyPercentage),
    overallRisk: severityScore > 8 ? 'high' : severityScore > 4 ? 'medium' : 'low'
  };
};