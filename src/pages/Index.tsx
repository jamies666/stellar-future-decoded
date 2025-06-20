import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSection from "@/components/HeroSection";
import ExampleReading from "@/components/ExampleReading";
import FeaturesSection from "@/components/FeaturesSection";
import UserDashboard from "@/components/UserDashboard";
import StickyCTA from "@/components/StickyCTA";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // For testing purposes - set this to false to enable payment requirement
  const TESTING_MODE = false;

  const checkPaymentStatus = async (userId: string): Promise<void> => {
    try {
      console.log('Checking payment status for user:', userId);
      
      // Query the payments table to check for completed payments with valid access
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking payment status:', error);
        setHasPaid(false);
        return;
      }

      if (!payments || payments.length === 0) {
        console.log('No completed payments found');
        setHasPaid(false);
        return;
      }

      const payment = payments[0];
      const now = new Date();

      // Check if this is a valid payment (either no access granted yet, or access is still valid)
      let hasValidAccess = true;

      if (payment.access_expires_at) {
        const expiresAt = new Date(payment.access_expires_at);
        hasValidAccess = now < expiresAt;
        console.log('Access expires at:', expiresAt, 'Still valid:', hasValidAccess);
      }

      console.log('Payment status checked:', hasValidAccess, 'Payment found:', payment);
      setHasPaid(hasValidAccess);
      
      // If payment is found, also check if we have a stored user profile
      if (hasValidAccess) {
        const storedProfile = localStorage.getItem(`userProfile_${userId}`);
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            setUserProfile(profile);
            console.log('Restored user profile from localStorage:', profile);
          } catch (e) {
            console.error('Error parsing stored profile:', e);
          }
        }
      }
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setHasPaid(false);
    }
  };

  useEffect(() => {
    console.log("Index component mounted, setting up auth listener");
    
    // Set a fallback timeout to ensure loading is cleared
    const loadingTimeout = setTimeout(() => {
      console.log("Loading timeout reached, clearing loading state");
      setLoading(false);
    }, 5000); // 5 second timeout

    // Get initial session with proper error handling
    const getSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial session result:", session ? "found" : "none", "Error:", error);
        
        if (error) {
          console.error("Session error:", error);
        }
        
        setUser(session?.user ?? null);
        
        // Check if user has made a payment
        if (session?.user) {
          await checkPaymentStatus(session.user.id);
        }
        
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        // Always clear loading state
        console.log("Clearing loading state after session check");
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
        setUser(session?.user ?? null);
        
        // Ensure loading is cleared on any auth state change
        setLoading(false);
        clearTimeout(loadingTimeout);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in successfully");
          toast.success("Successfully signed in!");
          setIsAuthModalOpen(false);
          
          // Check payment status for the signed-in user
          if (session?.user) {
            await checkPaymentStatus(session.user.id);
          }
        }
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          toast.success("Successfully signed out!");
          setHasPaid(false);
          setUserProfile(null);
        }
      }
    );

    // Get the initial session
    getSession();

    return () => {
      console.log("Cleaning up auth listener");
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process...");
      
      // Clear local state immediately
      setUser(null);
      setHasPaid(false);
      setUserProfile(null);
      
      // Clear localStorage
      if (user) {
        localStorage.removeItem(`userProfile_${user.id}`);
      }
      localStorage.removeItem('paypal_order_id');
      localStorage.removeItem('payment_session_token');
      localStorage.removeItem('payment_user_id');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out. Please try again.");
        return;
      }
      
      console.log("User successfully signed out");
      toast.success("Successfully signed out!");
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleUserProfileSubmit = (profileData: any) => {
    console.log("Profile submitted:", profileData);
    setUserProfile(profileData);
    
    // Store profile in localStorage for persistence
    if (user) {
      localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(profileData));
    }
  };

  const handlePaymentSuccess = async () => {
    console.log("Payment success triggered, refreshing payment status");
    setHasPaid(true);
    // Refresh payment status from database
    if (user) {
      await checkPaymentStatus(user.id);
    }
  };

  // Function to check if user can access content (paywall logic)
  const canAccessContent = () => {
    const canAccess = TESTING_MODE || hasPaid;
    console.log("Can access content:", canAccess, "TESTING_MODE:", TESTING_MODE, "hasPaid:", hasPaid);
    return canAccess;
  };

  if (loading) {
    console.log("App is loading...");
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  console.log("Rendering Index with user:", user ? "authenticated" : "not authenticated");
  console.log("Current userProfile:", userProfile);
  console.log("Can access content:", canAccessContent());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated stars background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header 
          user={user}
          onSignIn={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          testingMode={TESTING_MODE}
        />

        {/* Hero Section with SEO optimization */}
        {!user && (
          <HeroSection onGetStarted={() => setIsAuthModalOpen(true)} />
        )}

        {/* Example Reading Section */}
        {!user && <ExampleReading />}

        {/* Features Section with enhanced copy */}
        {!user && <FeaturesSection />}

        {/* Testimonials Section */}
        {!user && <TestimonialSection />}

        {/* FAQ Section */}
        {!user && <FAQSection />}

        {/* Logged in experience */}
        {user && (
          <UserDashboard
            userProfile={userProfile}
            canAccessContent={canAccessContent()}
            hasPaid={hasPaid}
            onUserProfileSubmit={handleUserProfileSubmit}
            onPaymentSuccess={handlePaymentSuccess}
            onEditProfile={() => setUserProfile(null)}
          />
        )}

        {/* Footer with disclaimer */}
        <Footer />

        {/* Sticky CTA for mobile */}
        {!user && (
          <StickyCTA onGetStarted={() => setIsAuthModalOpen(true)} />
        )}

        {/* Bottom padding for mobile sticky CTA */}
        {!user && <div className="h-20 md:h-0" />}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          console.log("Auth success callback triggered");
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
