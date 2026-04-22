import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Senet-Cooking Companion',
  webDir: 'www',
  cordova: {
    preferences: {
      loglevel: 'DEBUG'
    }
  }
};

export default config;
