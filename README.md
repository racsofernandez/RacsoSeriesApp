# RacsoSeriesApp
Aplicación de ionic del curso de udemy "Legacy: ionic 6: Crear aplicaciones IOS, Android con Angular"

# Android Studio

Primero de todo hay que instalar la característica de capacitor:

```npm install @capacitor/android```

Si hay algún problema, añadir el parámetro `--force` para forzar la instalación.

Después hay que construir la aplicación con el siguiente comando:

```ionic build```

A continuación añadir la aplicación android, ejecutar lo siguiente:

```npx cap add android```

Hay que revisar la configuración en el fichero `capacitor.config.ts`.

Y luego abrir el entorno de desarrollo IDE de Android Studio con la siguiente instrucción:

```npx cap open android```

