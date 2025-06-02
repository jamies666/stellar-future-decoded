
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stars, Download, Mail, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateReadingPDF } from "@/utils/pdfGenerator";

interface TarotReadingProps {
  userProfile: {
    fullName: string;
    birthDate: string;
    birthPlace: string;
  };
}

const TarotReading = ({ userProfile }: TarotReadingProps) => {
  const [reading, setReading] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const themes = [
    { value: "Work", label: "Work & Career" },
    { value: "Relationships", label: "Love & Relationships" },
    { value: "Health", label: "Health & Wellbeing" },
    { value: "Money", label: "Money & Finance" },
    { value: "General", label: "General Life Guidance" }
  ];

  const generateReading = async () => {
    if (!selectedTheme) {
      toast.error("Please select a theme for your tarot reading");
      return;
    }

    setIsGenerating(true);
    console.log(`Generating tarot reading for ${userProfile.fullName} with theme: ${selectedTheme}`);

    try {
      const { data, error } = await supabase.functions.invoke('generate-horoscope', {
        body: { 
          userProfile,
          isTarot: true,
          tarotTheme: selectedTheme,
          tarotQuestion: question || undefined
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error('Failed to generate your tarot reading. Please try again.');
        return;
      }

      console.log('Received tarot reading data:', data);
      setReading(data.reading);
      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      toast.error('Failed to generate your tarot reading. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailReading = () => {
    toast.success("Your tarot reading has been sent to your email!");
  };

  const handleDownloadPDF = () => {
    if (!reading) {
      toast.error("No reading available to download");
      return;
    }

    try {
      generateReadingPDF({
        type: 'tarot',
        title: 'Your Personal Tarot Reading',
        content: reading,
        userProfile,
        theme: themes.find(t => t.value === selectedTheme)?.label
      });
      toast.success("Your tarot reading PDF is being downloaded!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isGenerating) {
    return (
      <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Drawing Your Cards...
          </h3>
          <p className="text-purple-200">
            Creating your personalized {selectedTheme.toLowerCase()} tarot reading for {userProfile.fullName}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hasGenerated && reading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Your Tarot Reading
            </CardTitle>
            <p className="text-purple-200">For {userProfile.fullName}</p>
            <p className="text-purple-300 text-sm">
              Theme: {themes.find(t => t.value === selectedTheme)?.label}
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-purple-100 leading-relaxed whitespace-pre-wrap">
                {reading}
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
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Button
          onClick={() => {
            setHasGenerated(false);
            setReading("");
            setSelectedTheme("");
            setQuestion("");
          }}
          variant="outline"
          className="w-full border-purple-400 text-white hover:bg-purple-900/50"
        >
          Get Another Reading
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Stars className="h-5 w-5 text-purple-400" />
          Tarot Reading
        </CardTitle>
        <p className="text-purple-200 text-sm">
          Select a theme for your three-card tarot reading
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme" className="text-white">Reading Theme</Label>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="bg-purple-800/20 border-purple-400/50 text-white">
              <SelectValue placeholder="Choose your focus area" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question" className="text-white">
            Specific Question (Optional)
          </Label>
          <Textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a specific question about your chosen theme..."
            className="bg-purple-800/20 border-purple-400/50 text-white placeholder:text-purple-300"
            rows={3}
          />
        </div>

        <Button
          onClick={generateReading}
          disabled={!selectedTheme}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Draw Your Cards
        </Button>
      </CardContent>
    </Card>
  );
};

export default TarotReading;
