
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
        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Get personalized tarot readings powered by AI and ancient wisdom. 
          Discover what the universe has in store for you.
        </p>
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Your Journey
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
