
import { Button } from "@/components/ui/button";
import { Stars } from "lucide-react";

interface HeaderProps {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  testingMode?: boolean;
}

const Header = ({ user, onSignIn, onSignOut, testingMode = false }: HeaderProps) => {
  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Stars className="h-8 w-8 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">Cosmic Insights</h1>
        {testingMode && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">TESTING MODE</span>
        )}
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.email}</span>
          <Button
            onClick={onSignOut}
            variant="outline"
            className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          onClick={onSignIn}
          variant="outline"
          className="bg-purple-800/30 border-purple-400 text-white hover:bg-purple-700/50"
        >
          Sign In
        </Button>
      )}
    </header>
  );
};

export default Header;
