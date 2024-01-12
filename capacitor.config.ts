import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pointofsale.angular',
  appName: 'pointofsale',
  webDir: 'dist/pointofsale',
  server: {
    androidScheme: 'http'
  }
};

export default config;
