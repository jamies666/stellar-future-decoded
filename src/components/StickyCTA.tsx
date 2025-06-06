
import { Button } from "@/components/ui/button";
import { Sparkles, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StickyCTAProps {
  onGetStarted: () => void;
}

const StickyCTA = ({ onGetStarted }: StickyCTAProps) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-md border-t border-purple-400/30 p-4 md:hidden">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-2">
          <p className="text-yellow-400 text-xs font-semibold flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {t('limitedTime')}
          </p>
        </div>
        <Button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 text-sm rounded-full shadow-lg animate-pulse"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {t('getTripleReading')}
        </Button>
      </div>
    </div>
  );
};

export default StickyCTA;
