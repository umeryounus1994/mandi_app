import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public toastController: ToastController, private afs : AngularFirestore) { }
  
  public async toastInternet( ) {
    const toast = await this.toastController.create({
      message: "Bitte überprüfe deine Internetverbindung.", 
      showCloseButton: true,
      position: 'top'
    });
    toast.present();
  }
  
  addUser(id, data) {
     return this.afs.doc('users/'+id).set(data);
  }
  getLastOrder(userId) {
    return this.afs.collection('userOrders', ref=>ref.where('orderedBy','==',userId)).snapshotChanges();
  }
  getOrderStatus(orderId) {
    return this.afs.collection('userOrders', ref=>ref.where('userOrderId','==',orderId)).snapshotChanges();
  }
  getOrdersDetails(orderId){
    return this.afs.collection('orders', ref=>ref.where('userOrderId','==',orderId).orderBy("orderTime","desc")).snapshotChanges();
  }
  getAllOrderOnOrderId(orderId) {
    return this.afs.collection('orderDetails', ref=>ref.where('orderId','==',orderId)).snapshotChanges();
  } 
  getAllBars() {
    return this.afs.collection('userbars',ref=>ref.where('status','==','active')).snapshotChanges();
  }
  getSearchBars(start,end) {
    return this.afs.collection('userbars', ref => ref.limit(20).orderBy('barName').startAt(start).endAt(end)).valueChanges();
  }
  getSingleBar(barId) {
    return this.afs.collection('userbars',ref=>ref.where('status','==','active').where("barId","==",barId)).snapshotChanges();
  }
  getSingleBarPackage(userId) {
    return this.afs.collection('user_packages',ref=>ref.where('userId','==',userId)).snapshotChanges();
  }
  getBarImages(barId){
    return this.afs.collection('barImages',ref=>ref.where("barId","==",barId)).snapshotChanges();
  }
  getOpeningHours(barId) {
    return this.afs.collection('bar_openinghours',ref=>ref.where("barId","==",barId)).snapshotChanges();
  }
  checkMenuItems(barId, page) {
    return this.afs.collection('menuitems',ref=>ref.where("barId","==",barId).where("page","==",page)).snapshotChanges();
  }
  getRecommendedItem(barId, page) {
    return this.afs.collection('menuitems',ref=>ref.where("barId","==",barId).where("page","==",page).where("make","==","yes")).snapshotChanges();
  }
  getCategories(barId, page) {
    return this.afs.collection('categories',ref=>ref.where("barId","==",barId).where("page","==",page)).snapshotChanges();
  }
  getMenuItemsBasedOnCategory(categoryId) {
    return this.afs.collection('menuitems',ref=>ref.where("categoryId","==",categoryId)).snapshotChanges();
  }
  getAllMenuItemsSpecificPage(barId,page) {
    return this.afs.collection('menuitems',ref=>ref.where("barId","==",barId).where("page","==",page).where("make","==","no")).snapshotChanges();
  }
  favouriteBar(favId,data) {
    return this.afs.doc('barfavourites/'+favId).set(data);
  }
  updateFavouriteBar(favId,data) {
    return this.afs.doc('barfavourites/'+favId).update(data);
  }
  checkFavourite(barId,userId) {
    return this.afs.collection('barfavourites',ref=>ref.where("barId","==",barId).where("userId","==",userId)).snapshotChanges();
  }
  getBarFavourites(userId) {
    return this.afs.collection('barfavourites',ref=>ref.where("userId","==",userId).where("status","==","yes")).snapshotChanges();
  }
  getBarNews(barId) {
    return this.afs.collection('news',ref=>ref.where("barId","==",barId)).snapshotChanges();
  }
  getUserAccountInfo(userId) {
    return this.afs.collection('users',ref=>ref.where("userId","==",userId)).snapshotChanges();
  }
  updateUserData(userId,data) {
    return this.afs.doc('users/'+userId).update(data);
  }
  getFavouriteItem(barId,itemId,userId,page) {
    return this.afs.collection('favourite_items',ref=>ref.where("userId","==",userId).where("barId","==",barId).where("itemId","==",itemId).where("pageName","==",page)).snapshotChanges();
  }
  getRecommendedFavourite(barId,itemId,userId,page) {
    return this.afs.collection('favourite_items',ref=>ref.where("userId","==",userId).where("barId","==",barId).where("itemId","==",itemId).where("pageName","==",page)).snapshotChanges();
  }
  favouriteItem(favId,data) {
    return this.afs.doc('favourite_items/'+favId).set(data);
  }
  updateFavouriteItem(favId,data) {
    return this.afs.doc('favourite_items/'+favId).update(data);
  }
  getFavouriteBars(userId){
    return this.afs.collection('barfavourites',ref=>ref.where('userId','==',userId).where("status","==","yes")).snapshotChanges();
  }
  getBarInfo(barId) {
    let ref = this.afs.collection('userbars').doc(barId);
    return ref.get();
  }
  getPageFavouriteItems(userId,page) {
    return this.afs.collection('favourite_items',ref=>ref.where("userId","==",userId).where("pageName","==",page).where("favourited","==","yes")).snapshotChanges();
  }
  getSingleMenuItem(itemId) {
    let ref = this.afs.collection('menuitems').doc(itemId);
    return ref.get();
  }
  getCategoryPrice(categoryId) {
    let ref = this.afs.collection('categories').doc(categoryId);
    return ref.get();
  }
  createUserOrder(orderId,data) {
    return this.afs.doc('userOrders/'+orderId).set(data);
  }
  createOrder(orderId,data) {
    return this.afs.doc('orders/'+orderId).set(data);
  }
  createOrderDetails(orderId,data) {
    return this.afs.doc('orderDetails/'+orderId).set(data);
  }
  checkAlreadyPlacedOrder(barId,userId,tableNo,orderDate) {
    return this.afs.collection('userOrders',ref=>ref.where("orderDate","==",orderDate).where('orderedBy','==',userId).where("barId","==",barId).where("tableNo","==",tableNo).orderBy("orderTime","desc")).snapshotChanges();
    //return this.afs.collection('userOrders',ref=>ref.where('orderedBy','==',userId).where("barId","==",barId).where("tableNo","==",tableNo).where("orderDate","==",orderDate).orderBy("orderTime","desc").limit(5)).snapshotChanges();
  }
  updateOrder(orderId,data) {
    return this.afs.doc('userOrders/'+orderId).update(data);
  }
  checkSingleOrder(orderId) {
    return this.afs.collection('userOrders',ref=>ref.where('userOrderId',"==",orderId)).snapshotChanges()
  }
  updateNews(newsId,data) {
    return this.afs.doc('news/'+newsId).update(data);
  }
  getTokens(userId){
    return this.afs.collection('devices',ref=>ref.where('userId','==',userId)).snapshotChanges()
  }
  removeTokens(token){
    return this.afs.doc('devices/'+token).delete();
  }

  getServices(barId){
    return this.afs.collection('services',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  
}
