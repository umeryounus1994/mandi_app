import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CartService {
 CART_KEY = '';
 barName;
 bName;
 a=0;
 type;
 userId;
 allnews=[]
 other=[]
 unread=false;
  constructor(public storage : Storage,private route: ActivatedRoute, private api : ApiService,
    private afs : AngularFirestore) {
    this.type = JSON.parse(localStorage.getItem('data')).viewType;
      if(this.type == 'login') {
        this.userId = JSON.parse(localStorage.getItem('data')).uid;
      }
   }

  addToCart(product) {
    this.CART_KEY = product.userId;
    return this.getCartItems(this.CART_KEY).then(result => {
      if (result) {
        result.push(product);
          return this.storage.set(this.CART_KEY, result);
      

      } else {
        return this.storage.set(this.CART_KEY, [product]);
      }
    })
}
removeFromCart(product,cart_key) {
  return this.getCartItems(cart_key).then(result => {
    if (result) {
      var productIndex = result.indexOf(product);
      result.splice(productIndex, 1);
      return this.storage.set(cart_key, result);
    }
  })
}

removeAllCartItems(cart_key) {
  return this.storage.remove(cart_key).then(res => {
    return res;
  });
}


containsObject(obj, list): boolean {
  if (!list.length) {
    return false;
  }

  if (obj == null) {
    return false;
  }
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].itemId == obj.itemId) {
      return true;
    }
  }
  return false;
}



getCartItems(cart_key) {
  return this.storage.get(cart_key);
}
}
