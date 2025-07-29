import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Image as ImageIcon, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeImageText } from '@/services/ocrService';
import { analyzeFoodItem } from '@/services/foodAnalysis';
import type { FoodData } from './FoodAnalyzer';

interface PhotoInputProps {
  onAnalyze: (data: FoodData) => void;
  isLoading: boolean;
}

export const PhotoInput = ({ onAnalyze, isLoading }: PhotoInputProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      toast({
        title: "Processing image",
        description: "Extracting text from image...",
      });

      const extractedText = await analyzeImageText(selectedImage);
      
      if (!extractedText.trim()) {
        toast({
          title: "No text found",
          description: "Could not extract readable text from the image",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Text extracted",
        description: "Analyzing nutritional information...",
      });

      const result = await analyzeFoodItem(extractedText);
      onAnalyze(result);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Upload or capture food label
        </Label>
        <p className="text-sm text-muted-foreground">
          Take a photo of ingredients list or nutrition label
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-200 bg-background/30"
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Selected food image" 
                className="max-w-full max-h-48 rounded-lg shadow-card"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs hover:scale-110 transition-transform duration-200"
                disabled={isLoading || isProcessing}
              >
                ×
              </button>
            </div>
            <Button 
              onClick={analyzeImage}
              className="bg-gradient-primary hover:scale-[1.02] transition-all duration-200 shadow-healthy"
              disabled={isLoading || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Drop an image here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WebP up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading || isProcessing}
        />
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isProcessing}
          className="h-12 border-border/50 hover:border-primary/50 transition-all duration-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // In a real app, this would open camera
            toast({
              title: "Camera feature",
              description: "Camera access would be implemented here",
            });
          }}
          disabled={isLoading || isProcessing}
          className="h-12 border-border/50 hover:border-primary/50 transition-all duration-200"
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-secondary-foreground">📸 Photo Tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Ensure text is clear and well-lit</li>
          <li>• Avoid glare and shadows</li>
          <li>• Focus on ingredients or nutrition labels</li>
          <li>• Keep the image straight and unblurred</li>
        </ul>
      </div>
    </div>
  );
};