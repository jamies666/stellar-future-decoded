
import { Button } from "@/components/ui/button";
import { Stars } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface HeaderProps {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  testingMode?: boolean;
}

const Header = ({ user, onSignIn, onSignOut, testingMode = false }: HeaderProps) => {
  const { t } = useLanguage();

  const handleSignOutClick = async () => {
    try {
      console.log("Sign out button clicked");
      await onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Stars className="h-8 w-8 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">My Tarot and Horoscope</h1>
        {testingMode && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">TESTING MODE</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-white">{t('welcome')}, {user.email}</span>
            <Button
              onClick={handleSignOutClick}
              variant="outline"
              className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
            >
              {t('signOut')}
            </Button>
          </div>
        ) : (
          <Button
            onClick={onSignIn}
            variant="outline"
            className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
          >
            {t('signIn')}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
