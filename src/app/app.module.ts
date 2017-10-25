import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';

// pages
import { RegisterPage} from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { PictureFormPage } from '../pages/picture-form/picture-form';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignOutPage } from '../pages/sign-out/sign-out';

// providers - imports
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    PictureFormPage,
    ConfirmationPage,
    SignInPage,
    SignOutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    PictureFormPage,
    ConfirmationPage,
    SignInPage,
    SignOutPage
    ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
