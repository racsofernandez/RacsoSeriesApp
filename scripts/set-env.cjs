const fs = require('fs');
const path = require('path');

// Solo intenta cargar dotenv si existe un archivo .env
try {
    const dotenvPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(dotenvPath)) {
        require('dotenv').config({ path: dotenvPath });
        console.log('📄 Variables cargadas desde .env');
    } else {
        console.log('⚙️ No se encontró .env, usando variables del entorno.');
    }
} catch (err) {
    console.warn('⚠️ No se pudo cargar dotenv:', err.message);
}

const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';

// Comprobamos que las variables críticas existan
const requiredVars = [
    'NG_APP_THEMOVIEDB_API_KEY',
    'NG_APP_FIREBASE_API_KEY',
    'NG_APP_FIREBASE_AUTH_DOMAIN',
    'NG_APP_FIREBASE_PROJECT_ID',
    'NG_APP_FIREBASE_STORAGE_BUCKET',
    'NG_APP_FIREBASE_MESSAGING_SENDER_ID',
    'NG_APP_FIREBASE_APP_ID'
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    console.warn('⚠️ Faltan variables de entorno:', missing.join(', '));
}

const envConfigFile = `
export const environment = {
  production: false,
  url: 'https://api.themoviedb.org/3',
  apiKey: '${process.env.NG_APP_THEMOVIEDB_API_KEY || ''}',
  imgPath: 'https://image.tmdb.org/t/p',
  firebaseConfig: {
    apiKey: '${process.env.NG_APP_FIREBASE_API_KEY || ''}',
    authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN || ''}',
    projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID || ''}',
    storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET || ''}',
    messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || ''}',
    appId: '${process.env.NG_APP_FIREBASE_APP_ID || ''}'
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envConfigFile);

console.log(`✅ Archivos de entorno generados correctamente.`);
