// almacenes.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadDataService } from '../../services/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';
import { Tanque } from 'src/app/interfaces/Tanque.interface';
import { MedidorTanque } from 'src/app/interfaces/MedidorTanque.interface';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent {

  razonSelected: number = 0;
  permisoSelected: number = 0;
  razonesSociales: IRazonSocial[] = [];
  permisos: Permiso[] = [];

  tanqueData: Tanque = {
    ClaveIdentificacionTanque: '',
    DescripcionLocalizacion: '',
    VigenciaCalibracionTanque: '',
    CapacidadTotalTanque: 0,
    CapacidadOperativaTanque: 0,
    CapacidadUtilTanque: 0,
    CapacidadFondajeTanque: 0,
    VolumenMinimoOperacion: 0
  };

  dispensarioData = {
    ClaveDispensario: ''
  };

  medidorTanqueData: MedidorTanque = {
    ClaveTanque: '',
    SistemaMedicionTanque: '',
    DescripcionLocalizacion: '',
    VigenciaCalibracion: '',
    IncertidumbreMedicion: 0
  };

  medidorDispensarioData = {
    claveDispensario: '',
    SistemaMedicion: '',
    descripcionLocalizacion: '',
    vigenciaCalibracion: '',
    incertidumbreMedicion: 0
  };

  mangueraData = {
    claveDispensario: '',
    claveManguera: ''
  };

  constructor(
    private loadDataService: LoadDataService, 
    private toastr: ToastrService,
    private permisoService: PermisoService
  ) {}

  async ngOnInit() {
    await this.getRazonesSociales();
    await this.getPermisos(this.razonSelected);
  }
  getPermisos(idRazonSocial: number) {
    this.permisoService.getPermisos(idRazonSocial)
    .then((permisos: Permiso[]) => {
      console.log(permisos);
      this.permisos = permisos;
    })
    .catch(e => {
      console.log(e);
    });
  }

  async getRazonesSociales() {
    try {
      const data = await this.permisoService.getRazonSocialData();
      console.log(data);
      this.razonesSociales = data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  clearObject<T extends object>(obj: T): T {
    const keys = Object.keys(obj) as Array<keyof T>;
    for (const key of keys) {
      if (typeof obj[key] === 'string') {
        obj[key] = '' as any;
      } else if (typeof obj[key] === 'number') {
        obj[key] = 0 as any;
      }
    }
    return obj;
  }

  // Método para registrar tanque
  registrarTanque() {
    // console.log(this.clearObject(this.tanqueData));
    // Validar fecha
    if (this.tanqueData.VigenciaCalibracionTanque) {
      const fecha = new Date(this.tanqueData.VigenciaCalibracionTanque);
      const minDate = new Date('1753-01-01');
      const maxDate = new Date('9999-12-31');
    
      if (fecha < minDate || fecha > maxDate) {
        this.toastr.error('La fecha debe estar entre 01/01/1753 y 31/12/9999', 'Error');
        return;
      }

      this.tanqueData.VigenciaCalibracionTanque = fecha.toISOString().split('T')[0];
    
      this.loadDataService.saveTanksData([this.tanqueData], this.permisoSelected, this.razonSelected, 'token').then(
        response => {
          console.log('Tanque registrado exitosamente', response);
          for(let res of response) {
            if(res?.Result === 0 && res.IsCompleted) {
              this.toastr.warning('El tanque con esta clave y permiso ya existe.', '')
            } else if(res?.Result != 0 && res.IsCompleted) {
              this.toastr.success('Tanque registrado con éxito');
              // Limpiar formulario
              this.clearObject(this.tanqueData);
            }
          }
        },
        error => {
          console.error('Error al registrar tanque', error);
          this.toastr.error('Error al registrar el tanque: ' + error.message);
        }
      );
    }
  }

  // Método para registrar dispensario
  registrarDispensario() {
    // Validar que la clave no esté vacía
    if (!this.dispensarioData.ClaveDispensario) {
      this.toastr.warning('La clave del dispensario es requerida', 'Campo vacío');
      return;
    }
  
    this.loadDataService.saveDispensariosData([this.dispensarioData], this.permisoSelected, this.razonSelected, 'token').then(
      response => {
        for (let res of response) {
          if (res?.Result === 0 && res.IsCompleted) {
            this.toastr.warning('El dispensario con esta clave y permiso ya existe.', '')
          } else if (res?.Result != 0 && res.IsCompleted) {
            this.toastr.success('Dispensario registrado con éxito');
            // Limpiar formulario
            this.clearObject(this.dispensarioData);
          }
        }
      },
      error => {
        console.error('Error al registrar dispensario', error);
        this.toastr.error('Error al registrar el dispensario: ' + error.message);
      }
    );
  }

  // Método para registrar medidor de tanque
  registrarMedidorTanque() {
    // Validaciones
    if (!this.medidorTanqueData.ClaveTanque || 
        !this.medidorTanqueData.SistemaMedicionTanque || 
        !this.medidorTanqueData.DescripcionLocalizacion || 
        !this.medidorTanqueData.VigenciaCalibracion) {
        this.toastr.error('Todos los campos son requeridos para crear un medidor de tanque.', 'Error');
        return;
    }

    // Validar fecha
    const fecha = new Date(this.medidorTanqueData.VigenciaCalibracion);
    const minDate = new Date('1753-01-01');
    const maxDate = new Date('9999-12-31');

    if (fecha < minDate || fecha > maxDate) {
        this.toastr.error('La fecha debe estar entre 01/01/1753 y 31/12/9999', 'Error');
        return;
    }

    this.medidorTanqueData.VigenciaCalibracion = fecha.toISOString().split('T')[0];

    this.loadDataService.saveMedidoresTankData([this.medidorTanqueData], this.permisoSelected, this.razonSelected, 'token').then(
        response => {
            for (let res of response) {
                if (res?.Result === 0 && res.IsCompleted) {
                    this.toastr.warning('El medidor de tanque con esta clave y permiso ya existe.', '')
                } else if (res?.Result != 0 && res.IsCompleted) {
                    this.toastr.success('Medidor de tanque registrado con éxito');
                    // Limpiar formulario
                    this.clearObject(this.medidorTanqueData);
                }
            }
        },
        error => {
            console.error('Error al registrar medidor de tanque', error);
            this.toastr.error('Error al registrar el medidor de tanque: ' + error.message);
        }
    );
  }

  // Método para registrar medidor de dispensario
  registrarMedidorDispensario() {
    // Validaciones
    if (!this.medidorDispensarioData.claveDispensario || 
        !this.medidorDispensarioData.SistemaMedicion || 
        !this.medidorDispensarioData.descripcionLocalizacion || 
        !this.medidorDispensarioData.vigenciaCalibracion) {
        this.toastr.error('Todos los campos son requeridos', 'Error');
        return;
    }

    // Validar fecha
    const fecha = new Date(this.medidorDispensarioData.vigenciaCalibracion);
    const minDate = new Date('1753-01-01');
    const maxDate = new Date('9999-12-31');

    if (fecha < minDate || fecha > maxDate) {
        this.toastr.error('La fecha debe estar entre 01/01/1753 y 31/12/9999', 'Error');
        return;
    }

    // Crear objeto con el formato correcto
    const medidorFormateado = {
        ClaveDispensario: this.medidorDispensarioData.claveDispensario,
        SistemaMedicion: this.medidorDispensarioData.SistemaMedicion, // Cambiado aquí
        DescripcionLocalizacion: this.medidorDispensarioData.descripcionLocalizacion,
        VigenciaCalibracion: fecha.toISOString().split('T')[0],
        IncertidumbreMedicion: this.medidorDispensarioData.incertidumbreMedicion
    };

    // this.loadDataService.saveDispensariosMedidoresData([medidorFormateado], '').then(
    //     response => {
    //         console.log('Medidor de dispensario registrado exitosamente', response);
    //         this.toastr.success('Medidor de dispensario registrado con éxito');
    //         // Limpiar formulario
    //         this.medidorDispensarioData = {
    //             claveDispensario: '',
    //             SistemaMedicion: '',
    //             descripcionLocalizacion: '',
    //             vigenciaCalibracion: '',
    //             incertidumbreMedicion: 0
    //         };
    //     },
    //     error => {
    //         console.error('Error al registrar medidor de dispensario', error);
    //         this.toastr.error('Error al registrar el medidor de dispensario: ' + error.message);
    //     }
    // );
  }

  // Método para registrar manguera
  registrarManguera() {
    // Validaciones
    if (!this.mangueraData.claveDispensario || !this.mangueraData.claveManguera) {
        this.toastr.error('Todos los campos son requeridos', 'Error');
        return;
    }

    // Crear objeto con el formato correcto
    const mangueraFormateada = {
        ClaveDispensario: this.mangueraData.claveDispensario,
        ClaveManguera: this.mangueraData.claveManguera
    };

    console.log('Datos a enviar:', mangueraFormateada);

    // this.loadDataService.saveManguerasDispensariosData([mangueraFormateada], '').then(
    //     response => {
    //         console.log('Manguera registrada exitosamente', response);
    //         this.toastr.success('Manguera registrada con éxito');
    //         // Limpiar formulario
    //         this.mangueraData = {
    //             claveDispensario: '',
    //             claveManguera: ''
    //         };
    //     },
    //     error => {
    //         console.error('Error al registrar manguera', error);
    //         this.toastr.error('Error al registrar la manguera: ' + error.message);
    //     }
    // );
  }
}