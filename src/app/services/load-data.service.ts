import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tanque } from '../interfaces/Tanque.interface';
import { Content } from '@angular/compiler/src/render3/r3_ast';
const VM_HTTP_URL = 'https://localhost:5001/api'; 

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  constructor(private http: HttpClient) { }

  // * Principals methods

  saveAlmacenesData(data: any, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        data.tanques.length > 0 ? this.saveTanksData(data.tanques, token) : null;
        data.dispensarios.length > 0 ? this.saveDispensariosData(data.dispensarios, token) : null;
        data.medidoresTanques.length > 0 ? this.saveMedidoresTankData(data.medidoresTanques, token) : null;
        data.medidoresDispensarios.length > 0 ? this.saveDispensariosMedidoresData(data.medidoresDispensarios, token) : null;
        data.manguerasDispensario.length > 0 ? this.saveManguerasDispensariosData(data.manguerasDispensario, token) : null;
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  saveMovimientosData(data: any, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        data.tanques.length > 0 ? this.saveArriveTankData(data.tanques, token) : null;
        data.dispensarios.length > 0 ? this.saveArriveDispData(data.dispensarios, token) : null;
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }


  // Secondary methods
  
  saveTanksData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/Tanque`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Tanks saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveDispensariosData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/Dispensarios`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Dispensarios saved successfully', response);
          resolve(response);
        },
        error => {
          console.log('Error saving dispensarios', error);
          reject(error);
        }
      );
    });
  }

  saveDispensariosMedidoresData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/EntregaDispensarios/Medidores`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Dispensarios medidores saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveManguerasDispensariosData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/EntregaDispensarios/Mangueras`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Mangueras dispensarios saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveMedidoresTankData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/EntregaTanque/Medidores`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Medidores saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }


  // Entregas
  saveArriveTankData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/EntregaTanque/Entrega`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Arrive tanks saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  saveArriveDispData(data: any, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http.post<number>(`${VM_HTTP_URL}/EntregaDispensarios`, data, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
        response => {
          console.log('Arrive dispensarios saved successfully', response);
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
