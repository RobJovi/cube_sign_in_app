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
    first_name: "",
    last_name: "",
    email:"",
    phone_number:"",
    school:"",
    img_url: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.application = {
      signed_in: false,
      first_name: "",
      last_name: "",
      email:"",
      phone_number:"",
      school:"",
      img_url: ""
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  next(){
    this.navCtrl.push(PictureFormPage,{data:this.application});
  }

}
