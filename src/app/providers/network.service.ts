import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  location_enabled = false;
  nfc_enabled = false;

  constructor(private platform: Platform,
    private api: ApiService, private afs: AngularFirestore,
    private auth: AuthService, private diagnostic: Diagnostic) {

    // if (this.platform.is('android')) {
    //   let modelSuccessCallBack = (locationMode) => {
    //     if (this.diagnostic.locationMode.HIGH_ACCURACY) {
          
    //       this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
    //     }
    //     if (this.diagnostic.locationMode.BATTERY_SAVING) {
          
    //       this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
    //     }
    //     if (this.diagnostic.locationMode.DEVICE_ONLY) {
         
    //       this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
    //     }
    //     if (this.diagnostic.locationMode.LOCATION_OFF) {
         
    //       this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);

    //     }
    //   }
    //   let successCallback = (isAvailable) => {
       
    //     if (isAvailable) {
    //       this.location_enabled = true;
    //     } else {
    //       this.location_enabled = false;
    //     }
    //   }
    //   let errorCallback = (e) => console.error(e);
    //   let modelErrorCallBack = (e) => console.error(e);

    //   // let network = setInterval(() => {
    //     this.diagnostic.getLocationMode().then(modelSuccessCallBack).catch(modelErrorCallBack);

    //   // }, 100);
    // }

    // else {

    //   let successCallback = (isAvailable) => { 
    //     if(isAvailable) {
    //       this.location_enabled = true;
    //     }
    //     else{
    //       this.location_enabled = false;
    //     }
    //    }
    //   let errorCallback = (e) => console.error(e);

    //   // let network = setInterval(() => {
    //     this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
     
    //   // }, 100);

    // }
    // //NFC..
    //   let succcessCallBackNFC = (isAvailable) => {
    //         if (isAvailable) {
    //           this.nfc_enabled = true;
    //         }
    //         else {
    //           this.nfc_enabled = false;

    //         }
    //       }
    //       let errorCallBackNFC = (e) => console.error(e);
    // // let nfc = setInterval(() => {
    //   this.diagnostic.isNFCEnabled().then(succcessCallBackNFC).catch(errorCallBackNFC);
    // // }, 100);



  }
}