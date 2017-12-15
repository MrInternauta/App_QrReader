

export class ScanData{

  info:string;
  tipo:string;

  constructor( texto:string ){

    this.tipo = "No definido";
    this.info = texto;
    if( texto.startsWith("http") ){
      this.tipo = "HTTP";
    }else if( texto.startsWith("geo") ){
      this.tipo = "Mapa";
    }else if( texto.startsWith("BEGIN:VCARD") ){
      this.tipo = "Contacto";
    }else if( texto.startsWith("MATMSG") ){
      this.tipo = "Email";
    }
    else if( texto.startsWith("SMSTO") ){
      this.tipo = "SMS";
    }


  }

}
