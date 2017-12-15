import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms';
import { ScanData } from "../../models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { ModalController, Platform, ToastController, LoadingController } from "ionic-angular";
import { MapsPage } from "../../pages/maps/maps";
import { Storage } from '@ionic/storage';


@Injectable()
export class HistorialProvider {
  private _historial:ScanData[] = [];
  constructor( private iab: InAppBrowser,
               private modalCtrl: ModalController,
               private contacts: Contacts,
               private platform:Platform,
               public loadingCtrl: LoadingController,
               private toastCtrl:ToastController,
               private sms: SMS,
               private storage: Storage
             ) {

             }

  cargar_datos(){
    if(this.platform.is("cordova"))
    {
      this.storage.ready()
                  .then(()=>{
                    this.storage.get('datos').then((val) => {
                      if(val){
                      this._historial = val;
                    }
                    })
                  });
    }
    else
    {
        if(localStorage.getItem("datos") ){
          this._historial = JSON.parse(localStorage.getItem("datos"));
        }
      }
  }
  guardar_datos(){
    if(this.platform.is("cordova")){
      this.storage.ready()
                  .then(()=>{
                    this.storage.set("datos", this._historial)
                  });
    }
    else{

      localStorage.setItem("datos", JSON.stringify(this._historial));
    }
  }

  agregar_historial( texto:string )
  {
    this.cargando("Cargando...");
    let data = new ScanData( texto );
    this._historial.unshift( data );
    this.guardar_datos();
    console.log( this._historial );
    this.abrir_scan(0);
  }

  abrir_scan( index:number)
  {


    let scanData = this._historial[index];

    switch( scanData.tipo ){

      case "HTTP":

        this.iab.create( scanData.info, "_system" );

      break

      case "Mapa":

        this.modalCtrl.create( MapsPage, { coords: scanData.info })
            .present();

      break;

      case "Contacto":

          this.crear_contacto(  scanData.info );
          this.cargando("Contacto creado.");

      break;

      case "SMS":

          this.enviar_sms(scanData.info);
          this.cargando("Mensaje enviado.");

      break;

      case "Email":

        let htmlLink = scanData.info;
        htmlLink = htmlLink.replace("MATMSG:TO:","mailto:");
        htmlLink = htmlLink.replace(";SUB:", "?subject=");
        htmlLink = htmlLink.replace(";BODY:", "&body=");
        htmlLink = htmlLink.replace(";;", "");
        htmlLink = htmlLink.replace(/ /g, "%20");
        this.iab.create( htmlLink, "_system" );
      break;

      default:
        this.crear_toast("Texto encontrado: "+ scanData.info);
    }


  }

  private crear_contacto( texto:string )
  {

    let campos:any = this.parse_vcard( texto );
    console.log( campos );

    let nombre = campos['fn'];
    let tel    = campos.tel[0].value[0];


    if( !this.platform.is('cordova') ){
      console.warn("Estoy en la computadora, no puedo crear contacto.");
      return;
    }

    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, nombre );
    contact.phoneNumbers = [ new ContactField('mobile', tel ) ];

    contact.save().then(
      ()=> this.crear_toast("Contacto " + nombre + " creado!"),
      (error) => this.crear_toast( "Error: " + error )
    );
  }

  private crear_toast( mensaje:string ){

    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();

  }
  enviar_sms(info: string){
    info = info.replace("SMSTO:","");
    info = info.replace(":",",");
    let informacion = info.split(",");
    console.log( info);
    console.log(informacion);
    this.sms.send(informacion[0] ,informacion[1]);
  }


  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};



  cargar_historial(){
    return this._historial;
  }
  cargando(txt:string)
  {
    let loader = this.loadingCtrl.create({
      content: txt,
      duration: 1500
    });
    loader.present();
  }


}
