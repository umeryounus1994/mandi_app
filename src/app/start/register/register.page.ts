import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 
import { Platform, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../../providers/auth.service';
import { ApiService } from '../../providers/api.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public color: any;

  public padding_left: any;
  register_data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    gender : '',
    dob : '',
    status : 'active',
    phone: '',
    address: ''
  };
  userData : any;
  constructor(private network: Network, private location: Location, public platform: Platform, private auth : AuthService,
    private api : ApiService, private afs : AngularFirestore,public loadingCtrl: LoadingController,public alertCtrl: AlertController,
    private iap :InAppBrowser, private navCtrl: NavController, private translate: TranslateService) {
      
    if(this.platform.is('ios')){
      this.padding_left = "0px";
    }
   }
  
  ngOnInit() {

  }


  async showDialogue(header,messsage) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: messsage,
        buttons: [this.translate.instant('GENERAL.done')]
      });
  
      await alert.present();
  }

  async register_confirm(header,message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
         {
          text: this.translate.instant('GENERAL.done'),
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner:"bubbles",
      showBackdrop: false,
      duration: 2000,
    });
    return await loading.present();
  }
  
  changecolor(){
    this.color = "white";
  }

  Register() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
    else {
    if(this.register_data.firstname === "" && this.register_data.lastname === "" && this.register_data.gender === undefined 
    && this.register_data.dob === "" && this.register_data.email === "" && this.register_data.password === "" &&
    this.register_data.phone === "" && this.register_data.address === "") {
      this.showDialogue('Signup','Please Fill all fields');
    } else {
      //this.api.addUser("a","b");
      this.auth.register(this.register_data.email, this.register_data.password).then(user => {
        this.presentLoading();
        this.userData = user;
        let data = {
          userId: this.userData.user.uid,
          email: this.register_data.email,
          password: this.register_data.password,
          accountType: 'user',
          firstname: this.register_data.firstname,
          lastname: this.register_data.lastname,
          gender : this.register_data.gender,
          dob : this.register_data.dob,
          status : "active",
          address: this.register_data.address,
          phone: this.register_data.phone
        };

        this.api.addUser(data.userId,data)
        .then(userAdded => {
          this.loadingCtrl.dismiss();
          this.register_confirm('Signup','Registered successfully');
          this.auth.saveLocalTokens(data.userId,"","user","login");
            this.auth.saveUserName(data.firstname)
        })
      }).catch(error  => {
        this.showDialogue("Failed",error.message);
      })
    }
  }
  }
  
  nutzungsbedingungen() {
    const options : InAppBrowserOptions = {
      zoom : 'no'
    }
    const browser = this.iap.create('https://benefast.ca/demo/rest_wb/about/','_self',options);
  }

  datenschutz() {
    const options : InAppBrowserOptions = {
      zoom : 'no'
    }
    const browser = this.iap.create('https://benefast.ca/demo/rest_wb/about/','_self',options);
  }

}
