// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'https://api.themoviedb.org/3',
  apiKey: 'apiKey',
  imgPath: 'https://image.tmdb.org/t/p',
    firebaseConfig: {
        apiKey: "apiKey",
        authDomain: "es.meco.seriesApp",
        projectId: "seriesapp-23d56",
        storageBucket: "seriesapp-23d56.firebasestorage.app",
        messagingSenderId: "1234567890",
        appId: "appId"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
