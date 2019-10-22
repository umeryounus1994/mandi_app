// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
     apiKey: "AIzaSyA63LxUWcDFAnBsYFr59j8t03M_zGYL9uk",
    authDomain: "houseofmandi-a72f8.firebaseapp.com",
    databaseURL: "https://houseofmandi-a72f8.firebaseio.com",
    projectId: "houseofmandi-a72f8",
    storageBucket: "houseofmandi-a72f8.appspot.com",
    messagingSenderId: "155182840813",
    appId: "1:155182840813:web:51ad3963e27ad92b1745e4",
    measurementId: "G-544CTZVNE2"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
