import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';


@Component({
  selector: 'page-sign-out',
  templateUrl: 'sign-out.html',
})
export class SignOutPage {
  applications = [];
  searchList = [];
  loader: any;
  done = false;

  constructor(public file: File, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.pullInfo();
  }

  // pull information from database
  pullInfo() {
    // start the loader
    this.presentLoader();
    // pull information from database
    this.http.get('http://ec2-54-244-178-153.us-west-2.compute.amazonaws.com:3000/cubeApp/findSignedIn')
      .map(res => res.json())
      .subscribe(result => {
        this.applications = result.data;
        this.loadImgs(this.loadImgsCallback());
      }, err => {
        this.presentAlert(err);
      })
  }
  // check if images exists if not download it
  loadImgs(callback) {
    for (let i in this.applications) {
      this.file.checkFile(this.applications[i].local_img_url, this.applications[i].image_name)
        .then(result => {
          console.log("fetching local img");
          this.applications[i].current_img_src = this.applications[i].local_img_url;
        })
        .catch(err => {
          this.applications[i].current_img_src = this.applications[i].web_img_url;
        })
      if (i == String(this.applications.length - 1)) {
        callback;
      }
    }
  }
  // finish loading and display view
  loadImgsCallback() {
    this.resetSearchList();
    this.loader.dismiss();
    this.done = true;
  }
  // add all values to search list
  resetSearchList() {
    this.searchList = this.applications;
  }
  // search bar search event
  getItems(ev: any) {
    // Reset items back to all of the items
    this.resetSearchList();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.searchList = this.searchList.filter((item) => {
        return (item.first_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  // Create the user sign in record
  signOut(data) {
    // present sign in loader
    this.presentSignOutLoader();
    this.http.post('http://ec2-54-244-178-153.us-west-2.compute.amazonaws.com:3000/signIn/signOut', data)
      .map(res => res.json())
      .subscribe(result => {
        console.log(result)
        this.updateUserStatus(data);
      }, err => {
        console.log(err)
        this.presentSignOutAlert(err, data);
      })
  }
  // Update the user sign status
  updateUserStatus(data) {
    this.http.post('http://ec2-54-244-178-153.us-west-2.compute.amazonaws.com:3000/cubeApp/updateUserStatus-SignOut', data)
      .map(res => res.json())
      .subscribe(result => {
        this.loader.dismiss();
        this.presentSuccess();
        this.slackWebHook(data);
      }, err => {
        console.log(err);
      })
  }
  // present alerts on event api failure
  presentAlert(err) {
    // stop the loader
    this.loader.dismiss();
    console.log(err);
    var msg;
    if (err._body == "No Apps Found") {
      msg = "No Apps Found Please go back or try again."
    } else {
      msg = "Error pulling Txter Info Please go back or try again."
    }

    const alert = this.alertCtrl.create({
      title: 'Application Error',
      subTitle: msg,
      buttons: [
        {
          text: 'Go Back',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        },
        {
          text: 'Try Again',
          handler: () => {
            this.pullInfo();
          }
        }
      ]
    });
    alert.present();
  }
  // display loader
  presentLoader() {
    // Loader when saving img
    this.loader = this.loadingCtrl.create({
      content: "Pulling information from Database"
    });
    // present loader
    this.loader.present();
  }
  // present alerts on event api failure
  presentSignOutAlert(err, data) {
    // stop the loader
    this.loader.dismiss();
    console.log(err);
    var msg = "Error Signing Out, Please Try Again";

    const alert = this.alertCtrl.create({
      title: 'Application Error',
      subTitle: msg,
      buttons: [
        {
          text: 'Dismiss',
        },
        {
          text: 'Try Again',
          handler: () => {
            this.signOut(data);
          }
        }
      ]
    });
    alert.present();
  }
  // present sign in loader
  presentSignOutLoader() {
    // Loader when saving img
    this.loader = this.loadingCtrl.create({
      content: "Signing Out"
    });
    // present loader
    this.loader.present();
  }
  // SLACK SIGN IN NOTIFICATION
  slackWebHook(data) {
    // get current timestamp and convert to slack format
    var temp = +new Date();
    var date = Math.floor(temp / 1000);
    var datePayload = "<!date^"+ date +"^{date} at {time}|Today at Right Now>";
    // build full name string
    var name = data.first_name + " " + data.last_name;
    // build attachment payload
    var payload = {
      "attachments": [{
        "pretext": "Someone Just Signed Out!",
        "color": "#36a64f",
        "author_name": name,
        "author_icon": data.web_img_url,
        "text": datePayload,
        "mrkdwn_in": [
          "text",
          "pretext"
        ]
      }]
    }
    // turn payload into json string
    var temp1 = JSON.stringify(payload);
    // post the payload
    this.http.post('https://hooks.slack.com/services/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', temp1)
      .map(res => res.json())
      .subscribe(result => {
        console.log(result)
      }, err => {
        console.log(JSON.stringify(err))
      })
  }
  // present successful login
  presentSuccess() {  
      const alert = this.alertCtrl.create({
        title: 'Logout Succesful',
        subTitle: "Thank you for loggin out",
        buttons: [
          {
            text: 'Dismiss',
            handler: ()=>{
              this.navCtrl.setRoot(HomePage);
            }
          }
        ]
      });
      alert.present();
    }

}
