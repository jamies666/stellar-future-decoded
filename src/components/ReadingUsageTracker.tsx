
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";

interface ReadingUsage {
  tarot: boolean;
  numerology: boolean;
  horoscope: boolean;
}

interface ReadingUsageTrackerProps {
  children: React.ReactNode;
  readingType: 'tarot' | 'numerology' | 'horoscope';
  onUsageUpdate?: (canAccess: boolean, timeRemaining?: number) => void;
}

const ReadingUsageTracker = ({ children, readingType, onUsageUpdate }: ReadingUsageTrackerProps) => {
  const [canAccess, setCanAccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingUsed, setReadingUsed] = useState(false);

  const checkAccessAndUsage = async () => {
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
          
          // Check if this specific reading type has been used
          const readingsUsed = (payment.readings_used as unknown as ReadingUsage) || {
            tarot: false,
            numerology: false,
            horoscope: false
          };
          
          console.log('Readings used:', readingsUsed);
          console.log('Current reading type:', readingType);
          
          const hasUsedThisReading = readingsUsed[readingType] || false;
          console.log('Has used this reading:', hasUsedThisReading);
          
          setReadingUsed(hasUsedThisReading);
          // Allow access if reading hasn't been used yet
          const canAccessReading = !hasUsedThisReading;
          console.log('Can access reading:', canAccessReading);
          
          setCanAccess(canAccessReading);
          onUsageUpdate?.(canAccessReading, timeLeft);
        } else {
          // Access has expired
          console.log('Access has expired');
          setCanAccess(false);
          setTimeRemaining(null);
          onUsageUpdate?.(false);
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
        setReadingUsed(false);
        onUsageUpdate?.(true, 2 * 60 * 60);
        toast.success('2-hour access window activated!');
      }
    } catch (error) {
      console.error('Error in checkAccessAndUsage:', error);
      setCanAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markReadingAsUsed = async () => {
    console.log('Marking reading as used for type:', readingType);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session when marking reading as used');
        return;
      }

      // Get the current payment record
      const { data: payments, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError || !payments || payments.length === 0) {
        console.error('Error fetching payment for usage update:', fetchError);
        return;
      }

      const payment = payments[0];
      const currentReadings = (payment.readings_used as unknown as ReadingUsage) || {
        tarot: false,
        numerology: false,
        horoscope: false
      };

      console.log('Current readings before update:', currentReadings);

      // Mark this reading type as used
      const updatedReadings = {
        ...currentReadings,
        [readingType]: true
      };

      console.log('Updated readings:', updatedReadings);

      const { error: updateError } = await supabase
        .from('payments')
        .update({
          readings_used: updatedReadings
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error('Error updating reading usage:', updateError);
        return;
      }

      setReadingUsed(true);
      setCanAccess(false);
      onUsageUpdate?.(false, timeRemaining);
      console.log(`${readingType} reading marked as used successfully`);
    } catch (error) {
      console.error('Error marking reading as used:', error);
    }
  };

  useEffect(() => {
    console.log('ReadingUsageTracker mounted for type:', readingType);
    checkAccessAndUsage();
  }, [readingType]);

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
    readingUsed,
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

  if (readingUsed) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/40 to-purple-900/40 border-gray-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
            Reading Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">
            You have already used your {readingType} reading for this session.
          </p>
          <p className="text-purple-200 text-sm">
            Purchase another reading to get a new {readingType} session.
          </p>
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
            Access Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-red-200">
            Your 2-hour access window has expired.
          </p>
          <p className="text-purple-200 text-sm">
            Please purchase a new reading to get another 2-hour session.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Clone the children and pass the markReadingAsUsed function
  const childrenWithProps = React.cloneElement(children as React.ReactElement, {
    onReadingComplete: markReadingAsUsed
  });

  return (
    <div className="space-y-4">
      {timeRemaining && (
        <Card className="bg-gradient-to-br from-green-900/40 to-purple-900/40 border-green-400/30 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-green-200">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Access expires in: {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {childrenWithProps}
    </div>
  );
};

export default ReadingUsageTracker;
