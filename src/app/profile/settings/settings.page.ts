import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController, Platform, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ApiService } from '../../providers/api.service';
import { AuthService } from '../../providers/auth.service'; 
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public padding_left: any;
  type;
  userId;
  userData;
  register_data = {
    firstname: '',
    lastname: '',
    gender : '',
    dob : '',
    status : 'active'
  };

  constructor(private network: Network, public platform: Platform, private router: Router, private navCtrl: NavController, private location: Location, private toastController: ToastController,
    private api : ApiService, public auth : AuthService, private translate: TranslateService) {
      if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
        this.api.toastInternet();
      } else {
        this.type = JSON.parse(localStorage.getItem('data')).viewType;

        if(this.type == "login") {
          this.userId = JSON.parse(localStorage.getItem("data")).uid;
        }
        if(this.platform.is('ios')){
          this.padding_left = "0px";
        }
      }
   }

  // if changes were successfull
  async toastSuccessAlert() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.successUpdateMessage'),
      duration: 2000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
    this.navCtrl.navigateBack('profile')
  }

  // If changes won't be successfull
  async toastFailAlert() {
    const toast = await this.toastController.create({
      message: this.translate.instant('ALERT.failUpdateMessage'),
      duration: 6000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
    this.api.getUserAccountInfo(this.userId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.register_data.firstname = data[0].firstname;
      this.register_data.lastname = data[0].lastname;
      this.register_data.gender = data[0].gender;
      this.register_data.dob = data[0].dob;
      this.auth.saveUserName(this.register_data.firstname)
    })
  }

  update() {
    this.api.updateUserData(this.userId,this.register_data).then(updated => {
      this.toastSuccessAlert();
    }).catch(error => {
      this.toastFailAlert();
    })
  }

}
