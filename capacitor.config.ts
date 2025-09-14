import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7710c55870664dadb79959607388f514',
  appName: 'stellar-future-decoded',
  webDir: 'dist',
  server: {
    url: 'https://7710c558-7066-4dad-b799-59607388f514.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e1b4b',
      showSpinner: false
    }
  }
};

export default config;