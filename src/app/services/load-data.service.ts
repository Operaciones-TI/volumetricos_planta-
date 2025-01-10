import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tanque } from '../interfaces/Tanque.interface';
const VM_HTTP_URL = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root',
})
export class LoadDataService {
  constructor(private http: HttpClient) {}

  // * Principals methods

  saveAlmacenesData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('permiso: ', idPermiso, 'razon: ', idRazonSocial);
      try {
        data.tanques.length > 0
          ? this.saveTanksData(data.tanques, idPermiso, idRazonSocial, token)
          : null;
        data.dispensarios.length > 0
          ? this.saveDispensariosData(
              data.dispensarios,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        data.medidoresTanques.length > 0
          ? this.saveMedidoresTankData(
              data.medidoresTanques,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        data.medidoresDispensarios.length > 0
          ? this.saveDispensariosMedidoresData(
              data.medidoresDispensarios,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        data.manguerasDispensario.length > 0
          ? this.saveManguerasDispensariosData(
              data.manguerasDispensario,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  saveMovimientosData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        data.tanques.length > 0
          ? this.saveArriveTankData(
              data.tanques,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        data.dispensarios.length > 0
          ? this.saveArriveDispData(
              data.dispensarios,
              idPermiso,
              idRazonSocial,
              token
            )
          : null;
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Secondary methods

  saveTanksData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/Tanque?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Tanks saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  saveDispensariosData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/Dispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Dispensarios saved successfully', response);
            resolve(response);
          },
          (error) => {
            console.log('Error saving dispensarios', error);
            reject(error);
          }
        );
    });
  }

  saveDispensariosMedidoresData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .post<number>(
          `${VM_HTTP_URL}/EntregaDispensarios/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Dispensarios medidores saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  saveManguerasDispensariosData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .post<number>(
          `${VM_HTTP_URL}/EntregaDispensarios/Mangueras?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Mangueras dispensarios saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  saveMedidoresTankData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/EntregaTanque/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Medidores saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // Entregas
  saveArriveTankData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .post<number>(
          `${VM_HTTP_URL}/EntregaTanque/Entrega?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
        .subscribe(
          (response) => {
            console.log('Arrive tanks saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  saveArriveDispData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.http
        .post<number>(
          `${VM_HTTP_URL}/EntregaDispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .subscribe(
          (response) => {
            console.log('Arrive dispensarios saved successfully', response);
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}
