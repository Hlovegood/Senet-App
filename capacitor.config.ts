import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.exampple.app',
  appName: 'Senet App',
  webDir: 'www',
  server: {
    // This allows your app to talk to your PC's IP address
    allowNavigation: [
      '192.168.1.2',
      '192.168.1.2:3000',
      '*.8thwall.app'
    ],
    cleartext: true, // Allows non-HTTPS if necessary during testing
  },
};

export default config;
