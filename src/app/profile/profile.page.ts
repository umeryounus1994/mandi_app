import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../providers/auth.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ToastController, NavController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { ApiService } from '../providers/api.service';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public language : string;
  type;

  constructor(private translate: TranslateService, private platform: Platform, private api : ApiService, private network: Network, private router: Router, private navCtrl: NavController, private location: Location, private auth : AuthService, private iap : InAppBrowser, private toastController: ToastController) { 
    this.type = JSON.parse(localStorage.getItem("data")).viewType;
    if (this.network.type == '' || this.network.type == 'unknown' || this.network.type == 'ethernet' || this.network.type == 'cell_2g' || this.network.type == 'none') {
      this.api.toastInternet();
    } 
  }

  /**
   * Implement translation of page text once view has completed loading
   *
   * @public
   * @method ionViewDidLoad
   * @return {none}
   */
  public ionViewDidLoad() : void {
    this._initialiseTranslation();
  }

  /**
   * Capture the selected language from the component
   *
   * @public
   * @method changeLanguage
   * @return {none}
   */
  public changeLanguage() : void {
    this._translateLanguage();
  }

  /**
   * Implement the selected language via the Translate service
   *
   * @private
   * @method _translateLanguage
   * @return {none}
   */
  private _translateLanguage() : void {
    this.translate.use(this.language);
    this._initialiseTranslation();
  }

  private _initialiseTranslation() : void {
     
  }

  navigateStart(): void {
    this.api.getTokens(JSON.parse(localStorage.getItem("data")).uid).pipe(take(1),map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data1 => {
      console.log(data1);
      data1.forEach(element => {
        this.api.removeTokens(element.token).then(deleted => {

        })
      });
    });
    localStorage.clear();
    this.navCtrl.navigateRoot("/start");
  }

  navigateRegister(): void {
    this.navCtrl.navigateForward('/start/register');
  }

  navigateLogin(): void {
    this.navCtrl.navigateForward('/start/login');
  }

  navigateReceipts(): void {
    this.toastNotLoggedIn('Receipts are not available yet');
    // if(this.type == "login") {
    //   this.navCtrl.navigateForward('profile/receipts');
    // } else {
    //   this.toastNotLoggedIn();
    //   this.navCtrl.navigateRoot('/start');
    // }
  }

  navigateSettings(): void {
    if(this.type == "login") {
      this.navCtrl.navigateForward('profile/settings');
    } else {
      this.toastNotLoggedIn('You need to login first');
      this.navCtrl.navigateRoot('/start');
    }
  }

  impressum() {
    // const options : InAppBrowserOptions = {
    //   zoom : 'no',
      
    // }
    // const browser = this.iap.create('https://smartout.de/impressum','_blank',options);
  }
  datenschutz() {
    // const options : InAppBrowserOptions = {
    //   zoom : 'no'
    // }
    // const browser = this.iap.create('https://smartout.de/datenschutz','_blank',options);
  }
  nutzungsbedingungen() {
    // const options : InAppBrowserOptions = {
    //   zoom : 'no'
    // }
    // const browser = this.iap.create('https://smartout.de/nutzungsbedingungen','_blank',options);
  }
  sendMail() {
    var email = "info@houseofmandi.com";
    window.open('mailto:'+email,"_system");
  }

  // If user tries to use functionalities without login 
  async toastNotLoggedIn(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      showCloseButton: false,
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {
    
  }

  select(lng) {
    
  }

}
