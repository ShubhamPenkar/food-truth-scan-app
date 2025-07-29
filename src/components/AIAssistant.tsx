import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FoodData } from '@/components/FoodAnalyzer';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  foodData: FoodData;
  className?: string;
}

export const AIAssistant = ({ foodData, className }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi! I'm your food safety assistant. I've analyzed "${foodData.name}" and I'm ready to answer any questions about its ingredients, health impacts, or alternatives. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Is this safe for children?",
    "What are healthier alternatives?",
    "Are there any allergens I should worry about?",
    "How does this affect my diet plan?",
    "What's the worst ingredient in this?"
  ];

  const generateAIResponse = async (question: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock AI responses based on food data and question patterns
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('safe') && lowerQuestion.includes('child')) {
      if (foodData.healthScore && foodData.healthScore < 50) {
        return `⚠️ I'd be cautious giving "${foodData.name}" to children. With a health score of ${foodData.healthScore}/100, it contains ingredients that may not be ideal for developing bodies. ${foodData.additives?.length ? `It has ${foodData.additives.length} additives` : ''} ${foodData.allergens?.length ? `and ${foodData.allergens.length} potential allergens` : ''}. Consider healthier alternatives.`;
      } else {
        return `✅ "${foodData.name}" appears relatively safe for children with a health score of ${foodData.healthScore}/100. However, moderation is always key, especially with processed foods.`;
      }
    }
    
    if (lowerQuestion.includes('alternative') || lowerQuestion.includes('healthier')) {
      return `🥗 For healthier alternatives to "${foodData.name}", consider:\n\n• Whole food options with fewer processed ingredients\n• Products with organic certifications\n• Items with shorter ingredient lists\n• Fresh, unprocessed alternatives\n\nWould you like specific product recommendations?`;
    }
    
    if (lowerQuestion.includes('allergen')) {
      if (foodData.allergens && foodData.allergens.length > 0) {
        return `⚠️ Yes, "${foodData.name}" contains these potential allergens:\n\n${foodData.allergens.map(allergen => `• ${allergen}`).join('\n')}\n\nAlways check labels carefully if you have known allergies.`;
      } else {
        return `✅ Good news! I didn't detect any major allergens in "${foodData.name}". However, always check the full label for "may contain" warnings if you have severe allergies.`;
      }
    }
    
    if (lowerQuestion.includes('worst') || lowerQuestion.includes('bad')) {
      if (foodData.additives && foodData.additives.length > 0) {
        return `🚨 The most concerning ingredient in "${foodData.name}" is likely "${foodData.additives[0]}". This additive is known for potential health concerns. I'd recommend looking for products without this ingredient.`;
      } else {
        return `👍 Actually, "${foodData.name}" doesn't seem to have any particularly harmful ingredients based on my analysis. The main concerns would be around nutritional balance rather than toxic ingredients.`;
      }
    }
    
    if (lowerQuestion.includes('diet')) {
      let dietInfo = `Based on "${foodData.name}", here's how it fits different diets:\n\n`;
      if (foodData.dietaryInfo) {
        dietInfo += `• Vegan: ${foodData.dietaryInfo.vegan ? '✅ Yes' : '❌ No'}\n`;
        dietInfo += `• Vegetarian: ${foodData.dietaryInfo.vegetarian ? '✅ Yes' : '❌ No'}\n`;
        dietInfo += `• Gluten-Free: ${foodData.dietaryInfo.glutenFree ? '✅ Yes' : '❌ No'}\n`;
        dietInfo += `• Keto: ${foodData.dietaryInfo.keto ? '✅ Yes' : '❌ No'}\n`;
      }
      return dietInfo;
    }
    
    // Generic response
    return `Based on my analysis of "${foodData.name}" (Health Score: ${foodData.healthScore}/100), this product ${foodData.healthScore && foodData.healthScore > 70 ? 'seems relatively healthy' : 'has some health concerns'}. ${foodData.ingredients ? `It contains ${foodData.ingredients.length} ingredients` : ''} ${foodData.additives?.length ? `including ${foodData.additives.length} additives` : ''}. Would you like me to elaborate on any specific aspect?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await generateAIResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card className={`flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-gradient-primary/5">
        <Bot className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Food Assistant</h3>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs h-7"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about ingredients, health effects, alternatives..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};