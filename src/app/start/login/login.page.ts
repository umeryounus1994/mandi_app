import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../providers/auth.service';
import { ApiService } from '../../providers/api.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  register_data = {
    email: '',
    password: ''
  };
  userData : any;
  constructor(private network: Network, private location: Location, private auth : AuthService,private api : ApiService,
    public loadingCtrl: LoadingController,public alertCtrl: AlertController, private navCtrl: NavController, private translate: TranslateService) {
      if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
        this.api.toastInternet();
      }
  
     }

    async showDialogue(header,messsage) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: messsage,
        buttons: [this.translate.instant('GENERAL.done')]
      });
  
      await alert.present();
  }

  async login_confirm(header,message) {
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
      spinner: null,
      showBackdrop: true,
      duration: 2000,
    });
    return await loading.present();
  }

  Login() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
else{
    if(this.register_data.email === "" && this.register_data.password === "") {
      this.showDialogue(this.translate.instant('ALERT.failInputHeader'),this.translate.instant('ALERT.failInputMessage'));
    } else {
      this.auth.login(this.register_data.email, this.register_data.password).then(user => {

        this.presentLoading();
        this.userData = user;
        
        this.api.getUserAccountInfo(this.userData.user.uid).pipe(map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })).subscribe(data => {
        
          if(data[0].status == 'disable'){
            this.loadingCtrl.dismiss()
            this.showDialogue(this.translate.instant('ALERT.blockHeader'),this.translate.instant('ALERT.blockMessage'));
            return false;
          } else {
          this.auth.saveLocalTokens(this.userData.user.uid,"","user","login");
          this.loadingCtrl.dismiss()
          this.auth.saveUserName(data[0].firstname)
          this.auth.savePreviousPage("login");
          this.navCtrl.navigateRoot('/home');
          }
        });
      }).catch(error  => {
        this.showDialogue("Login",error.message);
      })
    }
  }
  }

  navigateHome(): void {
    this.navCtrl.navigateRoot('/home');
  }

  navigatePasswordReset(): void {
    this.navCtrl.navigateForward('/start/login/passwordReset');
  }

  skip() {
    this.auth.saveLocalTokens("","","user","guest");
    this.navCtrl.navigateRoot('/home');
  }

  ngOnInit() { }

}
