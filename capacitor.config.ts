import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.meco.seriesApp',
  appName: 'SeriesApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },

    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: [
        'google.com'
      ]
    }
  }
};

export default config;
