
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-950/30 to-indigo-950/30">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          What Our Customers Say About Their Readings
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-purple-900/40 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-purple-300 mb-2" />
              <p className="text-purple-100 text-sm mb-3">
                "The most accurate reading I've ever had! The tarot insights were spot-on about my career change."
              </p>
              <p className="text-purple-300 text-xs font-semibold">— Rachel K., California</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-900/40 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-purple-300 mb-2" />
              <p className="text-purple-100 text-sm mb-3">
                "My numerology report revealed so much about my personality. Absolutely worth every penny!"
              </p>
              <p className="text-purple-300 text-xs font-semibold">— Michael T., Toronto</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-900/40 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <Quote className="h-6 w-6 text-purple-300 mb-2" />
              <p className="text-purple-100 text-sm mb-3">
                "Fast delivery and completely confidential. The horoscope predictions came true within a month!"
              </p>
              <p className="text-purple-300 text-xs font-semibold">— Sarah L., Vancouver</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
