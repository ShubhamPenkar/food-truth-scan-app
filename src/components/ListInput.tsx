import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeIngredientList } from '@/services/foodAnalysis';
import type { FoodData } from './FoodAnalyzer';

interface ListInputProps {
  onAnalyze: (data: FoodData) => void;
  isLoading: boolean;
}

export const ListInput = ({ onAnalyze, isLoading }: ListInputProps) => {
  const [ingredientText, setIngredientText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { toast } = useToast();

  const parseIngredients = () => {
    if (!ingredientText.trim()) return;
    
    const parsed = ingredientText
      .split(/[,\n;]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .filter(item => !ingredients.includes(item));
    
    setIngredients(prev => [...prev, ...parsed]);
    setIngredientText('');
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setIngredients([]);
    setIngredientText('');
  };

  const analyzeList = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await analyzeIngredientList(ingredients);
      onAnalyze(result);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze ingredients. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exampleLists = [
    "Sugar, palm oil, cocoa powder, milk powder",
    "Whole wheat flour, water, yeast, salt, olive oil",
    "Organic oats, almonds, honey, cinnamon, vanilla extract"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ingredients" className="text-base font-medium">
          Enter ingredients list
        </Label>
        <p className="text-sm text-muted-foreground">
          Separate ingredients with commas, semicolons, or new lines
        </p>
      </div>

      {/* Text Input */}
      <div className="space-y-3">
        <Textarea
          id="ingredients"
          value={ingredientText}
          onChange={(e) => setIngredientText(e.target.value)}
          placeholder="Enter ingredients like: sugar, palm oil, cocoa powder, milk powder..."
          className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary resize-none transition-all duration-200"
          disabled={isLoading}
        />
        
        <div className="flex gap-2">
          <Button
            onClick={parseIngredients}
            variant="outline"
            size="sm"
            disabled={!ingredientText.trim() || isLoading}
            className="border-border/50 hover:border-primary/50 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Ingredients
          </Button>
          
          {ingredients.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="border-destructive/50 text-destructive hover:border-destructive hover:text-destructive transition-all duration-200"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Ingredients Display */}
      {ingredients.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Ingredients ({ingredients.length})
          </Label>
          <div className="flex flex-wrap gap-2 p-4 bg-secondary/30 rounded-lg border border-border/50">
            {ingredients.map((ingredient, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-background/80 hover:bg-background transition-colors duration-200"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="ml-1 hover:text-destructive transition-colors duration-200"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <Button 
        onClick={analyzeList}
        className="w-full h-12 bg-gradient-primary hover:scale-[1.02] transition-all duration-200 shadow-healthy"
        disabled={isLoading || ingredients.length === 0}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Ingredients
          </>
        )}
      </Button>

      {/* Example Lists */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Try these examples:</Label>
        <div className="space-y-2">
          {exampleLists.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                const parsed = example
                  .split(',')
                  .map(item => item.trim())
                  .filter(item => !ingredients.includes(item));
                setIngredients(prev => [...prev, ...parsed]);
              }}
              className="w-full text-left p-3 text-sm bg-secondary/30 hover:bg-secondary/50 rounded-lg border border-border/30 transition-all duration-200 text-secondary-foreground"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};