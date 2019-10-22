import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NetworkService } from './providers/network.service';
import { CartService } from './providers/cart.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { Device } from '@ionic-native/device/ngx';

import { Vibration } from '@ionic-native/vibration/ngx';
import { Network } from '@ionic-native/network/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotifyService } from './providers/notify.service';
import { Firebase } from '@ionic-native/firebase/ngx'; 
import {NgxMaskModule} from 'ngx-mask'
import { TextMaskModule } from 'angular2-text-mask';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    IonicStorageModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    BrMaskerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Diagnostic,
    Geolocation,
    CallNumber,
    InAppBrowser,
    NFC,
    Ndef,
    Device,
    {provide: FirestoreSettingsToken, useValue: {} },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CartService,
    Vibration,
    Network,
    // LocalNotifications,
    NotifyService,
    Firebase
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
