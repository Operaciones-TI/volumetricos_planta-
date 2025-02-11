import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Global } from '../shared/global';

const VM_HTTP_URL = Global.url_api;

@Injectable()
export class AuthService {
  private url: string;

  private isUsuarioLoggedIn$ = new BehaviorSubject<boolean>(false);

  isLoggedIn() {
    return this.isUsuarioLoggedIn$.asObservable();
  }

  constructor(private httpClient: HttpClient) {
    // this.url = `${Global.url}auth`
    this.url = `${VM_HTTP_URL}auth`;
  }

  ObtenerIdentity() {
    let s = localStorage.getItem('identity');
    if (s === null) return null;
    let identity = JSON.parse(s);
    return identity;
  }

  ObtenerTipoUsuario() {
    let s = localStorage.getItem('identity');
    if (s === null) return null;
    let identity = JSON.parse(s);
    return identity.perfil;
  }

  ObtenerToken() {
    return localStorage.getItem('token');
  }

  DestruirToken() {
    localStorage.removeItem('token');
  }

  Login(login: string, password: string): Observable<any> {
    let formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    let urlLogin = this.httpClient.post(this.url, formData);
    console.log(urlLogin);
    return urlLogin;
  }

  Logout() {
    // localStorage.clear();
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.updateLogin(false);
  }

  updateLogin(state: boolean) {
    this.isUsuarioLoggedIn$.next(state);
  }
}
