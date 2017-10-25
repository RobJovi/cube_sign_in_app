import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { LoadingController } from 'ionic-angular';
import { ConfirmationPage } from '../confirmation/confirmation';

// upload imports
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import { AlertController } from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'page-picture-form',
  templateUrl: 'picture-form.html',
})
export class PictureFormPage {
  done = false;
  currentPhase = "Take Picture";
  img;
  imgSrc = "assets/imgs/placeholder.png";
  imgName;
  imgDATA;
  application;
  loader;

  constructor(public alertCtrl: AlertController, public http: Http, public loadingCtrl: LoadingController, private zone: NgZone, private file: File, private transfer: FileTransfer, private filePath: FilePath, private camera: Camera, public navCtrl: NavController, public navParams: NavParams) {

    this.application = this.navParams.get("data");

    this.imgName = this.application.first_name + this.application.last_name + this.generateImageName() + ".jpg";
  }
  // generates random name for the profile picture
  generateImageName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  // activates camera to take profile picture
  takePicture() {
    // camera options
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      cameraDirection: 1,
      targetHeight: 500,
      targetWidth: 500
    }
    this.camera.getPicture(options).then((imageData) => {
      // save path of cached in order to save later
      this.imgDATA = imageData
      this.imgSrc = imageData;
      this.currentPhase = "Retake Picture";
      this.done = true;
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }
  // alert message content
  presentUploadAlert(err) {
    console.log(err);
    this.loader.dismiss();
    let msg = "Error uploading Image Please try again."
    const alert = this.alertCtrl.create({
      title: 'Application Upload Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
    this.done = false;
  }
  // display loader
  presentLoader() {
    // Loader when saving img
    this.loader = this.loadingCtrl.create({
      content: "Saving Profile Picture"
    });
    // present loader
    this.loader.present();
  }
  // ALL UPLOAD FUNCTIONS  -----
  // resolves image path in order to save it locally in the saveImg() function
  resolvePath() {
    // start the loader
    this.presentLoader();
    // resolve the path of the cached image
    this.filePath.resolveNativePath(this.imgDATA)
      .then(imagePath => {
        // grab image name
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        // grab path of image
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.saveImg(correctPath, currentName, this.imgName)
      })
      .catch(err => this.presentUploadAlert(err))
  }
  // takes resolved path and image name and saves it locally
  saveImg(path, currentName, newName) {
    // take image and copy to app data storage
    this.file.copyFile(path, currentName, cordova.file.dataDirectory, newName).then(success => {
      this.application.local_img_url = success.nativeURL;
      // next upload image to server AWS
      this.uploadImg();

    }, error => {
      this.presentUploadAlert(error);
    });
  }
  // only uploads the image to the server
  uploadImg() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options = {
      fileKey: 'pic',
      fileName: this.imgName
    }
    fileTransfer.upload(this.application.local_img_url, 'http://10.0.2.2:3000/cubeApp/uploadProfilePic', options)
      .then((data) => {
        this.application.image_name = this.imgName;
        this.application.web_img_url = data.response;
        console.log(data.response);
        // next upload the application data
        this.uploadData();
      }, (err) => {
        this.presentUploadAlert(err);
      })
  }
  // uploads data for every app
  uploadData() {
    //http://ec2-54-244-178-153.us-west-2.compute.amazonaws.com:3000/cubeApp/saveApp
    this.http.post('http://10.0.2.2:3000/cubeApp/saveApp', this.application)
      .map(res => res.json())
      .subscribe(
      response => {
        // handle success
        console.log(JSON.stringify(response));
        // next transtion to next page
        this.transition();
      },
      error => {
        // handle failure
        console.log(JSON.stringify(error));
        this.presentUploadAlert(error);
      })
  }
  // transtion to confirmation page
  transition() {
    // dismiss loader
    this.loader.dismiss();
    this.navCtrl.push(ConfirmationPage, { data: this.application });
  }
}
