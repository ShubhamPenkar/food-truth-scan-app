import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeFoodItem } from '@/services/foodAnalysis';
import type { FoodData } from './FoodAnalyzer';

interface TextInputProps {
  onAnalyze: (data: FoodData) => void;
  isLoading: boolean;
}

export const TextInput = ({ onAnalyze, isLoading }: TextInputProps) => {
  const [foodItem, setFoodItem] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodItem.trim()) {
      toast({
        title: "Enter a food item",
        description: "Please enter a food or product name to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await analyzeFoodItem(foodItem);
      onAnalyze(result);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to analyze this food item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const suggestions = [
    "Coca-Cola", "Organic oats", "Whole wheat bread", 
    "Greek yogurt", "Dark chocolate", "Quinoa"
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="food-item" className="text-base font-medium">
          Enter food or product name
        </Label>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="food-item"
              type="text"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="e.g., Coca-Cola, Organic oats, Greek yogurt..."
              className="pl-10 text-base h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-primary hover:scale-[1.02] transition-all duration-200 shadow-healthy"
            disabled={isLoading || !foodItem.trim()}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Food
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Quick suggestions */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Try these examples:</Label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setFoodItem(suggestion)}
              className="px-3 py-1.5 text-sm bg-secondary hover:bg-accent rounded-lg transition-colors duration-200 text-secondary-foreground"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};