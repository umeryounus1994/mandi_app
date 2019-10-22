import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { AuthService } from './providers/auth.service';
import { NetworkService } from './providers/network.service';
import { Router } from '@angular/router';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ApiService } from './providers/api.service';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  LoggedIn = false;
  location_enabled = false;
  userId
  i;
  constructor(private platform: Platform, private translate: TranslateService, private auth: AuthService,
    private router: Router, private navCtrl: NavController,
    //  private network: NetworkService,
    private api: ApiService) {

      this.platform.ready().then(() => {
        this._initTranslate();
        console.log(navigator.language.split('-')[0]);
      });

      this.i = 0;

      if (auth.getLocalTokens() == 'undefined' || auth.getLocalTokens() == null) {
        this.LoggedIn = false;
        this.navCtrl.navigateRoot('/start');
      } else {
        this.userId = JSON.parse(localStorage.getItem("data")).uid;
        var type = JSON.parse(localStorage.getItem('data')).viewType;
        this.LoggedIn = true;

        if (type === "login") {
          this.navCtrl.navigateRoot('/home');
        }
      }
  }
  
  dates = []

  private _initTranslate(){
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // }
    // else {
    //   this.translate.use('en'); // Set your language here
    // }
  }

  sortByDateDescAndTimeAscDateObj = function (lhs, rhs) {
    var results;

    results = lhs.notDate.getYear() < rhs.notDate.getYear() ? 1 : lhs.notDate.getYear() > rhs.notDate.getYear() ? -1 : 0;
    if (results === 0) results = lhs.notDate.getMonth() < rhs.notDate.getMonth() ? 1 : lhs.notDate.getMonth() > rhs.notDate.getMonth() ? -1 : 0;
    if (results === 0) results = lhs.notDate.getDate() < rhs.notDate.getDate() ? 1 : lhs.notDate.getDate() > rhs.notDate.getDate() ? -1 : 0;
    if (results === 0) results = lhs.notDate.getHours() > rhs.notDate.getHours() ? 1 : lhs.notDate.getHours() < rhs.notDate.getHours() ? -1 : 0;
    if (results === 0) results = lhs.notDate.getMinutes() > rhs.notDate.getMinutes() ? 1 : lhs.notDate.getMinutes() < rhs.notDate.getMinutes() ? -1 : 0;
    if (results === 0) results = lhs.notDate.getSeconds() > rhs.notDate.getSeconds() ? 1 : lhs.notDate.getSeconds() < rhs.notDate.getSeconds() ? -1 : 0;
    return results;
  }
}
