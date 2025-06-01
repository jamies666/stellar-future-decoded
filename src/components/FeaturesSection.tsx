
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sparkles } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose Cosmic Insights?
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Moon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Personal Insights</h4>
              <p className="text-purple-200">Comprehensive tarot readings tailored to your unique birth details</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Secure & Private</h4>
              <p className="text-purple-200">Your cosmic journey is protected with enterprise-grade security</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
