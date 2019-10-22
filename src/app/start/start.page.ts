import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../providers/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private router: Router, private auth: AuthService, private navCtrl: NavController) { }

  ngOnInit() {}

  navigateRegister(): void {
    this.navCtrl.navigateForward('/start/register');
  }

  navigateLogin(): void {
    this.navCtrl.navigateForward('/start/login');
  }

  navigateHome() {
    this.auth.saveLocalTokens("","","user","guest");
    this.navCtrl.navigateRoot('/home');
  }

}
