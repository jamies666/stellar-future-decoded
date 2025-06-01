
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PaymentSectionProps {
  onPaymentSuccess: () => void;
}

const PaymentSection = ({ onPaymentSuccess }: PaymentSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log('Starting PayPal payment process...');

      // Create PayPal order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-paypal-order', {
        body: {}
      });

      if (orderError || !orderData) {
        console.error('Error creating PayPal order:', orderError);
        throw new Error('Failed to create PayPal order');
      }

      console.log('PayPal order created:', orderData);

      // Redirect to PayPal for payment approval
      if (orderData.approvalUrl) {
        // Store order ID for later use
        localStorage.setItem('paypal_order_id', orderData.orderId);
        
        // Open PayPal in a new window
        const paypalWindow = window.open(
          orderData.approvalUrl,
          'paypal-payment',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for the payment completion
        const checkPaymentStatus = setInterval(async () => {
          if (paypalWindow?.closed) {
            clearInterval(checkPaymentStatus);
            
            // Check if payment was completed
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            
            if (token) {
              // Payment was approved, capture it
              await capturePayment(orderData.orderId);
            } else {
              setIsProcessing(false);
              toast.error("Payment was cancelled or failed");
            }
          }
        }, 1000);

        // Also set up a message listener for postMessage communication
        const messageListener = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'PAYPAL_PAYMENT_SUCCESS') {
            window.removeEventListener('message', messageListener);
            await capturePayment(orderData.orderId);
          } else if (event.data.type === 'PAYPAL_PAYMENT_CANCELLED') {
            window.removeEventListener('message', messageListener);
            setIsProcessing(false);
            toast.error("Payment was cancelled");
          }
        };

        window.addEventListener('message', messageListener);

      } else {
        throw new Error('No approval URL received from PayPal');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  };

  const capturePayment = async (orderId: string) => {
    try {
      console.log('Capturing PayPal payment...');

      const { data: captureData, error: captureError } = await supabase.functions.invoke('capture-paypal-payment', {
        body: { orderId }
      });

      if (captureError || !captureData) {
        console.error('Error capturing PayPal payment:', captureError);
        throw new Error('Failed to capture PayPal payment');
      }

      console.log('PayPal payment captured:', captureData);

      if (captureData.success) {
        toast.success("Payment successful! Your reading access has been activated.");
        onPaymentSuccess();
        localStorage.removeItem('paypal_order_id');
      } else {
        throw new Error('Payment capture was not successful');
      }

    } catch (error) {
      console.error('Capture error:', error);
      toast.error(error instanceof Error ? error.message : "Payment capture failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
      <CardHeader className="text-center">
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          Unlock Your Cosmic Reading
        </CardTitle>
        <p className="text-purple-200">Get your detailed horoscope for just $1.99</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">$1.99</div>
          <p className="text-purple-200 text-sm">One-time payment • Detailed AI-powered reading</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-purple-200">
            <Shield className="h-5 w-5 text-green-400" />
            <span>Secure PayPal payment</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>Personalized detailed horoscope</span>
          </div>
          <div className="flex items-center gap-3 text-purple-200">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <span>Instant access after payment</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paypal-email" className="text-white">
              PayPal Email (Optional for tracking)
            </Label>
            <Input
              id="paypal-email"
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-purple-900/30 border-purple-400/50 text-white placeholder:text-purple-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Processing Payment..."
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay with PayPal - $1.99
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-purple-300 text-center">
          By proceeding, you agree to our terms of service. 
          Payment is processed securely through PayPal.
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
