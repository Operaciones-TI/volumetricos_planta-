import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AlmacenesResponse,
  IApiResponse,
  MovimientosResponse,
} from '../interfaces/ApiResponse.interface';
import { Global } from '../shared/global';

const VM_HTTP_URL = Global.url_api;
// const emptyRes: IApiResponse [] = [];

@Injectable({
  providedIn: 'root',
})
export class LoadDataService {
  constructor(private http: HttpClient) {}

  almacenesResponse: AlmacenesResponse = {} as AlmacenesResponse;
  movimientosResponse: MovimientosResponse = {} as MovimientosResponse;

  // * Principals methods

  saveAlmacenesData(
    data: any,
    idPermiso: number,
    idRazonSocial: number,
    token: string
  ): Promise<AlmacenesResponse> {
    return new Promise((resolve, reject) => {
      // console.log('permiso: ', idPermiso, 'razon: ', idRazonSocial);
      try {
        if (!data) {
          throw new Error('Data is undefined or null');
        }

        // this.almacenesResponse = {} as AlmacenesResponse;

        // let tanques: any[] = [];
        const promTanques = this.saveTanksData(data.tanques, idPermiso, idRazonSocial, token);
        const promDispensarios = this.saveDispensariosData(data.dispensarios, idPermiso, idRazonSocial, token);
        const promMedidTanques = this.saveMedidoresTankData(data.medidoresTanques, idPermiso, idRazonSocial, token);
        const promMedidDispe = this.saveDispensariosMedidoresData(data.medidoresDispensarios, idPermiso, idRazonSocial, token);
        const promMangDisp = this.saveManguerasDispensariosData(data.manguerasDispensario, idPermiso, idRazonSocial, token);

        Promise.all([promTanques, promDispensarios, promMedidTanques, promMedidDispe, promMangDisp])
          .then((results) => {
            this.almacenesResponse.tanques = results[0];
            this.almacenesResponse.dispensarios = results[1];
            this.almacenesResponse.medidoresTanques = results[2];
            this.almacenesResponse.medidoresDispensarios = results[3];
            this.almacenesResponse.manguerasDispensario = results[4];
            resolve(this.almacenesResponse);
          })
          .catch((error) => {
            reject(error);
          });

        // if (data.tanques && data.tanques.length > 0) {
        //   this.saveTanksData(data.tanques, idPermiso, idRazonSocial, token).then(res => {
        //     this.almacenesResponse.tanques = res;
        //   });
        // }

        // if (data.dispensarios && data.dispensarios.length > 0) {
        //   this.saveDispensariosData(data.dispensarios, idPermiso, idRazonSocial, token).then(res => {
        //     this.almacenesResponse.dispensarios = res;
        //   });
        // }

        // if (data.medidoresTanques && data.medidoresTanques.length > 0) {
        //   this.saveMedidoresTankData(data.medidoresTanques, idPermiso, idRazonSocial, token).then(res => {
        //     this.almacenesResponse.medidoresTanques = res;
        //   });
        // }

        // if (data.medidoresDispensarios && data.medidoresDispensarios.length > 0) {
        //   this.saveDispensariosMedidoresData(data.medidoresDispensarios, idPermiso, idRazonSocial, token).then(res => {
        //     this.almacenesResponse.medidoresDispensarios = res;
        //   });
        // }

        // if (data.manguerasDispensario && data.manguerasDispensario.length > 0) {
        //   this.saveManguerasDispensariosData(data.manguerasDispensario, idPermiso, idRazonSocial, token).then(res => {
        //     this.almacenesResponse.manguerasDispensario = res;
        //   });
        // }

        // console.log('almacenes despues de promesas: ', this.almacenesResponse);
        // resolve(this.almacenesResponse);
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
  ): Promise<MovimientosResponse> {
    return new Promise((resolve, reject) => {
      try {
        const promArriveTanks = this.saveArriveTankData(data.tanques, idPermiso, idRazonSocial, token);
        const promArriveDisp = this.saveArriveDispData(data.dispensarios, idPermiso, idRazonSocial, token);

        Promise.all([promArriveTanks, promArriveDisp])
          .then((results) => {
            this.movimientosResponse.movimientosTanques = results[0];
            this.movimientosResponse.movimientosDispensarios = results[1];

            resolve(this.movimientosResponse)
          })
          .catch((error) => {
            reject(error);
          });

        // data.tanques.length > 0
        //   ? this.saveArriveTankData(
        //       data.tanques,
        //       idPermiso,
        //       idRazonSocial,
        //       token
        //     )
        //   : null;
        // data.dispensarios.length > 0
        //   ? this.saveArriveDispData(
        //       data.dispensarios,
        //       idPermiso,
        //       idRazonSocial,
        //       token
        //     )
        //   : null;
        // resolve(true);
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
    token: string = ''
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}Tanque?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = ''
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}Dispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = ''
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}EntregaDispensarios/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = ''
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}EntregaDispensarios/Mangueras?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = '',
    fechaMovimiento?: string
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}EntregaTanque/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}` +
            (fechaMovimiento ? `&fechaMovimiento=${fechaMovimiento}` : ''),
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = '',
    fechaMovimiento?: string
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}EntregaTanque/Entrega?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}` +
            (fechaMovimiento ? `&fechaMovimiento=${fechaMovimiento}` : ''),
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
    token: string = '',
    fechaMovimiento?: string
  ): Promise<IApiResponse[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<IApiResponse[]>(
          `${VM_HTTP_URL}EntregaDispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}` +
            (fechaMovimiento ? `&fechaMovimiento=${fechaMovimiento}` : ''),
          data,
          { headers: { Authorization: `Bearer ${token}` } }
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
