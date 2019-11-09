import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../providers/api.service';

import { Subject } from 'rxjs';

import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkService } from '../providers/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, Platform, AlertController, NavController, ToastController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../providers/auth.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../providers/cart.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
 
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
  items=""
  flagbadge=true;
  type;
  userId;
  cartItems=[];
  categories= [];
  selectValue='';
  all=[]
  constructor(private network1: Network, private router: Router, private navCtrl: NavController, private location: Location, private api : ApiService, private loadingCtrl : LoadingController,
    private afs : AngularFirestore, private platform: Platform,private network: NetworkService,private geolocation: Geolocation,
    private auth : AuthService, private alertCtrl : AlertController, private diagnostic : Diagnostic, private translate: TranslateService,
    private cart: CartService, private toastController: ToastController, private modalController: ModalController) {
      if(localStorage.getItem('category') !== undefined || localStorage.getItem('category') !== null) {
        this.categoryName = JSON.parse(localStorage.getItem('category')).category;
        this.loadMenuItems(this.categoryName);
      }
      this.type = JSON.parse(localStorage.getItem('data')).viewType;
      if (this.type == "login") {
        this.userId = JSON.parse(localStorage.getItem("data")).uid;
      }
   }

  navigateLocation(barId): void {
    //this.navCtrl.navigateForward('profile');
    this.router.navigate(['location',barId]);
  }
  loadMenuItems(category){
    this.afs.collection('categories',ref=>ref.where("categoryName","==",category)).snapshotChanges()
    .pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.categories = [];
        this.categories = data;
       if(this.categories.length>0){
        this.onSelectChange(this.categories[0].categoryId,this.categories[0]);
      }

      }
    });

  }

  addToCart(product) {
    if (this.type == "login") {
    let cartData = {
      itemId: product.itemId,
      name: product.itemName,
      categoryName : product.categoryName,
      page: product.page,
      price: product.price,
      userId: this.userId
    }
    this.cart.addToCart(cartData).then((val) => {
      this.toastMenuItem(this.translate.instant('ALERT.addToCartMessage'));
      this.cart.getCartItems(cartData.userId).then(data => {
        this.cartItems = data;
        if (this.cartItems !== null) {
          if (this.cartItems.length >= 0) {
            // this.badge1=true;
            this.items = this.cartItems.length.toString();
          }
          else {
            this.flagbadge = false;
          }
        }
      })
    });
  } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
  }

  ionViewDidEnter() {

    this.cart.getCartItems(this.userId).then(data => {
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

  }

  async toastMenuItem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  onSelectChange(selectedValue: any,index) {
    this.categories.forEach(element => {
      element.active = false;
    });
    index.active = !index.active;
    this.selectValue = selectedValue

    if (selectedValue != "all") {
      this.afs.collection('menuitems',ref=>ref.where("categoryId","==",selectedValue)).snapshotChanges().pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.menuItems = [];
        this.menuItems = data;
        this.menuItems.sort(function(a, b){
          var nameA=a.itemName.toLowerCase(), nameB=b.itemName.toLowerCase();
          if (nameA < nameB) //sort string ascending
           return -1;
          if (nameA > nameB)
           return 1;
          return 0; //default return value (no sorting)
         });
         this.allMenuItems=this.menuItems
      });
    } else {
      this.allMenuItems = [];
      this.allMenuItems = this.menuItems;
    }

  }

  navigateCart(userId): void {
    if (this.type == "login") {
      this.navCtrl.navigateForward(['location/order/cart', userId]);
    } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      showBackdrop: true,
      duration: 2000,
    });
    return await loading.present();
  }

  async toastNotLoggedIn() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.notLoggedInMessage'),
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
  //  this.cart.removeAllCartItems(this.userId)
    this.cart.getCartItems(this.userId).then(data => {
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
  }

  async viewImage(src: string, itemName: string, desc: string,price: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imgSource: src,
        imgTitle: itemName,
        imgDescription: desc,
        imgPrice: price
      },
      cssClass: 'modal-fullscreen',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

}
