import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';

const VM_HTTP_URL = 'http://volumetrics.site/api/';

// CABECERAS NECESARIAS PARA HACER LOS HTTP REQUEST A EL CONTROLADOR DEL APPI
const VM_HTTP_OPTIONS = {
  headers: new HttpHeaders({
    Authorization: 'bearer ' + localStorage.getItem('token'),
  }),
};

@Injectable()
export class UsuarioService {
  private url: string;

  constructor(private httpClient: HttpClient) {
    // this.url = `${Global.url}usuario`
    this.url = `${VM_HTTP_URL}usuario`;
  }

  ObtenerLecturasUsuarios(): Observable<any> {
    return this.httpClient.get(this.url, VM_HTTP_OPTIONS);
  }

  registrarUsuario(newUser: any): Observable<any> {
    return this.httpClient.post(this.url, newUser, VM_HTTP_OPTIONS);
  }

  actualizarUsuario(updateUser: any): Observable<any> {
    return this.httpClient.put(this.url, updateUser, VM_HTTP_OPTIONS);
  }

  actualizaPassUsuario(idUser: any): Observable<any> {
    return this.httpClient.post(
      this.url + '/contrasena?id=' + idUser,
      idUser,
      VM_HTTP_OPTIONS
    );
  }

  actualizarEstatusUsuario(idUser: any, urlChange: string) {
    return this.httpClient.post(
      this.url + '/' + urlChange + '?id=' + idUser,
      idUser,
      VM_HTTP_OPTIONS
    );
  }
}
