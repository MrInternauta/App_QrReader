import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InicioPage } from '../pages/inicio/inicio';
import { MapsPage } from '../pages/maps/maps';
import { RecientesPage } from '../pages/recientes/recientes';
import { HistorialProvider } from '../providers/historial/historial';
import { Contacts } from '@ionic-native/contacts';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SMS } from '@ionic-native/sms';
import { AgmCoreModule } from '@agm/core';
import { IonicStorageModule } from '@ionic/storage';





@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InicioPage,
    RecientesPage,
    MapsPage
  ],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule, AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCS2jDjPCea-eg436bJ-JRnhkC5y9uuNto'
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InicioPage,
    RecientesPage,
    MapsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Contacts,
    InAppBrowser,
    SMS,
    AgmCoreModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HistorialProvider
  ]
})
export class AppModule {}
