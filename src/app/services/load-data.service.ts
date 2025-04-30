import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
const VM_HTTP_URL = Global.url;

// CABECERAS NECESARIAS PARA HACER LOS HTTP REQUEST A EL CONTROLADOR DEL APPI
const VM_HTTP_OPTIONS = {
  headers: new HttpHeaders({
    Authorization: 'bearer ' + localStorage.getItem('token'),
  }),
};

const VM_HTTP_HEADERS = {
  headers: new HttpHeaders()
    .set('Authorization', 'bearer ' + localStorage.getItem('token'))
    .set('Content-Type', 'application/json'),
};
@Injectable({
  providedIn: 'root',
})
export class LoadDataService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${Global.url}/complemento`
  }

  // * Principals methods

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  saveAlmacenesData(data: any, idPermiso: number, idRazonSocial: number, token: string): Promise<boolean> {
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

  saveMovimientosData(data: any, tipoPermiso: string,  idPermiso: number, idRazonSocial: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        data.recepciones.length > 0 && ["ALM", "LPA", "DIST"].includes(tipoPermiso)
          ? this.saveReceptionTankData(data.recepciones, idPermiso, idRazonSocial) : null;
        data.entregas.length > 0 && ["ALM", "LPA", "DIST"].includes(tipoPermiso)
          ? this.saveDeliveryTankData(data.entregas, idPermiso, idRazonSocial) : null;
          data.recepciones.length > 0 && tipoPermiso === "EXP"
          ? this.saveReceptionDispData(data.recepciones, idPermiso, idRazonSocial) : null;
        data.entregas.length > 0 && tipoPermiso === "EXP"
          ? this.saveDeliveryDispData(data.entregas, idPermiso, idRazonSocial) : null;
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Secondary methods

  saveTanksData(data: any, idPermiso: number, idRazonSocial: number, token: string = ""): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/Tanque?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveDispensariosData(data: any, idPermiso: number, idRazonSocial: number, token: string = ""): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/Dispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveDispensariosMedidoresData(data: any, idPermiso: number, idRazonSocial: number, token: string = ""): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/EntregaDispensarios/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveManguerasDispensariosData(data: any, idPermiso: number, idRazonSocial: number, token: string = ""): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/EntregaDispensarios/Mangueras?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveMedidoresTankData(data: any, idPermiso: number, idRazonSocial: number, token: string = "", fechaMovimiento?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/EntregaTanque/Medidores?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}` + (fechaMovimiento ? `&fechaMovimiento=${fechaMovimiento}` : ''),
          data,
          VM_HTTP_OPTIONS
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
  saveArriveTankData(data: any, idPermiso: number, idRazonSocial: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${this.url}/EntregaTanque/Entrega?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveArriveDispData(data: any, idPermiso: number, idRazonSocial: number, token: string = "", fechaMovimiento?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${VM_HTTP_URL}/EntregaDispensarios?idPermiso=${idPermiso}&idRazonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveReceptionTankData(data: any, idPermiso: number, idRazonSocial: number): Promise<any[]> {
    const batchSize = 500; // Lotes de 500 registros
    const batches = this.chunkArray(data, batchSize);

    // Mapeamos cada batch a una petición HTTP
    const requests = batches.map(batch =>
      this.http.post<any[]>(
        `${this.url}/RegistrarRecepcionTanque?permiso=${idPermiso}&razonSocial=${idRazonSocial}`,
        batch,
        VM_HTTP_OPTIONS
      ).toPromise()
    );

    // Esperamos que todas las peticiones se completen antes de resolver
    return Promise.all(requests)
      .then(responses => {
        console.log('Todos los lotes se han enviado correctamente', responses);
        return responses;
      })
      .catch(error => {
        console.error('Error al enviar los lotes', error);
        throw error; // Propagamos el error para manejarlo fuera
      });
  }

  saveDeliveryTankData(data: any, idPermiso: number, idRazonSocial: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${this.url}/RegistrarEntregaTanque?permiso=${idPermiso}&razonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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

  saveReceptionDispData(data: any, idPermiso: number, idRazonSocial: number): Promise<any[]> {
    const batchSize = 500; // Lotes de 500 registros
    const batches = this.chunkArray(data, batchSize);

    // Mapeamos cada batch a una petición HTTP
    const requests = batches.map(batch =>
      this.http.post<any[]>(
        `${this.url}/RegistrarRecepcionDispensario?permiso=${idPermiso}&razonSocial=${idRazonSocial}`,
        batch,
        VM_HTTP_OPTIONS
      ).toPromise()
    );

    // Esperamos que todas las peticiones se completen antes de resolver
    return Promise.all(requests)
      .then(responses => {
        console.log('Todos los lotes se han enviado correctamente', responses);
        return responses;
      })
      .catch(error => {
        console.error('Error al enviar los lotes', error);
        throw error; // Propagamos el error para manejarlo fuera
      });
  }

  saveDeliveryDispData(data: any, idPermiso: number, idRazonSocial: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any[]>(
          `${this.url}/RegistrarEntregaDispensario?permiso=${idPermiso}&razonSocial=${idRazonSocial}`,
          data,
          VM_HTTP_OPTIONS
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
}
