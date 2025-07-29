import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onClose: () => void;
  isScanning: boolean;
}

export const BarcodeScanner = ({ onBarcodeDetected, onClose, isScanning }: BarcodeScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    
    setIsProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            toast.success('Barcode detected!');
            onBarcodeDetected(code.data);
          } else {
            toast.error('No barcode detected. Try adjusting the angle or lighting.');
          }
        }
        setIsProcessing(false);
      };
      img.src = imageSrc;
    } else {
      setIsProcessing(false);
    }
  }, [onBarcodeDetected]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-primary text-primary-foreground">
        <h2 className="text-lg font-semibold">Scan Barcode</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }}
          className="w-full h-full object-cover"
        />
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanning Frame */}
            <div className="w-64 h-40 border-2 border-primary bg-transparent relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
              
              {/* Scanning Line Animation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce"></div>
              </div>
            </div>
            
            <p className="text-white text-center mt-4 bg-black/50 px-4 py-2 rounded-lg">
              Position barcode within the frame
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/80 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={switchCamera}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={capture}
          disabled={isProcessing || isScanning}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Scan Barcode
            </div>
          )}
        </Button>
      </div>

      {/* Instructions Card */}
      <Card className="m-4 p-4 bg-black/80 border-white/20 text-white">
        <h3 className="font-semibold mb-2">Scanning Tips:</h3>
        <ul className="text-sm space-y-1 text-white/80">
          <li>• Ensure good lighting</li>
          <li>• Hold device steady</li>
          <li>• Keep barcode flat and clear</li>
          <li>• Try different angles if needed</li>
        </ul>
      </Card>
    </div>
  );
};