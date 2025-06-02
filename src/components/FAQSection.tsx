
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2 text-3xl">
              <HelpCircle className="h-8 w-8 text-yellow-400" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-purple-200">
              Get answers to common questions about our personalized readings
            </p>
          </CardHeader>
          
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-purple-400/30">
                <AccordionTrigger className="text-white hover:text-purple-200">
                  How accurate are your tarot and horoscope readings?
                </AccordionTrigger>
                <AccordionContent className="text-purple-200">
                  Our AI-powered readings combine traditional divination methods with advanced algorithms, achieving over 85% accuracy according to customer feedback. Each reading is personalized using your specific birth details and current cosmic alignments.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-purple-400/30">
                <AccordionTrigger className="text-white hover:text-purple-200">
                  How quickly will I receive my reading?
                </AccordionTrigger>
                <AccordionContent className="text-purple-200">
                  Your personalized reading is generated instantly after payment. You'll have access to your detailed tarot, horoscope, and numerology insights within seconds of completing your order.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-purple-400/30">
                <AccordionTrigger className="text-white hover:text-purple-200">
                  Is my personal information kept confidential?
                </AccordionTrigger>
                <AccordionContent className="text-purple-200">
                  Absolutely. We use enterprise-grade encryption to protect your data. Your birth details and reading results are completely confidential and never shared with third parties. We take your privacy seriously.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-purple-400/30">
                <AccordionTrigger className="text-white hover:text-purple-200">
                  What's included in the $1.99 double reading?
                </AccordionTrigger>
                <AccordionContent className="text-purple-200">
                  Your $1.99 investment includes: a personalized horoscope based on your zodiac sign and birth details, a 3-card tarot reading focused on love/career/money, and a complete numerology analysis with your life path number. All readings are detailed and actionable.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FAQSection;
