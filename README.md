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

Y luego sincronizar

```shell
npx cap sync
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

## Para autenticación en google

Generar certificado:

```shell
keytool -genkeypair -v \ 
    -alias seriesapp \
    -keyalg RSA \ 
    -keysize 2048 \
    -validity 10000 \ 
    -keystore seriesapp.keystore \ 
    -dname "CN=SeriesApp, OU=Development, O=SeriesApp Corp, L=City Name, ST=State Name, C=ES"
```

O para dev:
```shell
keytool -genkeypair -v \
    -alias seriesapp-dev \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000 \
     -keystore seriesapp-dev.keystore \
     -dname "CN=SeriesApp-Dev, OU=Development, O=SeriesApp Corp, L=City Name, ST=State Name, C=ES"
```

Después obtener su SHA-1

```shell
keytool -list -v -keystore seriesapp.keystore
```

U obtener el SHA-1 directamente desde el APK generado.

```shell
keytool -printcert -jarfile app-debug.apk
```