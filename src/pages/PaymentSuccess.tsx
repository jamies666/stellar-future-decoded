
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handlePaymentCapture = async () => {
      try {
        console.log('Payment success page loaded');
        
        // Get the token from URL (PayPal order ID)
        const token = searchParams.get('token');
        const payerId = searchParams.get('PayerID');
        
        console.log('URL params:', { token, payerId });

        if (!token || !payerId) {
          console.error('Missing token or payer ID from PayPal redirect');
          throw new Error('Invalid payment confirmation');
        }

        // Get stored order ID and verify it matches
        const storedOrderId = localStorage.getItem('paypal_order_id');
        console.log('Stored order ID:', storedOrderId, 'Token from URL:', token);

        if (storedOrderId && storedOrderId !== token) {
          console.error('Order ID mismatch');
          throw new Error('Payment verification failed');
        }

        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error('Session error during capture:', sessionError);
          throw new Error('Authentication expired. Please log in again.');
        }

        console.log('Capturing payment for order:', token);

        // Capture the payment
        const { data: captureData, error: captureError } = await supabase.functions.invoke('capture-paypal-payment', {
          body: { orderId: token }
        });

        if (captureError) {
          console.error('Error capturing PayPal payment:', captureError);
          throw new Error(`Failed to capture PayPal payment: ${captureError.message}`);
        }

        if (!captureData) {
          console.error('No capture data received');
          throw new Error('No response received from payment capture');
        }

        console.log('PayPal payment capture response:', captureData);

        if (captureData.success) {
          console.log('Payment captured successfully');
          setPaymentStatus('success');
          toast.success("Payment successful! Your reading access has been activated.");
          
          // Clean up stored data
          localStorage.removeItem('paypal_order_id');
          localStorage.removeItem('payment_session_token');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          console.error('Payment capture was not successful:', captureData);
          throw new Error(captureData.message || 'Payment capture was not successful');
        }

      } catch (error) {
        console.error('Payment capture error:', error);
        setPaymentStatus('error');
        toast.error(error instanceof Error ? error.message : "Payment capture failed");
        
        // Clean up stored data
        localStorage.removeItem('paypal_order_id');
        localStorage.removeItem('payment_session_token');
      } finally {
        setIsProcessing(false);
      }
    };

    handlePaymentCapture();
  }, [searchParams, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-yellow-400 animate-spin" />
              Processing Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-purple-200 mb-4">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="bg-gradient-to-br from-green-900/40 to-purple-900/40 border-green-400/30 backdrop-blur-md max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-200">
              Your payment has been processed successfully. You now have access to personalized readings!
            </p>
            <p className="text-purple-200 text-sm">
              Redirecting you back to the main page...
            </p>
            <Button
              onClick={handleReturnHome}
              className="w-full bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600 text-white"
            >
              Return to Cosmic Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="bg-gradient-to-br from-red-900/40 to-purple-900/40 border-red-400/30 backdrop-blur-md max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Payment Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-red-200">
            There was an issue processing your payment. Please try again.
          </p>
          <Button
            onClick={handleReturnHome}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Return to Cosmic Insights
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
