
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stars, Moon, Sun, Sparkles } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import ZodiacSelector from "@/components/ZodiacSelector";
import HoroscopeDisplay from "@/components/HoroscopeDisplay";
import PaymentSection from "@/components/PaymentSection";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
          setIsAuthModalOpen(false);
        }
        if (event === 'SIGNED_OUT') {
          toast.success("Successfully signed out!");
          setSelectedZodiac("");
          setHasPaid(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
                Get personalized, detailed horoscope readings powered by AI and ancient wisdom. 
                Discover what the stars have in store for you.
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

        {/* Logged in experience */}
        {user && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ZodiacSelector 
                  selectedZodiac={selectedZodiac}
                  onZodiacSelect={setSelectedZodiac}
                />
                {!hasPaid && selectedZodiac && (
                  <div className="mt-8">
                    <PaymentSection onPaymentSuccess={() => setHasPaid(true)} />
                  </div>
                )}
              </div>
              <div>
                {hasPaid && selectedZodiac && (
                  <HoroscopeDisplay zodiacSign={selectedZodiac} />
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
                    <p className="text-purple-200">Advanced ChatGPT technology combined with astrological wisdom</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <Moon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Detailed Insights</h4>
                    <p className="text-purple-200">Comprehensive horoscopes covering all aspects of your life</p>
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
