
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stars, Moon, Sun, Sparkles, User, Quote } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import UserProfileForm from "@/components/UserProfileForm";
import ReadingSelector from "@/components/ReadingSelector";
import PaymentSection from "@/components/PaymentSection";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // For testing purposes - set this to false to enable payment requirement
  const TESTING_MODE = false;

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
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", session);
        setUser(session?.user ?? null);
        
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

  const checkPaymentStatus = async (userId: string) => {
    try {
      console.log('Checking payment status for user:', userId);
      
      // Query the payments table to check for completed payments
      // Using any type to avoid TypeScript inference issues until migration is run
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .limit(1);

      if (error) {
        console.error('Error checking payment status:', error);
        setHasPaid(false);
        return;
      }

      const hasCompletedPayment = payments && payments.length > 0;
      console.log('Payment status checked:', hasCompletedPayment, 'Payments found:', payments);
      setHasPaid(hasCompletedPayment);
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setHasPaid(false);
    }
  };

  // Add this useEffect to log user state changes
  useEffect(() => {
    console.log("User state changed:", user);
  }, []);

  useEffect(() => {
    console.log("UserProfile state changed:", userProfile);
  }, [userProfile]);

  const handleSignOut = async () => {
    console.log("Signing out user...");
    await supabase.auth.signOut();
  };

  const handleUserProfileSubmit = (profileData: any) => {
    console.log("Profile submitted:", profileData);
    setUserProfile(profileData);
  };

  const handlePaymentSuccess = async () => {
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
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars absolute inset-0"></div>
        <div className="stars2 absolute inset-0"></div>
        <div className="stars3 absolute inset-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Stars className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Cosmic Insights</h1>
            {TESTING_MODE && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">TESTING MODE</span>
            )}
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user.email}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              variant="outline"
              className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
            >
              Sign In
            </Button>
          )}
        </header>

        {/* Hero Section */}
        {!user && (
          <section className="text-center py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Moon className="h-16 w-16 text-yellow-400 animate-pulse" />
                  <Sun className="h-8 w-8 text-orange-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Unlock Your
                <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Cosmic </span>
                Destiny
              </h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Get personalized tarot readings powered by AI and ancient wisdom. 
                Discover what the universe has in store for you.
              </p>
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
            </div>
          </section>
        )}

        {/* Example Reading Section */}
        {!user && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Quote className="h-8 w-8 text-yellow-400" />
                  What to Expect
                </h3>
                <p className="text-xl text-purple-200">
                  Here's a complete example of the in-depth, personalized readings you'll receive
                </p>
              </div>
              
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center border-b border-purple-400/30 pb-6">
                      <h4 className="text-2xl font-bold text-white mb-2">Complete Reading: Work & Career</h4>
                      <p className="text-purple-200">For Jamie - Aries Sun, Taurus Rising</p>
                      <p className="text-sm text-purple-300 mt-2">Question: "What should I focus on in my career this month?"</p>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <div className="text-purple-100 leading-relaxed space-y-6 text-sm">
                        <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4">
                          <p className="italic text-purple-200 mb-4">
                            "Hello Jamie, Welcome to your personalized tarot reading. It's a pleasure to connect with you today and explore the theme of work and career as you navigate the path that aligns with your professional aspirations and personal growth.
                          </p>
                          <p className="italic text-purple-200">
                            As an Aries Sun with Taurus Rising, you bring a unique combination of pioneering spirit and steady determination to your professional life. Your Aries energy drives you to initiate and lead, while your Taurus Rising provides the persistence and practical approach needed to see projects through to completion. Let's see what the cards reveal about your career focus this month."
                          </p>
                        </div>
                        
                        <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                          <h5 className="text-white font-semibold text-base">Card 1: The Present Situation - The Eight of Pentacles</h5>
                          <p className="text-purple-200">
                            "The Eight of Pentacles appears in your present situation, indicating that you are currently in a phase of dedicated learning and skill development. This card shows a craftsperson meticulously working on their trade, suggesting that you are diligently applying yourself to mastering your craft or learning something new that will enhance your professional capabilities.
                          </p>
                          <p className="text-purple-200">
                            Your Aries Sun's natural enthusiasm for new challenges is perfectly aligned with this energy. You're not just going through the motions - you're genuinely passionate about improving and growing. This card encourages you to continue this focused approach, as your efforts are building a solid foundation for future success. The meticulous attention to detail reflected in this card also resonates with your Taurus Rising, which appreciates thorough, quality work."
                          </p>
                        </div>
                        
                        <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                          <h5 className="text-white font-semibold text-base">Card 2: The Challenge - The Five of Wands</h5>
                          <p className="text-purple-200">
                            "The Five of Wands represents the primary challenge you're facing in your career this month. This card depicts five figures holding wands in what appears to be a chaotic struggle, symbolizing competition, conflicting ideas, or workplace tensions. You may find yourself in situations where different viewpoints clash, or you might be dealing with increased competition in your field.
                          </p>
                          <p className="text-purple-200">
                            However, this challenge serves as an invitation to harness your natural Aries leadership qualities. Rather than being overwhelmed by the conflict, you can step up as a mediator or leader who brings clarity to confusion. Your Taurus Rising gives you the stability to remain grounded during turbulent times. Use this period to demonstrate your ability to navigate complex interpersonal dynamics and emerge as someone who can unite rather than divide."
                          </p>
                        </div>
                        
                        <div className="bg-purple-800/20 rounded-lg p-6 space-y-4">
                          <h5 className="text-white font-semibold text-base">Card 3: The Outcome - The Star</h5>
                          <p className="text-purple-200">
                            "The Star is a beautiful card to appear as your outcome, suggesting that once you navigate through the current challenges, you will find renewed purpose, inspiration, and hope in your career path. This card represents healing, guidance, and divine inspiration - indicating that your professional journey is aligned with your higher purpose.
                          </p>
                          <p className="text-purple-200">
                            The Star suggests that your hard work and dedication (Eight of Pentacles) combined with your ability to handle workplace challenges (Five of Wands) will lead to a period of clarity and inspiration. You may receive recognition for your efforts, find new opportunities that truly excite you, or discover a renewed sense of purpose in your current role. This card encourages you to trust in your journey and remain open to the guidance that will come your way."
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-700/40 to-pink-700/40 rounded-lg p-6 space-y-4">
                          <h5 className="text-white font-semibold text-base">Summary & Practical Advice</h5>
                          <p className="text-purple-200">
                            "This month, your focus should be on continuing your dedicated approach to skill development while positioning yourself as a unifying force in any workplace conflicts that arise. Your combination of Aries initiative and Taurus steadiness makes you uniquely qualified to both innovate and stabilize.
                          </p>
                          <div className="space-y-2 mt-4">
                            <p className="text-purple-200"><strong>Practical Actions:</strong></p>
                            <ul className="list-disc list-inside text-purple-200 space-y-1 ml-4">
                              <li>Continue investing time in learning new skills or perfecting existing ones</li>
                              <li>When conflicts arise, step up as a mediator rather than choosing sides</li>
                              <li>Document your achievements and contributions this month</li>
                              <li>Stay open to unexpected opportunities that may present themselves</li>
                              <li>Trust your instincts when making career-related decisions</li>
                            </ul>
                          </div>
                          <div className="bg-purple-900/30 rounded-lg p-4 mt-4">
                            <p className="text-purple-200 italic">
                              "Affirmation to carry with you: 'I am committed to my growth, skilled in navigation challenges, and open to the inspiration that guides my career path. My dedication today creates the success of tomorrow.'"
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-4">
                          <p className="text-purple-200 text-sm">
                            <strong>Personal Note:</strong> Remember, Jamie, your Aries Sun gives you the courage to take bold steps, while your Taurus Rising ensures you build lasting, sustainable success. Trust in this powerful combination as you navigate your professional journey this month.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center pt-6 border-t border-purple-400/30">
                      <p className="text-purple-200 font-medium">
                        Each reading includes detailed card interpretations, practical advice, personalized guidance based on your astrological profile, and actionable steps you can take immediately.
                      </p>
                      <p className="text-purple-300 text-sm mt-2">
                        Length: ~800-1200 words • Reading time: 4-6 minutes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Logged in experience */}
        {user && (
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to Your Cosmic Journey
              </h2>
              <p className="text-xl text-purple-200">
                Get your personalized readings and discover what the universe has in store for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {!userProfile ? (
                  <UserProfileForm 
                    onSubmit={handleUserProfileSubmit}
                    isLoading={false}
                  />
                ) : (
                  <>
                    <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
                      <CardContent className="p-6">
                        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-purple-400" />
                          Your Profile
                        </h3>
                        <div className="space-y-2 text-purple-200">
                          <p><strong>Name:</strong> {userProfile.fullName}</p>
                          <p><strong>Birth:</strong> {userProfile.birthDate}</p>
                          <p><strong>Place:</strong> {userProfile.birthPlace}</p>
                        </div>
                        <Button
                          onClick={() => setUserProfile(null)}
                          variant="outline"
                          className="mt-4 border-purple-400 text-white hover:bg-purple-900/50"
                        >
                          Edit Profile
                        </Button>
                      </CardContent>
                    </Card>
                    {!canAccessContent() && (
                      <div className="mt-8">
                        <PaymentSection onPaymentSuccess={handlePaymentSuccess} />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                {canAccessContent() && userProfile && (
                  <>
                    <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 mb-4">
                      <p className="text-green-200 text-sm">
                        {hasPaid ? "✓ Payment verified - Full access granted" : "Debug: ReadingSelector should be visible below"}
                      </p>
                    </div>
                    <ReadingSelector userProfile={userProfile} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!user && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-white text-center mb-12">
                Why Choose Cosmic Insights?
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <Stars className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Readings</h4>
                    <p className="text-purple-200">Advanced ChatGPT technology combined with tarot wisdom</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <Moon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Personal Insights</h4>
                    <p className="text-purple-200">Comprehensive tarot readings tailored to your unique birth details</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Secure & Private</h4>
                    <p className="text-purple-200">Your cosmic journey is protected with enterprise-grade security</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          console.log("Auth success callback triggered");
          setIsAuthModalOpen(false);
        }}
      />

      <style>{`
        .stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 1776px 1684px #fff, 1350px 1676px #fff, 1162px 1055px #fff, 1510px 1607px #fff, 1076px 1644px #fff, 1582px 1206px #fff, 1072px 1936px #fff, 1683px 1072px #fff, 1853px 1207px #fff, 1709px 1513px #fff;
          animation: animStar 50s linear infinite;
        }
        .stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 481px 1538px #fff, 1650px 1050px #fff, 1762px 1836px #fff, 1489px 1722px #fff, 1676px 1684px #fff, 1802px 1774px #fff, 1774px 1725px #fff, 1809px 1644px #fff, 1693px 1158px #fff, 1853px 1404px #fff;
          animation: animStar 100s linear infinite;
        }
        .stars3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 1350px 1838px #fff, 1678px 1564px #fff, 1831px 1038px #fff, 1693px 1678px #fff, 1676px 1136px #fff, 1869px 1158px #fff, 1685px 1136px #fff, 1715px 1025px #fff, 1684px 1855px #fff, 1769px 1684px #fff;
          animation: animStar 150s linear infinite;
        }
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
      `}</style>
    </div>
  );
};

export default Index;
