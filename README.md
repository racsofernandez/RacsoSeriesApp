# RacsoSeriesApp
Aplicación de ionic del curso de udemy "Legacy: ionic 6: Crear aplicaciones IOS, Android con Angular"

# Android Studio

Primero de todo hay que instalar la característica de capacitor:

```shell
npm install @capacitor/android
```

Si hay algún problema, añadir el parámetro `--force` para forzar la instalación.

Después hay que construir la aplicación con el siguiente comando:

```shell
ionic build
```

A continuación añadir la aplicación android, ejecutar lo siguiente:

```shell
npx cap add android
```

Hay que revisar la configuración en el fichero `capacitor.config.ts`.

Y luego abrir el entorno de desarrollo IDE de Android Studio con la siguiente instrucción:

```shell
npx cap open android
```

# Certificado

Generar el certificado con el siguiente comando:

```shell
keytool -genkeypair `
  -keystore dev-keystore.jks `
  -alias seriesapp-dev `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

Después pasar el jks a base64 y subirlo a los secretos de GitHub:

```shell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("dev-keystore.jks")) | Out-File dev-keystore.txt
```