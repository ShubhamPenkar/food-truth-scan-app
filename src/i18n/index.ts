import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App Name
      appName: 'Food Truth Scan',
      tagline: 'Scan. Analyze. Make Better Choices.',
      
      // Navigation
      scanner: 'Scanner',
      analysis: 'Analysis',
      profile: 'Profile',
      
      // Scanner
      scanBarcode: 'Scan Barcode',
      scanProduct: 'Scan Product',
      enterText: 'Enter Food Name',
      uploadPhoto: 'Upload Photo',
      ingredientList: 'Ingredient List',
      
      // Analysis
      healthScore: 'Health Score',
      riskLevel: 'Risk Level',
      ingredients: 'Ingredients',
      nutrition: 'Nutrition',
      allergens: 'Allergens',
      additives: 'Additives',
      dietaryInfo: 'Dietary Info',
      
      // Risk Levels
      lowRisk: 'Low Risk',
      mediumRisk: 'Medium Risk',
      highRisk: 'High Risk',
      criticalRisk: 'Critical Risk',
      
      // Health Status
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
      unhealthy: 'Unhealthy',
      
      // Warnings
      bannedInEU: 'Banned in EU',
      allergenWarning: 'Allergen Warning',
      highSodium: 'High Sodium',
      artificialColors: 'Artificial Colors',
      preservatives: 'Preservatives',
      
      // AI Assistant
      aiAssistant: 'AI Assistant',
      askQuestion: 'Ask about ingredients, health effects...',
      suggestedQuestions: {
        safe: 'Is this safe for children?',
        alternatives: 'What are healthier alternatives?',
        allergens: 'Are there any allergens?',
        diet: 'How does this fit my diet?',
        worst: "What's the worst ingredient?"
      },
      
      // Gamification
      level: 'Level',
      points: 'Points',
      streak: 'Streak',
      badges: 'Badges',
      achievements: 'Achievements',
      
      // Actions
      scan: 'Scan',
      analyze: 'Analyze',
      back: 'Back',
      close: 'Close',
      save: 'Save',
      share: 'Share'
    }
  },
  hi: {
    translation: {
      // App Name
      appName: 'फूड ट्रुथ स्कैन',
      tagline: 'स्कैन करें। विश्लेषण करें। बेहतर विकल्प चुनें।',
      
      // Navigation
      scanner: 'स्कैनर',
      analysis: 'विश्लेषण',
      profile: 'प्रोफाइल',
      
      // Scanner
      scanBarcode: 'बारकोड स्कैन करें',
      scanProduct: 'उत्पाद स्कैन करें',
      enterText: 'खाद्य पदार्थ का नाम दर्ज करें',
      uploadPhoto: 'फोटो अपलोड करें',
      ingredientList: 'सामग्री सूची',
      
      // Analysis
      healthScore: 'स्वास्थ्य स्कोर',
      riskLevel: 'जोखिम स्तर',
      ingredients: 'सामग्री',
      nutrition: 'पोषण',
      allergens: 'एलर्जेन',
      additives: 'योजक',
      dietaryInfo: 'आहार जानकारी',
      
      // Risk Levels
      lowRisk: 'कम जोखिम',
      mediumRisk: 'मध्यम जोखिम',
      highRisk: 'उच्च जोखिम',
      criticalRisk: 'गंभीर जोखिम',
      
      // Health Status
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      moderate: 'मध्यम',
      poor: 'खराब',
      unhealthy: 'अस्वस्थ',
      
      // Warnings
      bannedInEU: 'यूरोपीय संघ में प्रतिबंधित',
      allergenWarning: 'एलर्जेन चेतावनी',
      highSodium: 'उच्च सोडियम',
      artificialColors: 'कृत्रिम रंग',
      preservatives: 'परिरक्षक',
      
      // AI Assistant
      aiAssistant: 'एआई सहायक',
      askQuestion: 'सामग्री, स्वास्थ्य प्रभाव के बारे में पूछें...',
      suggestedQuestions: {
        safe: 'क्या यह बच्चों के लिए सुरक्षित है?',
        alternatives: 'स्वस्थ विकल्प क्या हैं?',
        allergens: 'क्या कोई एलर्जेन हैं?',
        diet: 'यह मेरे आहार में कैसे फिट होता है?',
        worst: 'सबसे खराब सामग्री क्या है?'
      },
      
      // Gamification
      level: 'स्तर',
      points: 'अंक',
      streak: 'लगातार',
      badges: 'बैज',
      achievements: 'उपलब्धियां',
      
      // Actions
      scan: 'स्कैन',
      analyze: 'विश्लेषण',
      back: 'वापस',
      close: 'बंद',
      save: 'सेव',
      share: 'साझा'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;