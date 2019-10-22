import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../../../providers/api.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { CartService } from '../../../providers/cart.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppComponent } from '../../../app.component';
import { HelperService } from 'src/app/providers/helper.service';
import { TranslateService } from '@ngx-translate/core';
declare var $ :any;
@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.page.html',
  styleUrls: ['./drinks.page.scss'],
})
export class DrinksPage implements OnInit {

  barId;
  recommended;
  categories = [];
  categoryId;
  menuItems = [];
  recommendedItemName;
  recommendedItemPrice;
  type;
  userId;
  allMenuItems = [];
  i = 0;
  recommendedFav = "no";
  favouriteId;
  favRecordExist;
  favourited = "no";
  allItems = []
  all = []
  fav = ""
  a = 0;
  recommendedFavId = "";
  recommendedAlready = "no"
  selectValue = ""
  showCart = false;
  barUserId;
  cartItems = []
  items1 = ""
  flagbadge = true;
  items = ""
  constructor(private router: Router, private helper: HelperService, private location: Location, private toastController: ToastController, private translate: TranslateService,
    private route: ActivatedRoute, private api: ApiService, private loadingCtrl: LoadingController,
    public cartService: CartService, private navCtrl: NavController, private vibration: Vibration, private network: Network) {
    this.route.params.subscribe(params => {
      this.barId = params['id'];
    });

    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == "login") {
      this.userId = JSON.parse(localStorage.getItem("data")).uid;
    }
    this.barUserId = JSON.parse(localStorage.getItem('userId')).userId;
  }

  ionViewWillEnter() {
    this.cartService.getCartItems(this.barId).then(data => {
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

  ngOnInit() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
    else {
      this.recommended = "";
      this.recommendedItemName = "";
      this.recommendedItemPrice = "";
      this.recommendedFav = "no";
      this.categories = [];
      this.allMenuItems = [];
      this.menuItems = [];
      this.i = 0;
      this.a = 0;
      this.all = []
      this.presentLoading();
      this.api.getSingleBarPackage(this.barUserId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        const d = data;
        if (d[0].packageId == "8n3g") {
          this.showCart = true;
        }
      });
      this.api.getRecommendedItem(this.barId, "Getrankekarte").pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.recommended = data;
        if (this.recommended.length > 0) {
          this.recommendedItemName = this.recommended[0].itemName;
          this.recommendedItemPrice = this.recommended[0].price;

          this.api.getRecommendedFavourite(this.barId, this.recommended[0].itemId, this.userId, "Getrankekarte").pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
            if (data.length > 0) {
              this.recommendedFavId = data[0].favId
              this.recommendedFav = data[0].favourited;
              this.recommendedAlready = "yes";
            } else {
              this.recommendedFavId = ""
              this.recommendedFav = "no"
              this.recommendedAlready = "no"
            }
          });
        } else {
          this.recommendedItemName = "";
          this.recommendedItemPrice = "";
        }
      })
      this.api.getCategories(this.barId, "Getrankekarte").pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.categories = [];
        this.categories = data;
        this.categories.sort(function (a, b) {
          var nameA = a.categoryName.toLowerCase(), nameB = b.categoryName.toLowerCase();
          if (nameA < nameB) //sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; //default return value (no sorting)
        });
        this.categories.forEach(element => {
          element.active = false;
       });
       if(this.categories.length>0){
         this.onSelectChange(this.categories[0].categoryId,this.categories[0]);
       }
       $(document).ready(function () {
        $('.sPrice').mask('#.##0,00', {reverse: true});
      });
  
  

      })
      if (this.type == "login") {
        this.favourited = "";
        this.favRecordExist = "no"
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
      this.loadingCtrl.dismiss();
    }


  }
  onSelectChange(selectedValue: any,index) {
    this.menuItems = [];
    this.allItems = [];
    this.allMenuItems = [];
    this.selectValue = selectedValue;
    this.categories.forEach(element => {
      element.active = false;
    });
    index.active = !index.active;

    if (selectedValue != "all") {
      this.api.getMenuItemsBasedOnCategory(selectedValue).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.menuItems = [];
        this.allItems = [];
        this.allMenuItems = [];
        this.menuItems = data;
        this.menuItems.sort(function (a, b) {
          var nameA = a.itemName.toLowerCase(), nameB = b.itemName.toLowerCase();
          if (nameA < nameB) //sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; //default return value (no sorting)
        });
        this.allMenuItems = this.menuItems
      });
    } else {
      this.allMenuItems = [];
      this.allMenuItems = this.all;
    }
  }

  updateonce = false;
  allitems = []

  addToCart(product) {
    if (this.type == "login") {
      let cartData = {
        itemId: product.itemId,
        name: product.itemName,
        categoryName: product.categoryName,
        page: product.page,
        price: product.price,
        barId: product.barId
      }
      this.cartService.addToCart(cartData).then((val) => {
        this.toastMenuItem(this.translate.instant('ALERT.addToCartMessage'));
        this.cartService.getCartItems(cartData.barId).then(data => {
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
      this.vibration.vibrate(50);
    } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 1000,
    });
    return await loading.present();
  }

  disabledAlert() {
    this.toastMenuItem(this.translate.instant('ALERT.outOfStockMessage'))
  }

  navigateCart(barId): void {
    if (this.type == "login") {
      this.router.navigate(['location/order/cart', barId]);
    } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
  }

  // toastController for bar favorite
  async toastBarFavorite(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  // toastController for menu items
  async toastMenuItem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
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

}
