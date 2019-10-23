import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../providers/api.service';

import { Subject } from 'rxjs';

import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkService } from '../providers/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, Platform, AlertController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../providers/auth.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchterm : string;
  startAt;
  endAt;
  bars=[];
  allbars=[];
  image;
  latitude;
  longitude;
  nobars = false;
  nomessage = true;
  categoryName = '';
  menuItems = [];
  allMenuItems = [];
  constructor(private network1: Network, private router: Router, private navCtrl: NavController, private location: Location, private api : ApiService, private loadingCtrl : LoadingController,
    private afs : AngularFirestore, private platform: Platform,private network: NetworkService,private geolocation: Geolocation,
    private auth : AuthService, private alertCtrl : AlertController, private diagnostic : Diagnostic, private translate: TranslateService) {
      if(localStorage.getItem('category') !== undefined || localStorage.getItem('category') !== null) {
        this.categoryName = JSON.parse(localStorage.getItem('category')).category;
        this.loadMenuItems(this.categoryName);
      }
   }

  navigateLocation(barId): void {
    //this.navCtrl.navigateForward('profile');
    this.router.navigate(['location',barId]);
  }
  loadMenuItems(category){
    this.afs.collection('menuitems',ref=>ref.where("page","==",category.toLowerCase())).snapshotChanges()
    .pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.menuItems = data;
        this.allMenuItems = data;
      }
    });
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      showBackdrop: true,
      duration: 2000,
    });
    return await loading.present();
  }

  ngOnInit() {
  }
  async permissions(header, messsage) {

    const alert = await this.alertCtrl.create({
      header: header,
      message: messsage,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            if(this.platform.is('android')){
              this.diagnostic.switchToLocationSettings();
            }
            else{
              window.location.reload();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  orQuery(start,end){

      const $one = this.afs.collection('menuitems', ref => ref.limit(20).orderBy('itemName').startAt(start).endAt(end)).valueChanges();
    return combineLatest($one).pipe(
        map(([one]) => [...one])
    )
}
  barFound=0;
  search($event) {
    let q = $event.target.value;
    if (q != '') {
      //this.nomessage = true;
      var n = q.toUpperCase();
      
      this.startAt = n;
      this.endAt = n + "\uf8ff";
      this.orQuery(this.startAt,this.endAt).subscribe(data => {
        this.menuItems = [];
       this.menuItems = data;

       if(this.menuItems.length > 0) {
        this.nomessage = false;
        this.nobars = false;
      } else {
        this.nomessage = false;
        this.nobars = true;
      }

      if(this.menuItems.length < 1){
        this.nomessage = false;
        this.nobars = true;
      }
      })
      
    }
    else {
      this.nomessage = true;
      this.nobars = false;
      this.menuItems = [];
    }
  }
  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist.toFixed(2);
    }
  }



  onClear(val)
  {
    console.log(this.allMenuItems);
    this.nomessage = true;
    this.nobars = false;
    this.menuItems = [];
    this.menuItems = this.allMenuItems;
  }
  onCancel(val)
  {
    console.log("a");
  }

}
