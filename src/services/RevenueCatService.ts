import { Purchases, PurchasesOffering, CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-capacitor';

class RevenueCatService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize RevenueCat with your API key
      await Purchases.setLogLevel({ level: 'DEBUG' as any });
      await Purchases.configure({
        apiKey: 'sk_BuMJfDvsjOyIUAZQDZWHEDazpOVCh',
      });
      
      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.all ? Object.values(offerings.all) : [];
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return [];
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    try {
      const result = await Purchases.purchasePackage({ aPackage: packageToPurchase });
      return result.customerInfo as CustomerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.customerInfo as CustomerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn({ appUserID: userId });
    } catch (error) {
      console.error('Failed to set user ID:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  }

  hasActiveSubscription(customerInfo: CustomerInfo): boolean {
    return Object.keys(customerInfo.activeSubscriptions).length > 0;
  }
}

export const revenueCatService = new RevenueCatService();