import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../providers/cart.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  
  CART_KEY;

  constructor(private router: Router, private navCtrl: NavController, private route : ActivatedRoute,private cart : CartService) {
    this.route.params.subscribe(params => {
      this.CART_KEY = params['id'];
    });
    this.cart.removeAllCartItems(this.CART_KEY).then(done => {
      console.log("done");
    })

   }

  navigateHome(): void {
    this.navCtrl.navigateRoot("/home");
  }

  ngOnInit() {
  }

}
