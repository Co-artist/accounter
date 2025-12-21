import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.accounter',
  appName: '猫头鹰记账',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      url: 'https://owl-account-backend.onrender.com/api/updates/check'
    }
  }
};

export default config;
