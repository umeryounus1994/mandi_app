import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CartService } from '../../../providers/cart.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../../../providers/auth.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ApiService } from '../../../providers/api.service';
declare var $ :any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  type;
  userId;
  shisha = []
  drinks = []
  foods = []
  CART_KEY = "";
  nobasket = false;
  totalPrice = 0;
  totalPrice1 : any;
  totalPrice2 : any;
  istPrice = true;
  secondPrice = false;
  finalPrice = ""
  finalP : any;
  
  constructor(private api: ApiService,private network: Network, private location: Location, public cart: CartService, private route: ActivatedRoute,
    private loadingCtrl: LoadingController, private auth : AuthService, private navCtrl: NavController, private vibration: Vibration) {
    this.route.params.subscribe(params => {
      this.CART_KEY = params['id'];
    });
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == "login") {
      this.userId = JSON.parse(localStorage.getItem("data")).uid;
    }
    this.auth.saveComments("")
    $(document).ready(function () {
      $('.sPrice').mask('#.##0,00', {reverse: true});
      $('.total').mask('#.##0,00', {reverse: true});
    });
    
  }

  
  pro;
  remove(product,index) {
    if(product.page == "breakfast") {
      this.shisha.splice(index,1);
    } 
    if(product.page == "Getrankekarte") {
      this.drinks.splice(index,1);
    } 
    if(product.page == "Speisekarte") {
      this.foods.splice(index,1);
    } 
    this.istPrice = false
    this.secondPrice = true
    var pro = product.price;
    this.totalPrice = this.totalPrice - parseFloat(pro)
    
    this.totalPrice1 = this.totalPrice.toFixed(2);
    this.auth.price = 0;
    this.auth.price = this.totalPrice;
    this.totalPrice1 = this.totalPrice;
    if(this.totalPrice1.toString().indexOf(".") !== -1) {
      this.totalPrice1 = this.totalPrice1.toFixed(2).toString().replace(".",",");
    } else {
      this.totalPrice1 = this.totalPrice1 + ",00";
    }
    let x = this.totalPrice1.indexOf('-');
    if(x > -1){
      this.totalPrice1 = this.totalPrice1.substring(x+1,this.totalPrice1.length);
    }
    this.vibration.vibrate(50);
    this.cart.removeFromCart(product,this.userId).then(deleted => {
    })
  }

  navigatePayment(): void {
    this.navCtrl.navigateForward(["location/order/payment",this.CART_KEY]);
  }

  ngOnInit() {
    // this.presentLoading();
    this.cart.getCartItems(this.CART_KEY).then((val) => {
      if(val.length > 0) {
       console.log(val);
      val.forEach(sh => {
        
        this.totalPrice = this.totalPrice + parseFloat(sh.price);
        this.finalPrice = ""
        this.finalPrice = ""+this.totalPrice;

        if(sh.page == "breakfast") {
          this.shisha.push(sh);
        }
        if(sh.page == "Getrankekarte") {
          this.drinks.push(sh);
        }
        if(sh.page == "Speisekarte") {
          this.foods.push(sh);
        }
      })
      
      // if(this.totalPrice.toString().indexOf('.') !== -1) {
      //  this.finalP = this.totalPrice.toString().replace(".",",");
      // } else {
      //   this.finalP = this.totalPrice + ",00";
      // }
      this.finalP = this.totalPrice.toFixed(2);
      // $(document).ready(function () {
      //   $('.sPrice').mask('#.##0,00', {reverse: true});
      //   $('.total').mask('#.##0,00', {reverse: true});
      // });
      // if(this.finalP.toString().indexOf('.') != -1) {
      //   this.finalP = this.finalP.toString().replace(".",",");
      // } else {
      //   this.finalP = this.finalP.toString() + ",00";
      // }
      this.auth.price = 0;
      this.auth.price = this.totalPrice
      this.totalPrice1 =this.totalPrice
    } else {
      this.nobasket = true;
    }
    // this.loadingCtrl.dismiss();
    })

  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 1000
    });
    return await loading.present();
  }
  
  comments(value) {
    this.auth.saveComments(value)
  }

}
