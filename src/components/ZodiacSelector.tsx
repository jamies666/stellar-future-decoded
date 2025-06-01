
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ZodiacSelectorProps {
  selectedZodiac: string;
  onZodiacSelect: (zodiac: string) => void;
}

const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water" },
];

const getElementColor = (element: string) => {
  switch (element) {
    case "Fire": return "text-red-400 bg-red-900/20 border-red-400/30";
    case "Earth": return "text-green-400 bg-green-900/20 border-green-400/30";
    case "Air": return "text-blue-400 bg-blue-900/20 border-blue-400/30";
    case "Water": return "text-cyan-400 bg-cyan-900/20 border-cyan-400/30";
    default: return "text-purple-400 bg-purple-900/20 border-purple-400/30";
  }
};

const ZodiacSelector = ({ selectedZodiac, onZodiacSelect }: ZodiacSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Zodiac Sign</h2>
        <p className="text-purple-200">Select your sign to unlock personalized cosmic insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zodiacSigns.map((sign) => (
          <Button
            key={sign.name}
            onClick={() => onZodiacSelect(sign.name)}
            variant="ghost"
            className={`h-auto p-0 ${
              selectedZodiac === sign.name ? "ring-2 ring-yellow-400" : ""
            }`}
          >
            <Card className={`w-full cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedZodiac === sign.name 
                ? "bg-yellow-900/30 border-yellow-400/50" 
                : getElementColor(sign.element)
            }`}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{sign.symbol}</div>
                <h3 className="font-semibold text-white text-sm">{sign.name}</h3>
                <p className="text-xs opacity-75 mt-1">{sign.dates}</p>
                <div className="text-xs mt-2 px-2 py-1 rounded-full bg-black/20">
                  {sign.element}
                </div>
              </CardContent>
            </Card>
          </Button>
        ))}
      </div>

      {selectedZodiac && (
        <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              {selectedZodiac} Selected
            </h3>
            <p className="text-purple-200">
              Ready to discover what the cosmos has in store for you? 
              Complete your payment to unlock your detailed horoscope reading.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZodiacSelector;
