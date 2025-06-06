import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  nl: {
    // Header
    signIn: "Inloggen",
    signOut: "Uitloggen",
    welcome: "Welkom",
    
    // Hero Section
    heroTitle: "Krijg Je Gepersonaliseerde",
    heroTitleHighlight: " Tarotlezing ",
    heroTitleEnd: "& Horoscoop Online",
    heroSubtitle: "Ontsluit je lot met professionele astrologie & horoscoop inzichten - gepersonaliseerde tarotkaarten lezing",
    heroSubtitlePlus: " PLUS ",
    heroSubtitleEnd: "gedetailleerd numerologie rapport dat je kosmische blauwdruk onthult.",
    heroDescription: "Ontdek wat het universum heeft gepland voor je liefdesleven, carrièresucces en financiële toekomst. Eeuwenoude wijsheid gecombineerd met moderne inzichten - allemaal speciaal afgestemd op je horoscoopvoorspelling.",
    limitedTime: "BEPERKTE TIJD: Slechts €1,99 (Normaal €19,99)",
    instantDelivery: "Directe Levering",
    confidential: "100% Vertrouwelijk",
    accuracyRate: "99% Nauwkeurigheidspercentage",
    getReadingNow: "Krijg Mijn Drievoudige Lezing Nu - €1,99",
    tripleReading: "✨ Persoonlijke Horoscoop + Tarotlezing + Numerologie Inzichten ✨",
    securePayment: "Veilige PayPal Betaling • Geen Abonnement • Directe Toegang",
    
    // Features Section
    featuresTitle: "Waarom Kiezen Voor Onze Kosmische Lezingen?",
    featuresSubtitle: "Ervaar de kracht van persoonlijke spirituele begeleiding",
    personalizedTitle: "Volledig Gepersonaliseerd",
    personalizedDesc: "Elke lezing is uniek afgestemd op jouw geboortedatum, tijd en locatie voor maximale nauwkeurigheid.",
    instantTitle: "Directe Resultaten",
    instantDesc: "Ontvang je complete lezing binnen seconden na betaling - geen wachten vereist.",
    comprehensiveTitle: "Uitgebreide Inzichten",
    comprehensiveDesc: "Krijg tarot-, horoscoop- en numerologielezingen in één krachtig pakket.",
    
    // Testimonials
    testimonialsTitle: "Wat Onze Klanten Zeggen",
    testimonial1: "Ongelooflijk nauwkeurig! De tarotlezing voorspelde veranderingen in mijn carrière die exact uitkwamen.",
    testimonial1Author: "Maria, Amsterdam",
    testimonial2: "De numerologie sectie was zo inzichtelijk. Het hielp me mijn levensdoel te begrijpen.",
    testimonial2Author: "Pieter, Rotterdam",
    testimonial3: "Geweldige waarde voor geld. Drie lezingen voor de prijs van één!",
    testimonial3Author: "Sophie, Utrecht",
    
    // FAQ
    faqTitle: "Veelgestelde Vragen",
    faqQuestion1: "Hoe snel ontvang ik mijn lezing?",
    faqAnswer1: "Je ontvangt je complete lezing direct na succesvolle betaling. Het duurt slechts een paar seconden!",
    faqQuestion2: "Zijn de lezingen echt gepersonaliseerd?",
    faqAnswer2: "Ja! Elke lezing wordt speciaal gegenereerd op basis van je unieke geboorteinformatie en persoonlijke details.",
    faqQuestion3: "Kan ik mijn lezing later opnieuw bekijken?",
    faqAnswer3: "Absoluut! Je hebt levenslange toegang tot je lezing via je account.",
    
    // Footer
    termsTitle: "Algemene Voorwaarden",
    termsText: "MyTarotAndHoroscope.com biedt digitale producten (persoonlijke lezingen). Na aankoop wordt je lezing direct geleverd. Alle verkopen zijn definitief; er zijn geen retouren of terugbetalingen voor digitale producten.",
    companyAddress: "Bedrijfsadres:",
    complaints: "Klachten?",
    contactUs: "Neem contact met ons op via",
    
    // Sticky CTA
    getTripleReading: "Krijg Mijn Drievoudige Lezing Nu",
    
    // Language Selector
    language: "Taal",
    dutch: "Nederlands",
    english: "Engels"
  },
  en: {
    // Header
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "Welcome",
    
    // Hero Section
    heroTitle: "Get Your Personalized",
    heroTitleHighlight: " Tarot Reading ",
    heroTitleEnd: "& Horoscope Online",
    heroSubtitle: "Unlock your destiny with professional astrology & horoscope insights - personalized tarot cards reading",
    heroSubtitlePlus: " PLUS ",
    heroSubtitleEnd: "detailed numerology report revealing your cosmic blueprint.",
    heroDescription: "Discover what the universe has planned for your love life, career success, and financial future. Ancient wisdom combined with modern insights - all tailored specifically to your zodiac forecast.",
    limitedTime: "LIMITED TIME: Only $1.99 (Reg. $19.99)",
    instantDelivery: "Instant Delivery",
    confidential: "100% Confidential",
    accuracyRate: "99% Accuracy Rate",
    getReadingNow: "Get My Triple Reading Now - $1.99",
    tripleReading: "✨ Personal Horoscope + Tarot Reading + Numerology Insights ✨",
    securePayment: "Secure PayPal Payment • No Subscription • Instant Access",
    
    // Features Section
    featuresTitle: "Why Choose Our Cosmic Readings?",
    featuresSubtitle: "Experience the power of personalized spiritual guidance",
    personalizedTitle: "Fully Personalized",
    personalizedDesc: "Each reading is uniquely tailored to your birth date, time, and location for maximum accuracy.",
    instantTitle: "Instant Results",
    instantDesc: "Receive your complete reading within seconds of payment - no waiting required.",
    comprehensiveTitle: "Comprehensive Insights",
    comprehensiveDesc: "Get tarot, horoscope, and numerology readings all in one powerful package.",
    
    // Testimonials
    testimonialsTitle: "What Our Customers Say",
    testimonial1: "Incredibly accurate! The tarot reading predicted career changes that came true exactly.",
    testimonial1Author: "Sarah, New York",
    testimonial2: "The numerology section was so insightful. It helped me understand my life purpose.",
    testimonial2Author: "Mike, London",
    testimonial3: "Amazing value for money. Three readings for the price of one!",
    testimonial3Author: "Emma, Sydney",
    
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQuestion1: "How quickly will I receive my reading?",
    faqAnswer1: "You'll receive your complete reading instantly after successful payment. It takes just a few seconds!",
    faqQuestion2: "Are the readings truly personalized?",
    faqAnswer2: "Yes! Each reading is specially generated based on your unique birth information and personal details.",
    faqQuestion3: "Can I access my reading again later?",
    faqAnswer3: "Absolutely! You have lifetime access to your reading through your account.",
    
    // Footer
    termsTitle: "Terms & Conditions",
    termsText: "MyTarotAndHoroscope.com offers digital products (personal readings). After purchase, your reading will be delivered directly immediately. All sales are final; there are no returns or refunds for digital products.",
    companyAddress: "Company address:",
    complaints: "Complaints?",
    contactUs: "Contact us at",
    
    // Sticky CTA
    getTripleReading: "Get My Triple Reading Now",
    
    // Language Selector
    language: "Language",
    dutch: "Dutch",
    english: "English"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('nl'); // Default to Dutch

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
