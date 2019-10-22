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
      categoryName : 'Breakfast',
      image: 'assets/images/breakfast.jpg'
    }
  ]

  constructor(private translate: TranslateService, private router: Router, private location: Location, private platform: Platform,
    public network: NetworkService, private diagnostic: Diagnostic, private geolocation: Geolocation, private network1: Network,
    public alertCtrl: AlertController, private api: ApiService, public loadingCtrl: LoadingController,
    public auth: AuthService, private navCtrl: NavController, private afs: AngularFirestore,
    public cart: CartService, private toastController: ToastController, private notify: NotifyService, private toast: ToastController) {
      // this.localNotifications.on('click');
      // this.userId = JSON.parse(localStorage.getItem('data')).uid;
      // this.localNotifications.on('add').subscribe (success=>{
      //   console.log("nothing");
      // })
      this.type = JSON.parse(localStorage.getItem('data')).viewType;
      this.unread = JSON.parse(localStorage.getItem('unreaded'));
     }

  ngOnInit() {
  
    this.unread = JSON.parse(localStorage.getItem('unreaded'));
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == 'login') {
      this.userId = JSON.parse(localStorage.getItem('data')).uid;
    }
    this.LoadNearByBars();
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

    // this.notify.getToken();
    // this.platform.ready().then(() => {

      // Get a FCM token
      console.log("userid",this.userId )
      
      this.notify.getToken()

      // Listen to incoming messages
      this.notify.listenToNotifications().pipe(
        tap(msg => {
          if(msg.body){
             this.notifyToast(msg.body)
          }
         
          // // show a toast
          // const toast = toastCtrl.create({
          //   message: msg.body,
          //   duration: 3000
          // });
          // toast.present();
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
    
    setInterval(() => {
      if(this.type == 'login') {
        this.api.getBarFavourites(this.userId).pipe(map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })).subscribe(data => {
          if(data.length > 0) {
            this.a++;
          
          data.map(item => {
            let ref = this.afs.collection('userbars').doc(item.barId);
            ref.get().subscribe(snapshot => {  //DocSnapshot
                  if (snapshot.exists) {
                      let post = snapshot.data()
                      this.barName = post.barName;
                      this.getNews(post.barId,this.barName);
                  } else {
                      // console.log("No such document!");
                  }  
            })   
        }).forEach(item => this.other.push(item));
        } else {
        }
        })
      }
    },100);
}
  getBar(barName) {
    this.bName = barName
  }
  i=0;
  b=0;
  
  getNews(barId,barName) {
    this.api.getBarNews(barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data1 => {
      if(data1.length > 0) {
        this.b++;

     data1.map(item => {
       if(item.status) {
         if(item.status == "unread") {
           this.unread = true;
           localStorage.setItem('unreaded', 'true'); 
         }
       }
       return {
        barId : item.barId,
        barName : barName,
        desc : item.description,
        image : item.imageFile,
        date : item.createdDate,
        time : item.createdTime,
        newsTime : item.createdDate + " " + item.createdTime
       }
     }).forEach(item => {
      this.allnews.push(item);
      this.i++;
     })
    }
    });
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
          }
        }
      ]
    });
    await alert.present();
  }

  LoadNearByBars() {
    this.presentLoading();
    this.afs.collection('categories').snapshotChanges().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      console.log(data);
      this.loadingCtrl.dismiss();
    })
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

  navigateLocation(barId): void {
    //this.navCtrl.navigateForward('profile/' + barId);
    this.router.navigate(['profile', barId]);
  }

  navigateSearch(): void {
    this.navCtrl.navigateForward('search');
  }

  slideOpts = {
    direction: "vertical",
    slidesPerView: 3
  };

}
