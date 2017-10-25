import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignInPage } from '../sign-in/sign-in';
import { Http } from '@angular/http';



@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {
  data;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get("data");
  }

  ionViewDidLoad() {
    this.data = this.navParams.get("data");
  }
  goHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
