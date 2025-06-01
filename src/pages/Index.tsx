
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
      
      // Query the payments table to check for completed payments
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

      const hasCompletedPayment = payments && payments.length > 0;
      console.log('Payment status checked:', hasCompletedPayment, 'Payments found:', payments);
      setHasPaid(hasCompletedPayment);
      
      // If payment is found, also check if we have a stored user profile
      if (hasCompletedPayment) {
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
    
    // Get initial session
    const getSession = async () => {
      console.log("Getting initial session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Initial session:", session, "Error:", error);
      setUser(session?.user ?? null);
      
      // Check if user has made a payment
      if (session?.user) {
        await checkPaymentStatus(session.user.id);
      }
      
      // Always set loading to false after getting initial session
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", session);
        setUser(session?.user ?? null);
        
        // Ensure loading is set to false on any auth state change
        setLoading(false);
        
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

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    console.log("Signing out user...");
    await supabase.auth.signOut();
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

        {/* Hero Section */}
        {!user && (
          <HeroSection onGetStarted={() => setIsAuthModalOpen(true)} />
        )}

        {/* Example Reading Section */}
        {!user && <ExampleReading />}

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

        {/* Features Section */}
        {!user && <FeaturesSection />}
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
