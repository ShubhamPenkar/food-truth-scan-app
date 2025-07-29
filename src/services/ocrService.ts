import Tesseract from 'tesseract.js';

export const analyzeImageText = async (imageFile: File): Promise<string> => {
  try {
    console.log('Starting OCR analysis...');
    
    const { data: { text } } = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log('OCR completed. Extracted text:', text);
    
    // Clean up the extracted text
    const cleanedText = text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanedText;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

export const preprocessImage = (imageFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Resize image if too large (improves OCR performance)
      const maxSize = 1200;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw and enhance image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Increase contrast for better OCR
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = Math.min(255, data[i] * 1.2);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * 1.2); // Green
        data[i + 2] = Math.min(255, data[i + 2] * 1.2); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const processedFile = new File([blob], imageFile.name, { type: 'image/png' });
          resolve(processedFile);
        } else {
          reject(new Error('Failed to process image'));
        }
      }, 'image/png');
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
};