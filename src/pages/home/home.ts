import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { SignInPage } from '../sign-in/sign-in';
import { SignOutPage } from '../sign-out/sign-out';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  register(){
    this.navCtrl.push(RegisterPage);
  }
  signIn(){
    this.navCtrl.push(SignInPage);
  }
  signOut(){
    this.navCtrl.push(SignOutPage);
  }
}
