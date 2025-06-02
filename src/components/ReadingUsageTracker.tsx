
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReadingUsageTrackerProps {
  children: React.ReactNode;
  readingType: 'tarot' | 'numerology' | 'horoscope';
  onUsageUpdate?: (canAccess: boolean, timeRemaining?: number) => void;
}

const ReadingUsageTracker = ({ children, readingType, onUsageUpdate }: ReadingUsageTrackerProps) => {
  const [canAccess, setCanAccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkAccessAndUsage = async (showToast = false) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found');
        setCanAccess(false);
        return;
      }

      console.log('Checking payment for user:', session.user.id);

      // Get the most recent completed payment for this user
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking payment:', error);
        setCanAccess(false);
        return;
      }

      if (!payments || payments.length === 0) {
        console.log('No completed payments found');
        setCanAccess(false);
        if (showToast) {
          toast.error('No active payment found. Please complete payment to access readings.');
        }
        return;
      }

      const payment = payments[0];
      console.log('Found payment:', payment);
      const now = new Date();

      // Check if access has been granted and is still valid
      if (payment.access_granted_at && payment.access_expires_at) {
        const expiresAt = new Date(payment.access_expires_at);
        const isStillValid = now < expiresAt;
        console.log('Access expires at:', expiresAt, 'Still valid:', isStillValid);

        if (isStillValid) {
          const timeLeft = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
          setTimeRemaining(timeLeft);
          setCanAccess(true);
          onUsageUpdate?.(true, timeLeft);
          if (showToast) {
            toast.success('Payment verified! Access granted.');
          }
        } else {
          // Access has expired
          console.log('Access has expired');
          setCanAccess(false);
          setTimeRemaining(null);
          onUsageUpdate?.(false);
          if (showToast) {
            toast.error('Your 2-hour access window has expired.');
          }
        }
      } else {
        // First time accessing - grant 2-hour access window
        console.log('First time access, granting 2-hour window');
        const accessGrantedAt = now.toISOString();
        const accessExpiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now

        const { error: updateError } = await supabase
          .from('payments')
          .update({
            access_granted_at: accessGrantedAt,
            access_expires_at: accessExpiresAt
          })
          .eq('id', payment.id);

        if (updateError) {
          console.error('Error updating payment access:', updateError);
          toast.error('Failed to grant access');
          return;
        }

        setTimeRemaining(2 * 60 * 60); // 2 hours in seconds
        setCanAccess(true);
        onUsageUpdate?.(true, 2 * 60 * 60);
        toast.success('Payment verified! 2-hour access window activated!');
      }
    } catch (error) {
      console.error('Error in checkAccessAndUsage:', error);
      setCanAccess(false);
      if (showToast) {
        toast.error('Error checking payment status. Please try again.');
      }
    }
  };

  const handleRefreshPaymentStatus = async () => {
    setIsRefreshing(true);
    await checkAccessAndUsage(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    console.log('ReadingUsageTracker mounted for type:', readingType);
    
    const initCheck = async () => {
      await checkAccessAndUsage();
      setIsLoading(false);
    };
    
    initCheck();

    // Check for URL parameters that indicate returning from payment
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const paymentId = urlParams.get('paymentId');
    
    if (token || paymentId) {
      console.log('Detected return from payment, refreshing status...');
      // Small delay to allow payment processing to complete
      setTimeout(() => {
        checkAccessAndUsage(true);
      }, 2000);
    }
  }, [readingType]);

  // Auto-refresh every 30 seconds to catch payment updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!canAccess) {
        console.log('Auto-refreshing payment status...');
        checkAccessAndUsage();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [canAccess]);

  // Update time remaining every minute
  useEffect(() => {
    if (timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          setCanAccess(false);
          onUsageUpdate?.(false);
          return null;
        }
        return prev - 60; // Decrease by 1 minute
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeRemaining, onUsageUpdate]);

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  console.log('ReadingUsageTracker render state:', {
    isLoading,
    canAccess,
    timeRemaining,
    readingType
  });

  if (isLoading) {
    return (
      <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
        <CardContent className="p-6 text-center">
          <p className="text-purple-200">Checking access...</p>
        </CardContent>
      </Card>
    );
  }

  if (!canAccess) {
    return (
      <Card className="bg-gradient-to-br from-red-900/40 to-purple-900/40 border-red-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Lock className="h-6 w-6 text-red-400" />
            Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-red-200">
            Please complete payment to access your personalized readings.
          </p>
          <p className="text-purple-200 text-sm">
            If you've just completed payment, click the refresh button below.
          </p>
          <Button
            onClick={handleRefreshPaymentStatus}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking Payment...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Payment Status
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {timeRemaining && (
        <Card className="bg-gradient-to-br from-green-900/40 to-purple-900/40 border-green-400/30 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">
                  Access expires in: {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
              <Button
                onClick={handleRefreshPaymentStatus}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-green-200 hover:text-green-100"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {children}
    </div>
  );
};

export default ReadingUsageTracker;
