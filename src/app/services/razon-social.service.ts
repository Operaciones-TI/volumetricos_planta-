import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const VM_HTTP_URL = 'https://localhost:5001/api';

export interface RazonSocialData {
  PlantaName: string;
  RazonSocialName: string;
  RfcContribuyente: string; 
}

@Injectable({
  providedIn: 'root'
})
export class RazonSocialService {

  constructor(private http: HttpClient) { }

  saveRazonSocialData(data: RazonSocialData): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${VM_HTTP_URL}/RazonSocial`, data, { 
        headers,
        observe: 'response'
      })
        .subscribe({
          next: (response: any) => {
            if (response) {
              console.log('Razón social guardada exitosamente');
              resolve(response.body);
            } else {
              reject('No se recibió respuesta del servidor');
            }
          },
          error: (error) => {
            console.error('Error al guardar razón social', error);
            reject(error);
          }
        });
    });
  }
}