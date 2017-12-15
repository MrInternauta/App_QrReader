import { Component } from '@angular/core';

import { InicioPage } from '../inicio/inicio';
import { RecientesPage } from '../recientes/recientes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tab1: any;
  tab2: any;

  constructor(


  ) {
    this.tab1 = InicioPage;
    this.tab2 = RecientesPage;
  }

}
