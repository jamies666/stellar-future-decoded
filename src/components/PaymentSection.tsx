import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Shield, CreditCard } from "lucide-react";
import { revenueCatService } from "@/services/RevenueCatService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { PurchasesOffering, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { supabase } from "@/integrations/supabase/client";

interface PaymentSectionProps {
  onPaymentSuccess: () => void;
  userProfile?: any;
}

const PaymentSection = ({ onPaymentSuccess, userProfile }: PaymentSectionProps) => {
  const { t } = useLanguage();
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('PaymentSection mounted');
    initializeRevenueCat();
    
    // Check for successful payment completion from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_completed') === 'true') {
      console.log('Payment completion detected from URL');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }
  }, [onPaymentSuccess]);

  const initializeRevenueCat = async () => {
    try {
      await revenueCatService.initialize();
      const availableOfferings = await revenueCatService.getOfferings();
      setOfferings(availableOfferings);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      toast.error('Failed to load payment options');
      setIsLoading(false);
    }
  };

  const handleRevenueCatPurchase = async (packageToPurchase: PurchasesPackage) => {
    console.log('Initiating RevenueCat purchase...');
    
    try {
      setIsLoading(true);
      
      // Set the user ID in RevenueCat
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      await revenueCatService.setUserId(session.user.id);
      
      // Make the purchase
      const customerInfo = await revenueCatService.purchasePackage(packageToPurchase);
      
      if (revenueCatService.hasActiveSubscription(customerInfo)) {
        toast.success('Purchase successful!');
        onPaymentSuccess();
      } else {
        toast.error('Purchase was not completed successfully');
      }
    } catch (error) {
      console.error('RevenueCat purchase error:', error);
      toast.error('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
      <CardHeader className="text-center">
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          Unlock Your Cosmic Reading
        </CardTitle>
        <p className="text-purple-200">Get your detailed horoscope</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">€1,99</div>
          <p className="text-purple-200 text-sm">One-time payment • Detailed reading</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-purple-200">
            <Shield className="h-5 w-5 text-green-400" />
            <span>Secure payment</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>Personalized detailed reading</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <span>Instant access after payment</span>
          </div>
        </div>

        {isLoading ? (
          <Button disabled className="w-full py-4">
            Loading payment options...
          </Button>
        ) : offerings.length > 0 ? (
          offerings[0].availablePackages?.map((pkg) => (
            <Button
              key={pkg.identifier}
              onClick={() => handleRevenueCatPurchase(pkg)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-2"
              size="lg"
            >
              💳 {pkg.product?.title || 'Purchase'} - {pkg.product?.priceString || '€1.99'}
            </Button>
          ))
        ) : (
          <Button
            onClick={() => toast.error('No payment options available')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            💳 Pay Now
          </Button>
        )}

        <p className="text-xs text-purple-300 text-center">
          By proceeding, you agree to our terms of service.
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;