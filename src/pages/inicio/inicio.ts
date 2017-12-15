import { Component, } from '@angular/core';
import {  NavController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {HistorialProvider} from '../../providers/historial/historial';
// Componentes
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  constructor(
    public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,

    private platform: Platform,
    private _historial:HistorialProvider ) {
      this._historial.cargar_datos();
  }



  scan(){
  console.log("Realizando scan...");
  if( !this.platform.is('cordova') ){
    return;
  }


  this.barcodeScanner.scan().then( (barcodeData) => {
   console.log("result:", barcodeData.text );
   console.log("format:", barcodeData.format );
   console.log("cancelled:", barcodeData.cancelled );

   if( barcodeData.cancelled == false && barcodeData.text != null ){
     this._historial.agregar_historial( barcodeData.text  );
   }


  }, (err) => {
      console.error("Error: ", err );
      this.mostrar_error( "Error: " + err );
  });

}

  mostrar_error(txt:string)
  {
   let alert = this.alertCtrl.create({
     title: "Error",
     subTitle: txt,
     buttons: [
        {
          text: 'Reiniciar Escaner QR',
          handler: data => {
            location.reload();
          }
        }

      ]
   });
   alert.present();
  }

  presentLoading()
  {
  let loader = this.loadingCtrl.create({
    content: "Cargando...",
    duration: 2000
  });
  loader.present();
  }

}
