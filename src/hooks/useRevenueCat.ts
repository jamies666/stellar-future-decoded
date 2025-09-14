import { useState, useEffect } from 'react';
import { revenueCatService } from '@/services/RevenueCatService';
import { CustomerInfo } from '@revenuecat/purchases-capacitor';
import { supabase } from '@/integrations/supabase/client';

export const useRevenueCat = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    initializeAndCheck();
  }, []);

  const initializeAndCheck = async () => {
    try {
      // Initialize RevenueCat
      await revenueCatService.initialize();
      
      // Set user if authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await revenueCatService.setUserId(session.user.id);
      }
      
      // Get customer info
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
      setHasActiveSubscription(revenueCatService.hasActiveSubscription(info));
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCustomerInfo = async () => {
    try {
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
      setHasActiveSubscription(revenueCatService.hasActiveSubscription(info));
    } catch (error) {
      console.error('Failed to refresh customer info:', error);
    }
  };

  return {
    customerInfo,
    isLoading,
    hasActiveSubscription,
    refreshCustomerInfo,
  };
};