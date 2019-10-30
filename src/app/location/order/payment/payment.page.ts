import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AuthService } from '../../../providers/auth.service';
import { Platform, LoadingController, AlertController, ToastController, NavController } from '@ionic/angular';
import { ApiService } from '../../../providers/api.service';
import { CartService } from '../../../providers/cart.service';
import { map, take } from 'rxjs/operators';
import { Device } from '@ionic-native/device/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkService } from 'src/app/providers/network.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  CART_KEY;
  price: any;
  currentDate;
  mm;
  yy;
  month;
  dateExport;
  userId;
  username;
  i = 0;
  b = 0;
  x = 0;
  finalPrice = 0;
  deviceModel;
  myListener;
  currentPage;
  allArray = []
  priceToAdd = 0;
  nfc_enabled = false;
  comments=""
  foundElement : any;
  constructor(private network1: Network, private router: Router, private location: Location, private nfc: NFC, private ndef: Ndef, private route: ActivatedRoute,
    private auth: AuthService, private plt: Platform, private api: ApiService, private cart: CartService,
    private dev: Device, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private toastController: ToastController,
    private afs: AngularFirestore, private network: NetworkService, private platform: Platform,
    private diagnostic: Diagnostic, private navCtrl: NavController) { 
  
    this.route.params.subscribe(params => {
      this.CART_KEY = params['id'];
    });
    this.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.username = JSON.parse(localStorage.getItem("uname")).name;
    this.price = this.auth.price.toFixed(2)
    var today = new Date();
    this.currentDate = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    this.yy = today.getFullYear();
    if(JSON.parse(localStorage.getItem("comments")).comments) {

      this.comments = JSON.parse(localStorage.getItem("comments")).comments;
    }


    if (this.mm < 10) {
      this.month = this.mm;
      this.mm = '0' + this.mm
    } else {
      this.month = this.mm
    }

    this.dateExport = this.month + "-" + this.yy;
    var orderDate = this.currentDate + "-" + this.month + "-" + this.yy;
    this.afs.collection('userOrders', ref => ref.where("orderedBy", "==", this.userId))
    .snapshotChanges()
      .pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data1 => {
       
        this.allArray = data1;
        console.log(this.allArray)
        // this.allArray.sort(function (a, b) {
        //   return a.orderTime - b.orderTime;
        // });

        data1.forEach(element => {
          if(element.status == 'pending' || element.status == 'completed'){
            this.foundElement = element;
          }
        });
       
      });
  }

  navigateToOrderEnd(): void {
    this.navCtrl.navigateRoot("/home/barProfile/order/confirmation");
  }
  shisha=[]
  result:any
  allValues=[]
  ngOnInit() {
    var split = this.router.url.split("/");
    this.currentPage = split[4];
    this.deviceModel = this.dev.model;

    this.cart.getCartItems(this.CART_KEY).then((val) => {
      if(val.length > 0) {
       // console.log(val)
        this.result = val;
       
    }
    // this.loadingCtrl.dismiss();
    })
   
   
  }

  async permissions(header, messsage) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: messsage,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
           this.router.navigate(['home']);
          }
        }
      ]
    });
    await alert.present();
  }

  minutes;
  d;
  hours;
  minutessss;
  userOrders;
  orderDAta;

  ReadTag() {

    this.auth.nfcREad = true;
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

    

    this.userOrders = {
      dateExport: this.dateExport,
      orderDate: orderDate,
      orderTime: time.toString(),
      orderedBy: this.userId,
      status: "pending",
      total: this.price,
      userName: this.username,
      userOrderId: this.makeid()
    }
    this.orderDAta = {
      dateExport: this.dateExport,
      orderDate: orderDate,
      orderTime: h + ":" + this.minutes,
      orderId: this.makeid(),
      userId: this.userId,
      userName: this.username,
      userOrderId: this.userOrders.userOrderId,
      comments : this.comments
    }

        // NFC Scan has started loading
        this.presentLoading();
            
            if(this.b < 1){
              this.presentLoading();
              var userId = this.userId;
     
              if (this.allArray.length > 0) {
                const specificData = this.foundElement;
                if(specificData != undefined){
                  var oldId = specificData.userOrderId;
                if (specificData.status == "pending" || specificData.status == "completed") {
                  this.finalPrice = parseFloat(specificData.total) + parseFloat(this.price);
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

                  this.x++
        

                  this.api.updateOrder(specificData.userOrderId, this.d).then(updated => {

                    this.orderDAta.userOrderId = oldId;
                    this.api.createOrder(this.orderDAta.orderId, this.orderDAta).then(done1 => {

                      this.cart.getCartItems(this.CART_KEY).then((val) => {

                        val.forEach(sh => {
                          var d = {
                            itemId : sh.itemId,
                            item_price: sh.price,
                            item: sh.name,
                            orderId: this.orderDAta.orderId,
                            status: "pending",
                            page : sh.page,
                            orderDetailId: this.makeid()
                          }
                          if (this.i < val.length) {
                            this.api.createOrderDetails(d.orderDetailId, d).then(added => {

                              this.i++;
                            })
                          }
                        })
                        this.b++;

                        this.loadingCtrl.dismiss();
                        this.auth.nfcREad = false;
                        this.currentPage = ""
                        this.cart.removeAllCartItems(this.CART_KEY);
                        this.permissions('Order', 'Order has been placed');
                        this.CART_KEY = ""
                        return false;

                      })
                    })

                  })
                } else {
                
                  this.api.createUserOrder(this.userOrders.userOrderId, this.userOrders).then(done => {

                    this.api.createOrder(this.orderDAta.orderId, this.orderDAta).then(done1 => {

                      this.cart.getCartItems(this.CART_KEY).then((val) => {

                        val.forEach(sh => {
                          var d = {
                            itemId : sh.itemId,
                            item: sh.name,
                            orderId: this.orderDAta.orderId,
                            status: "pending",
                            item_price: sh.price,
                            page : sh.page,
                            orderDetailId: this.makeid()
                          }
                          if (this.i < val.length) {
                            this.api.createOrderDetails(d.orderDetailId, d).then(added => {
                              this.i++;
                            })
                          }
                        })
                        this.b++;
                        this.loadingCtrl.dismiss()
                        this.auth.nfcREad = false;
                        this.currentPage = "";
                        this.cart.removeAllCartItems(this.CART_KEY);
                       this.permissions('Order', 'Order has been placed');
                        this.CART_KEY = ""
                        return false;
                      })
                    })
                  })
                }
                } else {
                
                  this.api.createUserOrder(this.userOrders.userOrderId, this.userOrders).then(done => {

                    this.api.createOrder(this.orderDAta.orderId, this.orderDAta).then(done1 => {

                      this.cart.getCartItems(this.CART_KEY).then((val) => {

                        val.forEach(sh => {
                          var d = {
                            itemId : sh.itemId,
                            item: sh.name,
                            orderId: this.orderDAta.orderId,
                            status: "pending",
                            item_price: sh.price,
                            page : sh.page,
                            orderDetailId: this.makeid()
                          }
                          if (this.i < val.length) {
                            this.api.createOrderDetails(d.orderDetailId, d).then(added => {
                              this.i++;
                            })
                          }
                        })
                        this.b++;
                        this.loadingCtrl.dismiss()
                        this.auth.nfcREad = false;
                        this.currentPage = "";
                        this.cart.removeAllCartItems(this.CART_KEY);
                        this.permissions('Order', 'Order has been placed');
                        this.CART_KEY = ""
                        return false;
                      })
                    })
                  })
                }
                
              } else {
                // this.presentLoading("Processing Order");
                this.api.createUserOrder(this.userOrders.userOrderId, this.userOrders).then(done => {
                  this.api.createOrder(this.orderDAta.orderId, this.orderDAta).then(done1 => {
                    this.cart.getCartItems(this.CART_KEY).then((val) => {

                      val.forEach(sh => {
                        var d = {
                          itemId : sh.itemId,
                          item: sh.name,
                          orderId: this.orderDAta.orderId,
                          status: "pending",
                          item_price: sh.price,
                          page : sh.page,
                          orderDetailId: this.makeid()
                        }
                        if (this.i < val.length) {
                          this.api.createOrderDetails(d.orderDetailId, d).then(added => {
                            this.i++;
                          })
                        }
                      })
                      this.b++;
                      this.loadingCtrl.dismiss()
                      this.auth.nfcREad = false;
                      this.currentPage = "";
                      this.cart.removeAllCartItems(this.CART_KEY);
                      this.permissions('Order', 'Order has been placed');
                      this.CART_KEY = ""
                      return false;
                    })
                  })
                })
              }
            }
          

  }
  
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 25; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: null,
      duration: 2000,
    });
    return await loading.present();
  }

  async toastSuccessAlertCart(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

}
