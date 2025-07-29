import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { HealthScoreBadge } from '@/components/HealthScoreBadge';
import { NutritionChart } from '@/components/NutritionChart';
import { analyzeSafety } from '@/data/harmfulIngredients';
import { useTranslation } from 'react-i18next';
import type { FoodData } from './FoodAnalyzer';

interface AnalysisResultsProps {
  data: FoodData;
  onBack: () => void;
  isLoading: boolean;
}

export const AnalysisResults = ({ data, onBack, isLoading }: AnalysisResultsProps) => {
  const { t } = useTranslation();
  
  // Analyze safety using our harmful ingredients database
  const safetyAnalysis = analyzeSafety(data.ingredients || []);
  
  // Calculate risk indicators for the risk meter
  const riskIndicators = {
    additives: data.additives?.length || 0,
    allergens: data.allergens?.length || 0,
    transFats: data.ingredients?.some(ing => 
      ing.toLowerCase().includes('trans fat') || 
      ing.toLowerCase().includes('partially hydrogenated')
    ) || false,
    highSodium: (data.nutrition?.sodium || 0) > 600,
    artificialColors: data.additives?.some(add => 
      add.toLowerCase().includes('color') || add.toLowerCase().includes('dye')
    ) || false,
    preservatives: data.additives?.filter(add => 
      add.toLowerCase().includes('preserv') || 
      add.toLowerCase().includes('acid') ||
      add.toLowerCase().includes('benzoate')
    ).length || 0
  };
  const getDietaryBadgeColor = (isCompatible: boolean) => {
    return isCompatible ? 'bg-health-excellent/10 text-health-excellent border-health-excellent/30' : 
           'bg-health-poor/10 text-health-poor border-health-poor/30';
  };

  const getAllergenIcon = (allergen: string) => {
    const dangerous = ['peanuts', 'tree nuts', 'shellfish', 'soy'];
    return dangerous.some(d => allergen.toLowerCase().includes(d)) ? 
           <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Analyzing Food...</h3>
          <p className="text-muted-foreground">This may take a few seconds</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={onBack}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
              <p className="text-muted-foreground">Health analysis results</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Health Score */}
            <div className="lg:col-span-1">
              <Card className="p-6 text-center shadow-card">
                <HealthScoreBadge score={data.healthScore || 0} size="large" />
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Overall Health Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on nutritional value, additives, and ingredients
                  </p>
                </div>
              </Card>
            </div>

            {/* Nutrition Information */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Nutritional Information
                </h3>
                {data.nutrition ? (
                  <NutritionChart nutrition={data.nutrition} />
                ) : (
                  <p className="text-muted-foreground">No nutritional data available</p>
                )}
              </Card>
            </div>

            {/* Allergens */}
            {data.allergens && data.allergens.length > 0 && (
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-health-danger">
                    <AlertTriangle className="w-5 h-5" />
                    Allergens
                  </h3>
                  <div className="space-y-2">
                    {data.allergens.map((allergen, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-health-danger/10 rounded-lg border border-health-danger/30">
                        {getAllergenIcon(allergen)}
                        <span className="text-health-danger capitalize">{allergen}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Dietary Compatibility */}
            {data.dietaryInfo && (
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Dietary Info
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(data.dietaryInfo).map(([diet, compatible]) => (
                      <Badge
                        key={diet}
                        className={`w-full justify-between ${getDietaryBadgeColor(compatible)}`}
                      >
                        <span className="capitalize">{diet.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {compatible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Additives & Concerns */}
            {data.additives && data.additives.length > 0 && (
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-card">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-health-moderate">
                    <AlertTriangle className="w-5 h-5" />
                    Additives
                  </h3>
                  <div className="space-y-2">
                    {data.additives.map((additive, index) => (
                      <Badge
                        key={index}
                        className="w-full bg-health-moderate/10 text-health-moderate border-health-moderate/30"
                      >
                        {additive}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Ingredients */}
            {data.ingredients && data.ingredients.length > 0 && (
              <div className="lg:col-span-3">
                <Card className="p-6 shadow-card">
                  <h3 className="text-lg font-semibold mb-4">Ingredients ({data.ingredients.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Recommendations */}
            <div className="lg:col-span-3">
              <Card className="p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {(data.healthScore || 0) >= 80 ? (
                    <div className="p-4 bg-health-excellent/10 border border-health-excellent/30 rounded-lg">
                      <p className="text-health-excellent font-medium">✅ Great choice! This food is nutritious and healthy.</p>
                    </div>
                  ) : (data.healthScore || 0) >= 60 ? (
                    <div className="p-4 bg-health-moderate/10 border border-health-moderate/30 rounded-lg">
                      <p className="text-health-moderate font-medium">⚠️ Moderate choice. Consider portion sizes and frequency.</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-health-danger/10 border border-health-danger/30 rounded-lg">
                      <p className="text-health-danger font-medium">❌ Consider healthier alternatives or consume in moderation.</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Check for allergens if you have sensitivities</p>
                    <p>• Consider your dietary goals and restrictions</p>
                    <p>• Balance with other nutritious foods in your diet</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};