
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2, Star, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateReadingPDF } from "@/utils/pdfGenerator";

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

  const handleDownloadPDF = () => {
    if (!reading) {
      toast.error("No reading available to download");
      return;
    }

    try {
      generateReadingPDF({
        type: 'numerology',
        title: 'Your Personal Numerology Reading',
        content: reading,
        userProfile
      });
      toast.success("Your numerology reading PDF is being downloaded!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 text-amber-400" />
            Numerology Reading
          </CardTitle>
          <p className="text-amber-200">
            Discover the hidden meanings and influences of numbers in your life
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-amber-800/20 rounded-lg p-4 space-y-2">
            <h4 className="text-white font-semibold">Your Profile:</h4>
            <p className="text-amber-200"><strong>Name:</strong> {userProfile.fullName}</p>
            <p className="text-amber-200"><strong>Birth Date:</strong> {userProfile.birthDate}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Life Path Number calculation & interpretation</span>
            </div>
            <div className="flex items-center gap-3 text-amber-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Destiny/Expression Number analysis</span>
            </div>
            <div className="flex items-center gap-3 text-amber-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Personal strengths & growth opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-amber-200">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Practical guidance & affirmations</span>
            </div>
          </div>

          <Button
            onClick={generateNumerologyReading}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3"
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
        <>
          <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-400/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-6 w-6 text-amber-400" />
                Your Numerology Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="text-amber-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {reading}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NumerologyReading;
