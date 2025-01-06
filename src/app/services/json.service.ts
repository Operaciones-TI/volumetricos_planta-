import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";

const VM_HTTP_URL = 'https://localhost:5001/api/';

// CABECERAS NECESARIAS PARA HACER LOS HTTP REQUEST A EL CONTROLADOR DEL APPI
const VM_HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Authorization': 'bearer ' + localStorage.getItem('token') }),
};

const VM_HTTP_HEADERS = {
  headers: new HttpHeaders().set('Authorization', 'bearer ' + localStorage.getItem('token')).set('Content-Type', 'application/json'),
}

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private url: string;

  constructor(private httpClient: HttpClient){
    // this.url = `${Global.url}json`
    this.url = `${VM_HTTP_URL}json`
  }

  ObtenerJSONDiario(iFecha: string, fFecha: string): Observable<any> {
    return this.httpClient.get(this.url + '?iFecha=' + iFecha + '&fFecha=' + fFecha, VM_HTTP_OPTIONS);
  }

  ObtenerJSONMensual(iFecha: string, fFecha: string, rfcC: string): Observable<any> {
    console.log('Consultando Json Mensual!!');
    // return this.httpClient.get(this.url + '/mensual' + '?iFecha=' + iFecha + '&fFecha=' + fFecha, VM_HTTP_OPTIONS);
    console.log(this.url + '/mensual' + '?iFecha=' + iFecha + '&fFecha=' + fFecha + '&rfcC=' + rfcC);
    return this.httpClient.get(this.url + '/mensual' + '?iFecha=' + iFecha + '&fFecha=' + fFecha + '&rfcC=' + rfcC, VM_HTTP_OPTIONS);
  }

  ObtenerJSONNombre(iFecha: string, fFecha: string): Observable<any> {
    return this.httpClient.get(this.url + '/nombre' + '?iFecha=' + iFecha + '&fFecha=' + fFecha, VM_HTTP_OPTIONS);
  }

  async ObtenerZipJSONInfo(iFecha: string, fFecha: string, zipName: string, dataJSON: any) {
    // Opciones por defecto estan marcadas con un *
    const url = this.url+ '/descargar' + '?iFecha=' + iFecha + '&fFecha=' + fFecha;
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(dataJSON.json) // body data type must match "Content-Type" header
    }).then((response) => response.blob())
    .then((myBlob) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(myBlob);
      element.download = zipName + '.zip';
      document.body.appendChild(element);
      element.click();

      let respSucces = {
        message: 'Exito!!',
      };
      return respSucces;
    });
  }
}
