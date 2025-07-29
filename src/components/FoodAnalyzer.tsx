import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/TextInput';
import { PhotoInput } from '@/components/PhotoInput';
import { ListInput } from '@/components/ListInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { GamificationSystem } from '@/components/GamificationSystem';
import { Utensils, Camera, List, QrCode, Trophy, Globe } from 'lucide-react';
import { analyzeFoodItem } from '@/services/foodAnalysis';
import { useTranslation } from 'react-i18next';

export interface FoodData {
  name: string;
  ingredients?: string[];
  nutrition?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  additives?: string[];
  allergens?: string[];
  dietaryInfo?: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    keto?: boolean;
  };
  healthScore?: number;
}

export const FoodAnalyzer = () => {
  const { t, i18n } = useTranslation();
  const [analysisResult, setAnalysisResult] = useState<FoodData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  const handleAnalysis = async (data: FoodData) => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisResult(data);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    setShowScanner(false);
    setIsAnalyzing(true);
    
    try {
      // Try to analyze the barcode as a product
      const result = await analyzeFoodItem(barcode);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing barcode:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  if (showScanner) {
    return (
      <BarcodeScanner
        onBarcodeDetected={handleBarcodeDetected}
        onClose={() => setShowScanner(false)}
        isScanning={isAnalyzing}
      />
    );
  }

  if (analysisResult) {
    return (
      <AnalysisResults 
        data={analysisResult} 
        onBack={resetAnalysis}
        isLoading={isAnalyzing}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header with Language Toggle */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-card">
                <Utensils className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('appName')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('tagline')}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLanguage}
                className="shrink-0"
              >
                <Globe className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowGamification(!showGamification)}
                className="shrink-0"
              >
                <Trophy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Gamification Panel */}
          {showGamification && (
            <div className="mb-6">
              <GamificationSystem />
            </div>
          )}

          {/* Input Methods */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              onClick={() => setShowScanner(true)}
              className="h-20 flex-col gap-2 bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground"
            >
              <QrCode className="w-6 h-6" />
              <span className="text-sm font-medium">{t('scanBarcode')}</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-primary/20 hover:bg-primary/5"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-medium">{t('uploadPhoto')}</span>
            </Button>
          </div>

          {/* Input Tabs */}
          <Card className="p-6 shadow-card border-border/50 backdrop-blur-sm">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('enterText')}</span>
                </TabsTrigger>
                <TabsTrigger value="photo" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('uploadPhoto')}</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('ingredientList')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <TextInput onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
              </TabsContent>

              <TabsContent value="photo">
                <PhotoInput onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
              </TabsContent>

              <TabsContent value="list">
                <ListInput onAnalyze={handleAnalysis} isLoading={isAnalyzing} />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-health-excellent/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-health-excellent rounded-full"></div>
              </div>
              <h3 className="font-medium text-foreground mb-1">{t('healthScore')}</h3>
              <p className="text-sm text-muted-foreground">Instant rating from 0-100</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-health-moderate/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-health-moderate rounded-full"></div>
              </div>
              <h3 className="font-medium text-foreground mb-1">{t('allergens')}</h3>
              <p className="text-sm text-muted-foreground">Detect common allergens</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-health-good/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-health-good rounded-full"></div>
              </div>
              <h3 className="font-medium text-foreground mb-1">{t('nutrition')}</h3>
              <p className="text-sm text-muted-foreground">Detailed breakdown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};