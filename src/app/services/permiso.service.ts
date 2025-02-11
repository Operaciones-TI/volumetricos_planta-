import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRazonSocial } from '../interfaces/RazonSocial.interface';
import { Permiso } from '../interfaces/Permiso.interface';
import { Global } from '../shared/global';

const VM_HTTP_URL = Global.url_api;

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  constructor(private http: HttpClient) {}

  savePermisoData(data: any, token: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${VM_HTTP_URL}Permiso`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  getRazonSocialData(token: string = ''): Promise<IRazonSocial[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<IRazonSocial[]>(`${VM_HTTP_URL}RazonSocial`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (response: IRazonSocial[]) => {
            resolve(response);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
    });
  }

  getPermisos(IdRazonSocial: number, token = ''): Promise<Permiso[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Permiso[]>(
          `${VM_HTTP_URL}Permiso?idRazonSocial=${IdRazonSocial}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .subscribe({
          next: (response: Permiso[]) => {
            resolve(response);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
    });
  }
}
