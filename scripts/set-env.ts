import { writeFileSync } from 'fs';
import { config } from 'dotenv';

config(); // Carga las variables desde .env

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
    production: false,
    url: '${process.env['NG_APP_URL']}',
    apiKey: '${process.env['NG_APP_THEMOVIEDB_API_KEY']}',
    imgPath: '${process.env['NG_APP_IMGPATH']}',
    firebaseConfig: {
        apiKey: '${process.env['NG_APP_FIREBASE_API_KEY']}',
        authDomain: '${process.env['NG_APP_FIREBASE_AUTH_DOMAIN']}',
        projectId: '${process.env['NG_APP_FIREBASE_PROJECT_ID']}',
        storageBucket: '${process.env['NG_APP_FIREBASE_STORAGE_BUCKET']}',
        messagingSenderId: '${process.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID']}',
        appId: '${process.env['NG_APP_FIREBASE_APP_ID']}'
    }
};
`;

writeFileSync(targetPath, envConfigFile);
console.log(`✅ Archivo ${targetPath} generado con variables de entorno.`);
