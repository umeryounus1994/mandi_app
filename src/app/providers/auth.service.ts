import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  price=0;
  nfcREad = false;
  timeLeft;
  constructor(private afAuth : AngularFireAuth) { 
   
  }

  timerFunction(){
    localStorage.setItem('start','yes');
    setInterval(() => {
      
      if(localStorage.getItem('start') == 'yes'){
      var d = new Date(); //get current time
      var seconds = d.getMinutes() * 60 + d.getSeconds(); //convet current mm:ss to seconds for easier caculation, we don't care hours.
      var fiveMin = 60 * 5; //five minutes is 300 seconds!
      this.timeLeft = fiveMin - seconds % fiveMin; // let'
      if(this.timeLeft == 1){
        localStorage.removeItem('timer');
        localStorage.removeItem('start');
        return false;
      }
    }
  }, 500)
  }

  login(email,password) {
   return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  }

  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  getAuthToken(){
    let token=localStorage.getItem('token');
    return this.afAuth.auth.signInAndRetrieveDataWithCustomToken(token);
  }

  saveLocalTokens(uid, token, accountType, viewType){
    let data = { "uid":uid, "token":token, "accountType":accountType, 'viewType' : viewType }; 
      localStorage.setItem('data',JSON.stringify(data));
  }
  saveUserName(name) {
    let n = {
      "name" : name
    }
    localStorage.setItem('uname',JSON.stringify(n));
  }

  getLocalTokens(){
    return JSON.parse(localStorage.getItem('data'));
  }
  clearLocalTokens(){
    return localStorage.removeItem('data');
  }
  saveBarUserId(userId) {
    let d = {
      "userId" : userId
    }
    localStorage.setItem('userId',JSON.stringify(d));
  }

  savePreviousPage(page) {
    let d = {
      "page" : page
    }
    localStorage.setItem('page',JSON.stringify(d));
  }
  saveNewsCounter(counter) {
    let n = {
      "news" : counter
    }
    localStorage.setItem('news',JSON.stringify(n));
  }

  saveOldCounter(counter) {
    let n = {
      "news" : counter
    }
    localStorage.setItem('old',JSON.stringify(n));
  }
  savePage(page) {
    let d = {
      "page" : page
    }
    localStorage.setItem('pg',JSON.stringify(d));
  }
  saveComments(comments) {
    let d = {
      "comments" : comments
    }
    localStorage.setItem('comments',JSON.stringify(d));
  }

  saveTimerBarId(barId){
    let d = {
      "timerbarId" : barId
    }
    localStorage.setItem('timer',JSON.stringify(d));
  }
}
