import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Network } from '@ionic-native/network/ngx';
import { ApiService } from '../../../providers/api.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  email;
  constructor(private api : ApiService, private network: Network, private location: Location, private toastController: ToastController, private navCtrl: NavController, private translate: TranslateService) { }

  ngOnInit() {
  }

  reset() {
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    }
else{
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(this.email)
      .then(() => {
        this.toastSuccessAlert();

      }).catch((error) => {
        this.toastFailAlert();
      })
  }
}

  // If sending the password reset was successfully
  async toastSuccessAlert() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.successPasswordReset'),
      duration: 4000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();

    this.navCtrl.navigateBack('/start/login');
  }

  // If sending the password reset was not successfully
  async toastFailAlert() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.successPasswordReset'),
      duration: 6000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();

    this.navCtrl.navigateRoot('/start');
  }

}
