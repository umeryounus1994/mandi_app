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
import { HelperService } from 'src/app/providers/helper.service';
import { TranslateService } from '@ngx-translate/core';
declare var $ :any;
@Component({
  selector: 'app-foods',
  templateUrl: './foods.page.html',
  styleUrls: ['./foods.page.scss'],
})
export class FoodsPage implements OnInit {

  barId;
  recommended = [];
  categories = [];
  categoryId;
  menuItems = [];
  allmenuItems = [];
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
  a = 0;
  allItems = [];
  recommendedFavId = "";
  recommendedAlready = "no"
  fav = ""
  selectValue = ""
  all = []
  showCart = false;
  barUserId;
  cartItems=[]
  items = ""
  badge1 = false;
  badge2 = false;
  items1 = "";
  flagbadge = true;
  
  constructor(private router: Router, private location: Location, private toastController: ToastController, private translate: TranslateService,
    private route: ActivatedRoute, private api: ApiService, private loadingCtrl: LoadingController, public cartService: CartService, private navCtrl: NavController, private vibration: Vibration, private network: Network, private helper: HelperService) {
    this.route.params.subscribe(params => {
      this.barId = params['id'];
    });
  
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == "login") {
      this.userId = JSON.parse(localStorage.getItem("data")).uid;
    }
    this.barUserId =JSON.parse(localStorage.getItem('userId')).userId;
    // this.cartService.removeAllCartItems(this.barId).then(done => {

    // })
  }

  ionViewWillEnter() {
    this.cartService.getCartItems(this.barId).then(data => {
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
  }

  ngOnInit() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
    else {
    this.recommended = [];
    this.recommendedItemName = "";
    this.recommendedItemPrice = "";
    this.recommendedFav = "no";
    this.categories = [];
    this.allMenuItems = [];
    this.menuItems = [];
    this.i = 0;
    this.a = 0;
    this.allmenuItems = []
    this.presentLoading();
    this.api.getSingleBarPackage(this.barUserId).pipe(map((actions: any) => {
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
    this.api.getRecommendedItem(this.barId, "Speisekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.recommended = data;
      if (data.length > 0) {

        this.recommendedItemName = data[0].itemName;
        this.recommendedItemPrice = data[0].price;

        this.api.getRecommendedFavourite(this.barId, this.recommended[0].itemId, this.userId, "Speisekarte").pipe(map((actions: any) => {
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
    this.api.getCategories(this.barId, "Speisekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.categories = [];
      this.categories = data;
      this.categories.sort(function(a, b){
        var nameA=a.categoryName.toLowerCase(), nameB=b.categoryName.toLowerCase();
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
  b = 1;

  onSelectChange(selectedValue: any,index) {
    this.categories.forEach(element => {
      element.active = false;
    });
    index.active = !index.active;
    this.selectValue = selectedValue

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
      this.allMenuItems = this.all;
    }

  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 1000,
    });
    return await loading.present();
  }


  addToCart(product) {
    if (this.type == "login") {
    let cartData = {
      itemId: product.itemId,
      name: product.itemName,
      categoryName : product.categoryName,
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
    // this.cartService.getCartItems(product.barId).then(result => {
    //   if (result) {
    //     if (!this.cartService.containsObject(cartData, result)) {
         
    //     } else {
    //       this.toastFailAlertCart()
    //     }
    //   } else {
    //     this.cartService.addToCart(cartData).then((val) => {
    //       this.toastSuccessAlertCart();
    //     })
    //   }
    // });
  } else {
      this.toastNotLoggedIn();
      this.navCtrl.navigateRoot('/start');
    }
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
