
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Payment cancelled page loaded');
    toast.error("Payment was cancelled");
    
    // Clean up stored data
    localStorage.removeItem('paypal_order_id');
    localStorage.removeItem('payment_session_token');
  }, []);

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <Card className="bg-gradient-to-br from-orange-900/40 to-purple-900/40 border-orange-400/30 backdrop-blur-md max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6 text-orange-400" />
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-orange-200">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <p className="text-purple-200 text-sm">
            You can try again anytime to unlock your cosmic reading.
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

export default PaymentCancelled;
