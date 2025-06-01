
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles } from "lucide-react";

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
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Unlock Your
          <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Cosmic </span>
          Destiny
        </h2>
        <p className="text-xl text-purple-200 mb-4 max-w-3xl mx-auto">
          Get <span className="text-yellow-400 font-semibold">TWO powerful readings in one</span> - a personalized horoscope based on your zodiac sign 
          <span className="text-pink-400 font-semibold"> AND </span>
          a mystical tarot card reading revealing your path forward.
        </p>
        <p className="text-lg text-purple-300 mb-8 max-w-2xl mx-auto">
          Discover what the stars and cards have aligned for your love life, career, and financial future. 
          Ancient wisdom meets modern insight - all tailored specifically to you.
        </p>
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Get My Double Reading Now
        </Button>
        <p className="text-sm text-purple-400 mt-4">
          ✨ Personal Horoscope + Tarot Reading ✨ Love • Career • Money Insights
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
