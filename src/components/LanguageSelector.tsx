
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-purple-300" />
      <div className="flex gap-1">
        <Button
          onClick={() => setLanguage('nl')}
          variant={language === 'nl' ? 'default' : 'ghost'}
          size="sm"
          className={`text-xs px-2 py-1 ${
            language === 'nl' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white hover:bg-purple-700/50'
          }`}
        >
          NL
        </Button>
        <Button
          onClick={() => setLanguage('en')}
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          className={`text-xs px-2 py-1 ${
            language === 'en' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white hover:bg-purple-700/50'
          }`}
        >
          EN
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
