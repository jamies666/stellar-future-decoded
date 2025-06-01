
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NumerologyReadingProps {
  userProfile: {
    fullName: string;
    birthDate: string;
    birthPlace: string;
  };
}

const NumerologyReading = ({ userProfile }: NumerologyReadingProps) => {
  const [reading, setReading] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateNumerologyReading = async () => {
    console.log("Generating numerology reading for:", userProfile);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-horoscope', {
        body: {
          userProfile,
          isNumerology: true
        }
      });

      console.log("Numerology API response:", { data, error });

      if (error) {
        console.error("Error from generate-horoscope function:", error);
        throw new Error(error.message || "Failed to generate numerology reading");
      }

      if (!data || !data.reading) {
        console.error("No reading data received:", data);
        throw new Error("No reading data received from the service");
      }

      setReading(data.reading);
      toast.success("Your numerology reading is ready!");
    } catch (error) {
      console.error("Error generating numerology reading:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate reading";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border-green-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 text-green-400" />
            Numerology Reading
          </CardTitle>
          <p className="text-green-200">
            Discover the hidden meanings and influences of numbers in your life
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-800/20 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-semibold">Your Profile:</h4>
            <p className="text-green-200"><strong>Name:</strong> {userProfile.fullName}</p>
            <p className="text-green-200"><strong>Birth Date:</strong> {userProfile.birthDate}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Life Path Number calculation & interpretation</span>
            </div>
            <div className="flex items-center gap-3 text-green-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Destiny/Expression Number analysis</span>
            </div>
            <div className="flex items-center gap-3 text-green-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Personal strengths & growth opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-green-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Practical guidance & affirmations</span>
            </div>
          </div>

          <Button
            onClick={generateNumerologyReading}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating Your Numbers...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Generate My Numerology Reading
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {reading && (
        <Card className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border-green-400/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-6 w-6 text-green-400" />
              Your Numerology Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="text-green-100 leading-relaxed whitespace-pre-wrap text-sm">
                {reading}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NumerologyReading;
