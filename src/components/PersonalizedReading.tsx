
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stars, Download, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PersonalizedReadingProps {
  userProfile: {
    fullName: string;
    birthDate: string;
    birthPlace: string;
  };
}

const PersonalizedReading = ({ userProfile }: PersonalizedReadingProps) => {
  const [reading, setReading] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateReading = async () => {
      setIsGenerating(true);
      console.log(`Generating personalized reading for ${userProfile.fullName}`);

      try {
        const { data, error } = await supabase.functions.invoke('generate-horoscope', {
          body: { 
            userProfile,
            isPersonalized: true
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to generate your reading. Please try again.');
          return;
        }

        console.log('Received reading data:', data);
        setReading(data.reading);
      } catch (error) {
        console.error('Error generating reading:', error);
        toast.error('Failed to generate your reading. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateReading();
  }, [userProfile]);

  const handleEmailReading = () => {
    toast.success("Your personalized reading has been sent to your email!");
  };

  const handleDownloadPDF = () => {
    toast.success("Downloading your personalized reading PDF...");
  };

  if (isGenerating) {
    return (
      <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Channeling Your Energy...
          </h3>
          <p className="text-purple-200">
            Creating your personalized tarot reading for {userProfile.fullName}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Your Personal Tarot Reading
          </CardTitle>
          <p className="text-purple-200">For {userProfile.fullName}</p>
          <p className="text-purple-300 text-sm">
            Born on {userProfile.birthDate} in {userProfile.birthPlace}
          </p>
        </CardHeader>
      </Card>

      <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-purple-100 leading-relaxed whitespace-pre-wrap">
              {reading || 'Loading your cosmic insights...'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={handleEmailReading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Reading
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex-1 border-purple-400 text-white hover:bg-purple-900/50"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedReading;
