import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Platform, AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NetworkService } from '../providers/network.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { map } from 'rxjs/operators';
import { ApiService } from '../providers/api.service';
import { AuthService } from '../providers/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartService } from '../providers/cart.service';
import { IonRefresher } from '@ionic/angular';
import { isDefaultChangeDetectionStrategy } from '@angular/core/src/change_detection/constants';
import { Network } from '@ionic-native/network/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotifyService } from '../providers/notify.service';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
 
export class HomePage implements OnInit {
  @ViewChild("refresherRef") refresherRef: IonRefresher;

  latitude;
  longitude;
  allBars = [];
  bars = [];
  image;
  subscription;
  barName;
  bName;
  a = 0;
  type;
  userId;
  allnews = []
  other = []
  unread=false;

  categories = [
    {
      cName: 'Breakfast',
      categoryName : 'Breakfast',
      image: 'assets/images/breakfast.jpg'
    },
    {
      cName: 'Lunch',
      categoryName : 'Lunch/Dinner',
      image: 'assets/images/lunch.jpg'
    },
    {
      cName: 'Dinner',
      categoryName : 'Lunch/Dinner',
      image: 'assets/images/dinner.jpg'
    },
    {
      cName: 'Sides',
      categoryName : 'Sides',
      image: 'assets/images/sides.jpg'
    },
    {
      cName: 'Deserts',
      categoryName : 'Desserts',
      image: 'assets/images/deserts.jpg'
    },
    {
      cName: 'Family Platters',
      categoryName : 'Family Platters',
      image: 'assets/images/family_platters.jpg'
    },
    {
      cName: 'Shared Platters',
      categoryName : 'Shared Platters',
      image: 'assets/images/mix_platter.jpg'
    },
    {
      cName: 'Private Rooms',
      categoryName : 'Private Rooms',
      image: 'assets/images/room2.jpg'
    },
    {
      cName: 'Catering',
      categoryName : 'Catering',
      image: 'assets/images/catering.jpg'
    },
    
  ]

  constructor(private translate: TranslateService, private router: Router, private location: Location, private platform: Platform,
    public network: NetworkService, private diagnostic: Diagnostic, private geolocation: Geolocation, private network1: Network,
    public alertCtrl: AlertController, private api: ApiService, public loadingCtrl: LoadingController,
    public auth: AuthService, private navCtrl: NavController, private afs: AngularFirestore,
    public cart: CartService, private toastController: ToastController, private notify: NotifyService, private toast: ToastController) {
      this.type = JSON.parse(localStorage.getItem('data')).viewType;
      this.unread = JSON.parse(localStorage.getItem('unreaded'));
     }

  ngOnInit() {
    this.unread = JSON.parse(localStorage.getItem('unreaded'));
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == 'login') {
      this.userId = JSON.parse(localStorage.getItem('data')).uid;
    }
  }

  async notifyToast(body){ 
    const toast = await this.toast.create({
      message: body, 
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present(); 
}

  ionViewDidEnter() {
      this.notify.getToken()

      // Listen to incoming messages
      this.notify.listenToNotifications().pipe(
        tap(msg => {
          if(msg.body){
             this.notifyToast(msg.body)
          }
        })
      )
      .subscribe()

    // });
    this.unread = JSON.parse(localStorage.getItem('unreaded'));
    
    if(localStorage.getItem("pg") != undefined){
    var page = JSON.parse(localStorage.getItem("pg")).page;
    if(page == "news") {
      this.unread=false
      localStorage.setItem('unreaded', 'false'); 
      localStorage.removeItem("pg")

      localStorage.removeItem("pg")
    }
    }
}
  getBar(barName) {
    this.bName = barName
  }
  i=0;
  b=0;
  

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
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      showBackdrop: true,
      duration: 2000,
    });
    return await loading.present();
  }

  navigateProfile(): void {
    this.navCtrl.navigateForward('profile');
  }

  async toastNotLoggedIn() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.notLoggedInMessage'),
      duration: 4000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  navigateMenu(category): void {
    if(category === 'Dinner'){
      category = 'Lunch'
    }
    //this.navCtrl.navigateForward('profile/' + barId);
    this.auth.saveCategory(category);
    this.router.navigate(['search']);
  }

  navigateSearch(): void {
    localStorage.removeItem('category');
    this.navCtrl.navigateForward('search');
  }

  slideOpts = {
    direction: "vertical",
    slidesPerView: 3
  };

}
