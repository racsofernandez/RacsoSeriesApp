import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.meco.seriesApp',
  appName: 'SeriesApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
    // Añadir configuración para el Status Bar y Navigation Bar
    StatusBar: {
      backgroundColor: '#141414', // Color de fondo oscuro
    },
    NavigationBar: {
      backgroundColor: '#141414', // Color de fondo oscuro
    },
  },
};

export default config;
