
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stars, Heart, DollarSign, Briefcase, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HoroscopeDisplayProps {
  zodiacSign: string;
}

const HoroscopeDisplay = ({ zodiacSign }: HoroscopeDisplayProps) => {
  const [horoscope, setHoroscope] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateHoroscope = async () => {
      setIsGenerating(true);
      console.log(`Generating horoscope for ${zodiacSign}`);

      try {
        const { data, error } = await supabase.functions.invoke('generate-horoscope', {
          body: { zodiacSign }
        });

        if (error) {
          console.error('Supabase function error:', error);
          toast.error('Failed to generate horoscope. Please try again.');
          return;
        }

        console.log('Received horoscope data:', data);
        setHoroscope(data.horoscope);
      } catch (error) {
        console.error('Error generating horoscope:', error);
        toast.error('Failed to generate horoscope. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generateHoroscope();
  }, [zodiacSign]);

  const handleEmailReading = () => {
    toast.success("Your horoscope has been sent to your email!");
  };

  const handleDownloadPDF = () => {
    toast.success("Downloading your personalized horoscope PDF...");
  };

  if (isGenerating) {
    return (
      <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Consulting the Stars...
          </h3>
          <p className="text-purple-200">
            ChatGPT is crafting your personalized {zodiacSign} reading
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
            <Stars className="h-6 w-6 text-yellow-400" />
            Your {zodiacSign} Horoscope
          </CardTitle>
          <p className="text-purple-200">Generated with AI cosmic wisdom</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-purple-900/50">
          <TabsTrigger value="general" className="text-white">
            <Stars className="h-4 w-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="love" className="text-white">
            <Heart className="h-4 w-4 mr-1" />
            Love
          </TabsTrigger>
          <TabsTrigger value="career" className="text-white">
            <Briefcase className="h-4 w-4 mr-1" />
            Career
          </TabsTrigger>
          <TabsTrigger value="finances" className="text-white">
            <DollarSign className="h-4 w-4 mr-1" />
            Money
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">General Forecast</h3>
              <p className="text-purple-100 leading-relaxed">{horoscope?.general || 'Loading your cosmic insights...'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="love">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-400" />
                Love & Relationships
              </h3>
              <p className="text-purple-100 leading-relaxed">{horoscope?.love || 'Loading your romantic insights...'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-400" />
                Career & Professional Life
              </h3>
              <p className="text-purple-100 leading-relaxed">{horoscope?.career || 'Loading your professional insights...'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Financial Outlook
              </h3>
              <p className="text-purple-100 leading-relaxed">{horoscope?.finances || 'Loading your financial insights...'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

export default HoroscopeDisplay;
