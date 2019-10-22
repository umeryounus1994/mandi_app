import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController, ActionSheetController, LoadingController, Platform, NavController, AlertController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { map, take } from 'rxjs/operators';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AuthService } from '../providers/auth.service';
import { CartService } from '../providers/cart.service';
import { Network } from '@ionic-native/network/ngx';
import { AngularFirestore } from 'angularfire2/firestore';
import { HelperService } from '../providers/helper.service';
import { TranslateService } from '@ngx-translate/core';

declare var WifiWizard2: any;
@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  type;
  barId;
  specificBar;
  barImages = [];
  openingHours;
  currentday;
  noImage = false;
  shishaCard = false;
  foodCard = false;
  drinksCard = false;
  userId;
  favourited = "no";
  favRecordExist;
  favouriteId;
  showMenuException = false;
  showCart = false;
  cartItems=[]
  items=""
  flagbadge=true;
  wifibutton = false;
  wifiName=""
  wifiPassword=""
  allServices=[]
  oh1;oh2;oh3;oh4;oh5;oh6;oh7;
  barName;
  constructor(private navCtrl: NavController, private helper: HelperService, private translate: TranslateService,
    private location: Location, private toastController: ToastController, private actionSheetController: ActionSheetController, private route: ActivatedRoute,
    private api: ApiService, private loadingCtrl: LoadingController, private callNumber: CallNumber, private platform: Platform,
    private auth : AuthService, private cart : CartService, private network: Network, private alertCtrl: AlertController, 
    private diagnostic: Diagnostic,private afs : AngularFirestore) {
    if(this.wifiName == null || this.wifiName == "" || this.wifiPassword == null || this.wifiPassword == ""){
      this.wifibutton = false;
    }
    else{
      this.wifibutton = true;
    }
      
    this.route.params.subscribe(params => {
      this.barId = params['id'];
    });
    
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == "login") {
      this.userId = JSON.parse(localStorage.getItem("data")).uid;
    }
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    this.currentday = weekday[d.getDay()];
  }
  showButton=false
  ionViewDidEnter() {
    if(this.wifiName == null || this.wifiName == "" || this.wifiPassword == null || this.wifiPassword == ""){
      this.wifibutton = false;
    }
    else{
      this.wifibutton = true;
    }
    this.cart.getCartItems(this.barId).then(data => {
      this.cartItems = data;
      if (this.cartItems !== null) {
        if (this.cartItems.length >= 0) {
          this.items = this.cartItems.length.toString();
        }
        else {
          this.flagbadge = false;
        }
      }
    })
    var today = new Date();
    this.currentDate = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    this.yy = today.getFullYear();
    if (this.mm < 10) {
      this.month = this.mm;
      this.mm = '0' + this.mm
    } else {
      this.month = this.mm
    }

    this.dateExport = this.month + "-" + this.yy;
    var orderDate = this.currentDate + "-" + this.month + "-" + this.yy;
    console.log(orderDate)

    this.afs.collection('userOrders', ref => ref.where("barId", "==", this.barId)
    .where("orderDate", "==", orderDate)).snapshotChanges()
    .pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data1 => {
      
      this.allArray = data1;
      var foundElement;
      this.allArray.forEach(element => {
        if(element.status == 'pending' || element.status == 'completed'){
          foundElement = element;
        } 
      });
      
      if(this.allArray.length < 1){
        this.showButton=false;
      }
      if(this.allArray.length > 0 && foundElement){
         
        if(foundElement.status == "pending" || foundElement.status == 'completed' && JSON.parse(localStorage.getItem('timer')) == null){
          this.showButton=true;
        }
      }
      if(foundElement && foundElement.status == 'paid'){
        this.showButton = false;
      }
      if(JSON.parse(localStorage.getItem('timer')) != null){
      if(JSON.parse(localStorage.getItem('timer')).timerbarId == this.barId){
        this.showButton = false;
      }
    } 
    });

  }

  ngOnInit() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
    else {
    this.presentLoading();
    this.api.getSingleBar(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.specificBar = data;
      this.barName = this.specificBar[0].barName
      /*--------------- wifi data -------------------------*/
      
     this.wifiName=this.specificBar[0].wifiName
     this.wifiPassword=this.specificBar[0].wifiPassword

     /*------------------- wifi password ----------------- */
      var barUserId = this.specificBar[0].userId;
      this.auth.saveBarUserId(barUserId);
      this.api.getSingleBarPackage(barUserId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        const d = data;
        if(d[0].packageId == "8n3g") {
          this.showCart = true;
        }
      });


    })
    this.api.getBarImages(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.barImages = data;
      if (this.barImages.length < 1) {
        this.noImage = true;
      } else {
        this.noImage = false;
      }
    });
    this.api.getOpeningHours(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.openingHours = data;
      this.oh1= this.openingHours[0].oh1;
      this.oh2= this.openingHours[0].oh2;
      this.oh3= this.openingHours[0].oh3;
      this.oh4= this.openingHours[0].oh4;
      this.oh5= this.openingHours[0].oh5;
      this.oh6= this.openingHours[0].oh6;
      this.oh7= this.openingHours[0].oh7;
    });
    this.api.checkMenuItems(this.barId, "Shishakarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
    
      if (data.length > 0) {
        this.shishaCard = true;
      } else {
        this.shishaCard = false;
      }
    });

    this.api.checkMenuItems(this.barId, "Getrankekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if (data.length > 0) {
        this.drinksCard = true;
      } else {
        this.drinksCard = false;
      }
    });
    this.api.checkMenuItems(this.barId, "Speisekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {

      if (data.length > 0) {
        this.foodCard = true;
      } else {
        this.foodCard = false;
      }
     
    });
    this.api.getServices(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.allServices=data

    });
    if (this.type == "login") {
      this.api.checkFavourite(this.barId, this.userId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if (data.length > 0) {
          this.favouriteId = data[0].favouriteId;
          this.favRecordExist = "yes";
          this.favourited = data[0].status;
        } else {
          this.favRecordExist = "no";
          this.favourited = "no";
        }
      })
    }
    var _this = this;
    this.loadingCtrl.dismiss();
  }
  }

  MakeCall() {
    this.callNumber.callNumber(this.specificBar[0].phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  OpenMap() {
    if (this.platform.is('ios')) {
      window.open("maps://?q=" + this.specificBar[0].lat_lng, "_system");
    } else {
      let label = encodeURI('My Label');
      window.open("geo:?q=" + this.specificBar[0].lat_lng, "_system");
    }
  }
  /*shareSocial() {
    this.socialShare.shareViaWhatsApp("Check this bar: " , null, "smartout://home/barProfile/" + this.barId)
      .then((done) => {
        console.log(done);
      })
      .catch((error) => {
        console.log(error);
      });
  }*/

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 1500, 
    });
    return await loading.present();
  }

  navigateCart(barId): void {
    if (this.type == "login") {
      this.navCtrl.navigateForward(['location/order/cart', barId]);
    } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
  }

  navigateShishaCard(): void {
    this.navCtrl.navigateForward(["location/card/shisha", this.barId]);
  }

  navigateDrinksCard(): void {
    this.navCtrl.navigateForward(["location/card/drinks", this.barId]);
  }

  navigateFoodsCard(): void {
    this.navCtrl.navigateForward(["location/card/foods", this.barId]);
  }

  // toastController for not logged in users
  async toastNotLoggedIn() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.notLoggedInMessage'),
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
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
              this.diagnostic.switchToWifiSettings();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async toastOrder() {
    const toast = await this.toastController.create({
      message: 'Deine Bestellung wird verarbeitet.',
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  async toastWifiError() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.noWifiMessage'),
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  connectWifi(){
    //For testing, use panel and put your own SSID and Password
    if(this.platform.is('android')){
       WifiWizard2.connect(this.wifiName, "yes",this.wifiPassword , "WPA", "NO" ) 
    }
    else if(this.platform.is('ios')){
       WifiWizard2.iOSConnectNetwork(this.wifiName,this.wifiPassword);
       }  
    //If wifi not available in the bar or wifi's ssid or password wrong
    setTimeout(() => {
      if(this.network.type != 'wifi'){
        this.toastWifiError();
      }
    }, 8000);
    
  } 
  buttons : any=[]

  createButtons() {
    let buttons = [];
    for (let index in this.allServices) {
      let button = {
        text: this.allServices[index].service,
        handler: () => {
          this.createZeroOrder(this.allServices[index].serviceId, this.allServices[index].service)
         
          return true;
        }
      }
      buttons.push(button);
    }
    let b = {
      text: this.translate.instant('GENERAL.cancel'),
      role : 'cancel',
      handler: () => {
            }
    }
    buttons.push(b)
    return buttons;
  }

  async presentServices() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant('ALERT.freeServicesHeader'),
      buttons: this.createButtons()
    });
    await actionSheet.present();
  }
  currentDate;
  mm;yy;month;dateExport;
  allArray=[]
  finalPrice;
  hours;
  minutes;
  d;orderDAta;
  username;
  x=1;
  createZeroOrder(serviceId,serviceName){
   
    this.username = JSON.parse(localStorage.getItem("uname")).name;
    var today = new Date();
    this.currentDate = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    this.yy = today.getFullYear();
    if (this.mm < 10) {
      this.month = this.mm;
      this.mm = '0' + this.mm
    } else {
      this.month = this.mm
    }

    this.dateExport = this.month + "-" + this.yy;
    var orderDate = this.currentDate + "-" + this.month + "-" + this.yy;

    var h = today.getHours();
    if (h < 10) {
      this.hours = "0" + h
    } else {
      this.hours = h
    }
    var min = today.getMinutes();
    if (min < 10) {
      this.minutes = "0" + min;
    } else {
      this.minutes = min;
    }
    var time = this.hours + ":" + this.minutes;


    this.orderDAta = {
      barId: this.barId,
      dateExport: this.dateExport,
      orderDate: orderDate,
      orderTime: h + ":" + this.minutes,
      orderId: this.helper.makeid(),
      tableNo: "",
      userId: this.userId,
      userName: this.username,
      userOrderId: "",
      comments : ""
    }


    this.afs.collection('userOrders', ref => ref.where("barId", "==", this.barId)
    .where("orderDate", "==", orderDate)).snapshotChanges()
    .pipe(take(1),map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data1 => {
      
      this.allArray = data1;
      var foundElement;
      var lastOrder;
      this.allArray.forEach(element => {
        if(element.status == 'pending' || element.status == 'completed'){
          foundElement = element;
        } 
      });

      this.afs.collection('orders', ref => ref.where("userOrderId", "==", foundElement.userOrderId))
      .snapshotChanges()
      .pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data1 => {
        data1.forEach(element => {
            var time = element.orderTime.replace(":",".");
            element.oTime = time;
        });
        data1.sort(this.compare);
        if(data1.length > 1){
           lastOrder = data1[data1.length -1];
        } else {
           lastOrder = data1[0];
        }
  
      if (this.allArray.length > 0) {
        var oldId = foundElement.userOrderId;
        if (foundElement.status == "pending" || foundElement.status == "completed") {
          this.finalPrice = parseFloat(foundElement.total);
          this.hours = today.getHours();
          var min = today.getMinutes();
          this.minutes = "";
          if (min < 10) {
            this.minutes = "0" + min;
          } else {
            this.minutes = min;
          }

          this.d = {
            status: "pending",
            total: this.finalPrice,
            orderTime: this.hours + ":" + this.minutes,
          }
         
          if(this.x==1){
         console.log('a')

          this.api.updateOrder(foundElement.userOrderId, this.d).then(updated => {
           
            this.orderDAta.userOrderId = oldId;
             
                  var d = {
                    itemId : serviceId,
                    item: serviceName,
                    orderId: lastOrder.orderId,
                    status: "pending",
                    page : "",
                    orderDetailId: this.helper.makeid()
                  }
                 
                 
                this.api.createOrderDetails(d.orderDetailId, d).then(added => {
                  
                  this.auth.saveTimerBarId(this.barId)
                  this.auth.timerFunction();
                  this.showButton=false;
                  this.toastOrder();
                  this.x++;
                  return false;
                  
                })
        })
      }
      }
  }
});
});
}
compare( a, b ) {
  if ( a.oTime < b.oTime ){
    return -1;
  }
  if ( a.oTime > b.oTime ){
    return 1;
  }
  return 0;
}

}
