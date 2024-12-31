import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";

const VM_HTTP_URL = 'https://api.example.com';

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
    this.url = `${Global.url}esfera/json`
  }

  ObtenerJSONDiario(iFecha: string, fFecha: string): Observable<any> {
    return this.httpClient.get(this.url + '?iFecha=' + iFecha + '&fFecha=' + fFecha, VM_HTTP_OPTIONS);
  }

  ObtenerJSONMensual(iFecha: string, fFecha: string): Observable<any> {
    return this.httpClient.get(this.url + '/mensual' + '?iFecha=' + iFecha + '&fFecha=' + fFecha, VM_HTTP_OPTIONS);
  }
}
