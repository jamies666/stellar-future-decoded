
import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="mt-16 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-purple-900/20 border-purple-400/20 backdrop-blur-md">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">Terms & Conditions</h3>
            <div className="text-purple-200 text-sm space-y-2">
              <p>
                MyTarotAndHoroscope.com offers digital products (personal readings). After purchase, your reading will be delivered directly immediately. All sales are final; there are no returns or refunds for digital products.
              </p>
              <p>
                <strong>Company address:</strong> Badderijstraat 2/1, 3000 Hasselt, Belgium.
              </p>
              <p>
                <strong>Complaints?</strong> Contact us at{" "}
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
