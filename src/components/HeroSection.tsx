
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles, Clock, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="text-center py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Moon className="h-16 w-16 text-yellow-400 animate-pulse" />
            <Sun className="h-8 w-8 text-orange-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>
        
        <div className="mb-4 flex justify-center">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
            <Clock className="h-4 w-4" />
            {t('limitedTime')}
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {t('heroTitle')}
          <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{t('heroTitleHighlight')}</span>
          {t('heroTitleEnd')}
        </h1>
        
        <h2 className="text-xl text-purple-200 mb-4 max-w-3xl mx-auto">
          {t('heroSubtitle')}{" "}
          <span className="text-pink-400 font-semibold">{t('heroSubtitlePlus')}</span>
          {t('heroSubtitleEnd')}
        </h2>
        
        <p className="text-lg text-purple-300 mb-6 max-w-2xl mx-auto">
          {t('heroDescription')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <Zap className="h-4 w-4" />
            <span>{t('instantDelivery')}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Shield className="h-4 w-4" />
            <span>{t('confidential')}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Sparkles className="h-4 w-4" />
            <span>{t('accuracyRate')}</span>
          </div>
        </div>
        
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {t('getReadingNow')}
        </Button>
        
        <p className="text-sm text-purple-400 mt-4">
          {t('tripleReading')}
        </p>
        <p className="text-xs text-purple-500 mt-2">
          {t('securePayment')}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
