
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

  const clearPaymentData = () => {
    localStorage.removeItem('paypal_order_id');
    localStorage.removeItem('payment_session_token');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) {
      console.log('Payment already in progress, ignoring click');
      return;
    }

    // Clear any existing payment data before starting new payment
    clearPaymentData();
    
    setIsProcessing(true);
    console.log('Starting PayPal payment process...');

    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error. Please try logging in again.');
      }
      
      if (!session) {
        console.error('No session found');
        throw new Error('Please log in to make a payment');
      }
      
      console.log('User authenticated:', session.user.id);

      // Create PayPal order with timestamp to ensure uniqueness
      const paymentData = {
        paypalEmail: paypalEmail || undefined,
        timestamp: Date.now(),
        userId: session.user.id
      };
      
      console.log('Calling create-paypal-order function with data:', paymentData);
      
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-paypal-order', {
        body: paymentData
      });

      console.log('Response received from create-paypal-order:', { orderData, orderError });

      if (orderError) {
        console.error('Error creating PayPal order:', orderError);
        throw new Error(`Failed to create PayPal order: ${orderError.message}`);
      }

      if (!orderData) {
        console.error('No order data received from function');
        throw new Error('No response received from payment service');
      }

      if (!orderData.success) {
        console.error('Order creation failed:', orderData);
        throw new Error(orderData.error || 'Failed to create PayPal order');
      }

      if (!orderData.orderId || !orderData.approvalUrl) {
        console.error('Missing order data:', orderData);
        throw new Error('Invalid response from payment service');
      }

      console.log('PayPal order created successfully:', {
        orderId: orderData.orderId,
        approvalUrl: orderData.approvalUrl
      });

      // Store order ID and session info for later verification
      localStorage.setItem('paypal_order_id', orderData.orderId);
      localStorage.setItem('payment_session_token', session.access_token);
      localStorage.setItem('payment_user_id', session.user.id);
      
      console.log('Stored payment data, redirecting to PayPal...');
      console.log('Approval URL:', orderData.approvalUrl);
      
      // Small delay to ensure localStorage is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to PayPal for payment approval
      window.location.href = orderData.approvalUrl;

    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : "Payment initialization failed";
      toast.error(errorMessage);
      
      // Clean up stored data on error
      clearPaymentData();
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
              disabled={isProcessing}
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
