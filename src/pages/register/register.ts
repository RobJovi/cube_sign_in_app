import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { PictureFormPage } from '../picture-form/picture-form';
import { Http } from '@angular/http';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  application = {
    signed_in: false,
    first_name: "Roberto",
    last_name: "Sanchez",
    email:"robb177@gmail.com",
    phone_number:"2133009188",
    school:"West Los Angeles College",
    img_url: "assets/img/placeholder.png"
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  next(){
    this.navCtrl.push(PictureFormPage,{data:this.application});
  }

}
