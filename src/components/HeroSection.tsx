
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles, Clock, Shield, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
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
            LIMITED TIME: Only $1.99 (Reg. $19.99)
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Get Your Personalized
          <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Tarot Reading </span>
          & Horoscope Online
        </h1>
        
        <h2 className="text-xl text-purple-200 mb-4 max-w-3xl mx-auto">
          Unlock your destiny with <span className="text-yellow-400 font-semibold">professional astrology & horoscope insights</span> - personalized tarot cards reading 
          <span className="text-pink-400 font-semibold"> PLUS </span>
          detailed numerology report revealing your cosmic blueprint.
        </h2>
        
        <p className="text-lg text-purple-300 mb-6 max-w-2xl mx-auto">
          Discover what the universe has planned for your love life, career success, and financial future. 
          Ancient wisdom meets AI precision - all tailored specifically to your zodiac forecast.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <Zap className="h-4 w-4" />
            <span>Instant Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <Shield className="h-4 w-4" />
            <span>100% Confidential</span>
          </div>
          <div className="flex items-center gap-2 text-purple-300">
            <Sparkles className="h-4 w-4" />
            <span>99% Accuracy Rate</span>
          </div>
        </div>
        
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Get My Triple Reading Now - $1.99
        </Button>
        
        <p className="text-sm text-purple-400 mt-4">
          ✨ Personal Horoscope + Tarot Reading + Numerology Insights ✨
        </p>
        <p className="text-xs text-purple-500 mt-2">
          Secure PayPal Payment • No Subscription • Instant Access
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
