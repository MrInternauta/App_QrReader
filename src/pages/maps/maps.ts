import { Component } from '@angular/core';
import {   NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  lat: number;
  lng: number;


  constructor( public navParams: NavParams,
               private viewCtrl: ViewController ) {

  //geo:9.976133040865312,-84.00677479055173
//info = info.replace(":",",");
//let informacion = info.split(",");

    let coordsArray = this.navParams.get("coords");
     coordsArray =  coordsArray.replace("geo:", "");
    let informacion = coordsArray.split(",");

    this.lat = Number(informacion[0]);
    this.lng =Number(informacion[1]);



    console.log(  this.lat, this.lng );

  }


  cerrar_modal(){
    this.viewCtrl.dismiss();
  }


}
