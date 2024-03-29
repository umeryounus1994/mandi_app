import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CartService } from '../../../providers/cart.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../providers/auth.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ApiService } from '../../../providers/api.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
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
  tableNo:'';
  
  constructor(private api: ApiService,private network: Network, private location: Location, public cart: CartService, private route: ActivatedRoute,
    private loadingCtrl: LoadingController, private auth : AuthService,
    private toastController: ToastController,private afs: AngularFirestore,
    private navCtrl: NavController, private vibration: Vibration) {
    this.route.params.subscribe(params => {
      this.CART_KEY = params['id'];
    });
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
    if (this.type == "login") {
      this.userId = JSON.parse(localStorage.getItem("data")).uid;
    }
    this.auth.saveComments("");
    this.auth.saveTable("");
    // $(document).ready(function () {
    //   $('.sPrice').mask('#.##0,00', {reverse: true});
    //   $('.total').mask('#.##0,00', {reverse: true});
    // });
    
  }

  
  pro;
  remove(product,index) {
    this.shisha.splice(index,1);
    // if(product.page == "breakfast") {
     
    // } 
    // if(product.page == "lunch") {
    //   this.drinks.splice(index,1);
    // } 
    // if(product.page == "Speisekarte") {
    //   this.foods.splice(index,1);
    // } 
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
  async toastMenuItem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  navigatePayment(): void {
    if(this.tableNo === ''){
      this.toastMenuItem('Select Table');
    }
    this.afs.collection('userOrders', ref=>ref.where('tableNo','==',this.tableNo).where('status','==','pending')).snapshotChanges()
    .pipe(
      map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )
    .subscribe(data => {
     if(data.length > 0){
      this.toastMenuItem('Select Another Table. This table has ongoing order right now');
     } else {
      this.auth.saveTable(this.tableNo);
      this.navCtrl.navigateForward(["location/order/payment",this.CART_KEY]);
     }
    });

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
        this.shisha.push(sh);
        // if(sh.page == "breakfast") {
         
        // }
        // if(sh.page == "lunch") {
        //   this.drinks.push(sh);
        // }
        // if(sh.page == "Speisekarte") {
        //   this.foods.push(sh);
        // }
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
