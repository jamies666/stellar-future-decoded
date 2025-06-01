
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import UserProfileForm from "./UserProfileForm";
import ReadingSelector from "./ReadingSelector";
import PaymentSection from "./PaymentSection";

interface UserDashboardProps {
  userProfile: any;
  canAccessContent: boolean;
  hasPaid: boolean;
  onUserProfileSubmit: (profileData: any) => void;
  onPaymentSuccess: () => void;
  onEditProfile: () => void;
}

const UserDashboard = ({ 
  userProfile, 
  canAccessContent, 
  hasPaid,
  onUserProfileSubmit, 
  onPaymentSuccess, 
  onEditProfile 
}: UserDashboardProps) => {
  return (
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
              onSubmit={onUserProfileSubmit}
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
                    onClick={onEditProfile}
                    variant="outline"
                    className="mt-4 border-purple-400 text-white hover:bg-purple-900/50"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
              {!canAccessContent && (
                <div className="mt-8">
                  <PaymentSection onPaymentSuccess={onPaymentSuccess} />
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {canAccessContent && userProfile && (
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
  );
};

export default UserDashboard;
