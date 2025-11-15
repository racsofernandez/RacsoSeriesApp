const fs = require('fs');
const path = require('path');

console.log('Parametro 1: ' + process.argv[1]);
console.log('Parametro 2: ' + process.argv[2]);
console.log('Parametro 3: ' + process.argv[3]);

const version = process.argv[2] || 'local-dev';
const customOutputPath = process.argv[3] ? process.argv[3].trim() : '../src/assets';

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

const targetPath = './src/assets/config.json';

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

console.log(`Versión: ${version}`);
// 3️⃣ Construir objeto de configuración
const envConfigFile = {
    version,
    url: 'https://api.themoviedb.org/3',
    apiKey: process.env.NG_APP_THEMOVIEDB_API_KEY || '',
    imgPath: 'https://image.tmdb.org/t/p',
    firebaseConfig: {
        apiKey: process.env.NG_APP_FIREBASE_API_KEY || '',
        authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NG_APP_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NG_APP_FIREBASE_APP_ID || ''
    }
};

// 4️⃣ Crear carpeta destino (src/assets/)
const outputDir = path.resolve(__dirname, customOutputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 5️⃣ Escribir fichero config.json
const outputFile = path.join(outputDir, 'config.json');
fs.writeFileSync(outputFile, JSON.stringify(envConfigFile, null, 2));

console.log(`✅ Archivos de entorno generados correctamente.`);
