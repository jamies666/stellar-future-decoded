
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sparkles, Shield, Zap, Heart, DollarSign } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-white text-center mb-4">
          Why Choose Cosmic Insights for Your Online Tarot Reading?
        </h3>
        <p className="text-xl text-purple-200 text-center mb-12 max-w-3xl mx-auto">
          Get the most comprehensive astrology & horoscope insights with our triple-reading package
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Moon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Personalized Horoscope Insights</h4>
              <p className="text-purple-200">Detailed astrology reading based on your exact birth details, zodiac sign, and current planetary alignments for maximum accuracy.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Professional Tarot Card Reading</h4>
              <p className="text-purple-200">3-card tarot spread focused on your most pressing questions about love, career, and financial success.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Complete Numerology Report</h4>
              <p className="text-purple-200">Discover your life path number, destiny number, and hidden personality traits that influence your future.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Zap className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
            <h5 className="text-white font-semibold mb-2">Instant Delivery</h5>
            <p className="text-purple-300 text-sm">Get your reading in seconds, not days</p>
          </div>
          
          <div className="text-center">
            <Heart className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h5 className="text-white font-semibold mb-2">Love & Relationships</h5>
            <p className="text-purple-300 text-sm">Discover your romantic destiny and compatibility</p>
          </div>
          
          <div className="text-center">
            <DollarSign className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <h5 className="text-white font-semibold mb-2">Money & Career</h5>
            <p className="text-purple-300 text-sm">Unlock financial opportunities and career guidance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
