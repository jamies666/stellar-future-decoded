
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-purple-900/20 border-purple-400/20 backdrop-blur-md">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">{t('termsTitle')}</h3>
            <div className="text-purple-200 text-sm space-y-2">
              <p>
                {t('termsText')}
              </p>
              <p>
                <strong>{t('companyAddress')}</strong> Badderijstraat 2/1, 3000 Hasselt, Belgium.
              </p>
              <p>
                <strong>{t('complaints')}</strong> {t('contactUs')}{" "}
                <a 
                  href="mailto:info@mytarotandhoroscope.com" 
                  className="text-purple-300 hover:text-purple-100 underline"
                >
                  info@mytarotandhoroscope.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;
