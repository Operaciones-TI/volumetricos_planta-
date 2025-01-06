import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRazonSocial } from '../interfaces/RazonSocial.interface';

const VM_HTTP_URL = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  constructor(private http: HttpClient) { }
  
  savePermisoData(data: any, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${VM_HTTP_URL}/Permiso`, data, { 
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .subscribe({
          next: (response: any) => {
            resolve(response)
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  } 

  getRazonSocialData(): Promise<IRazonSocial[]> {
    return new Promise((resolve, reject) => {
      this.http.get<IRazonSocial[]>(`${VM_HTTP_URL}/RazonSocial`, { 
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .subscribe({
          next: (response: IRazonSocial[]) => {
            resolve(response);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          }
        });
    });
  }
}
