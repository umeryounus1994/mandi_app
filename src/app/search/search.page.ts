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
  constructor(private network1: Network, private router: Router, private navCtrl: NavController, private location: Location, private api : ApiService, private loadingCtrl : LoadingController,
    private afs : AngularFirestore, private platform: Platform,private network: NetworkService,private geolocation: Geolocation,
    private auth : AuthService, private alertCtrl : AlertController, private diagnostic : Diagnostic, private translate: TranslateService) {

   }

  navigateLocation(barId): void {
    //this.navCtrl.navigateForward('profile');
    this.router.navigate(['location',barId]);
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

    const $two = this.afs.collection("userbars", ref => ref.limit(20).orderBy('barName').startAt(start).endAt(end)).valueChanges();
    const $one = this.afs.collection('userbars', ref => ref.limit(20).orderBy('city').startAt(start).endAt(end)).valueChanges();

    return combineLatest($one,$two).pipe(
        map(([one, two]) => [...one, ...two])
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
        this.bars = [];
        this.allbars = [];
       this.bars = data;


       this.bars.forEach(element => {
         if(element.status == 'active'){
           this.barFound++;
         }
       });

       if(this.barFound > 0) {
        this.nomessage = false;
        this.nobars = false;
      } else {
        this.nomessage = false;
        this.nobars = true;
      }

      if(this.bars.length < 1){
        this.nomessage = false;
        this.nobars = true;
      }
       
       this.bars.map(item => {
        var lat_lng = item.lat_lng.split(",");
        var destinattion_lat = lat_lng[0];
        var destinattion_lng = lat_lng[1];
        if(item.barImage != "") {
          this.image = item.barImage;
        } else {
          this.image = "assets/images/sample.png";
        }
        return {
          barId : item.barId,
          barName : item.barName,
          image : this.image,
          city : item.city,
          status : item.status,
          dist: this.distance(this.latitude,this.longitude,destinattion_lat,destinattion_lng,"K"),
          addedBy : item.userId
        };
    }).forEach(item =>  {
      if(item.status == 'active') {
        this.api.getUserAccountInfo(item.addedBy).pipe(map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })).subscribe(data => {
          if(data[0].status == 'active'){
            this.allbars.push(item);
          }
        });
      }
    });
   
    this.allbars.sort(function(a,b) {
      return a.dist - b.dist;
    });
      })
      
    }
    else {
      this.nomessage = true;
      this.nobars = false;
      this.allbars = [];
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
    this.nomessage = true;
    this.nobars = false;
    this.allbars = [];
  }
  onCancel(val)
  {
    console.log("a");
  }

}
