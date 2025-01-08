// almacenes.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadDataService } from '../../services/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';

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

  tanqueData = {
    claveTanque: '',
    descripcion: '',
    vigenciaCalibracion: '',
    capacidadTotal: 0,
    capacidadOperativa: 0,
    capacidadUtil: 0,
    capacidadFondaje: 0,
    volumenMinimoOperacion: 0
  };

  dispensarioData = {
    claveDispensario: ''
  };

  medidorTanqueData = {
    claveTanque: '',
    SistemaMedicionTanque: '',
    descripcionLocalizacion: '',
    vigenciaCalibracion: '',
    incertidumbreMedicion: 0
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

  // Método para registrar tanque
  registrarTanque() {
    // Validar fecha
    const fecha = new Date(this.tanqueData.vigenciaCalibracion);
    const minDate = new Date('1753-01-01');
    const maxDate = new Date('9999-12-31');
  
    if (fecha < minDate || fecha > maxDate) {
      this.toastr.error('La fecha debe estar entre 01/01/1753 y 31/12/9999', 'Error');
      return;
    }
  
    // Crear objeto con el formato correcto
    const tanqueFormateado = {
      ClaveIdentificacionTanque: this.tanqueData.claveTanque,
      DescripcionLocalizacion: this.tanqueData.descripcion,
      VigenciaCalibracionTanque: fecha.toISOString().split('T')[0],
      CapacidadTotalTanque: this.tanqueData.capacidadTotal,
      CapacidadOperativaTanque: this.tanqueData.capacidadOperativa,
      CapacidadUtilTanque: this.tanqueData.capacidadUtil,
      CapacidadFondajeTanque: this.tanqueData.capacidadFondaje,
      VolumenMinimoOperacion: this.tanqueData.volumenMinimoOperacion,
      EstadoTanque: null
    };
  
    // this.loadDataService.saveTanksData([tanqueFormateado], '').then(
    //   response => {
    //     console.log('Tanque registrado exitosamente', response);
    //     this.toastr.success('Tanque registrado con éxito');
    //     // Limpiar formulario
    //     this.tanqueData = {
    //       claveTanque: '',
    //       descripcion: '',
    //       vigenciaCalibracion: '',
    //       capacidadTotal: 0,
    //       capacidadOperativa: 0,
    //       capacidadUtil: 0,
    //       capacidadFondaje: 0,
    //       volumenMinimoOperacion: 0
    //     };
    //   },
    //   error => {
    //     console.error('Error al registrar tanque', error);
    //     this.toastr.error('Error al registrar el tanque: ' + error.message);
    //   }
    // );
  }

  // Método para registrar dispensario
  registrarDispensario() {
    // Validar que la clave no esté vacía
    if (!this.dispensarioData.claveDispensario) {
      this.toastr.error('La clave del dispensario es requerida', 'Error');
      return;
    }
  
    // Crear objeto con el formato correcto
    const dispensarioFormateado = {
      ClaveDispensario: this.dispensarioData.claveDispensario,
      EstadoDispensario: null
    };
  
    // this.loadDataService.saveDispensariosData([dispensarioFormateado], '').then(
    //   response => {
    //     console.log('Dispensario registrado exitosamente', response);
    //     this.toastr.success('Dispensario registrado con éxito');
    //     // Limpiar formulario
    //     this.dispensarioData = {
    //       claveDispensario: ''
    //     };
    //   },
    //   error => {
    //     console.error('Error al registrar dispensario', error);
    //     this.toastr.error('Error al registrar el dispensario: ' + error.message);
    //   }
    // );
  }

  // Método para registrar medidor de tanque
  registrarMedidorTanque() {
    // Validaciones
    if (!this.medidorTanqueData.claveTanque || 
        !this.medidorTanqueData.SistemaMedicionTanque || 
        !this.medidorTanqueData.descripcionLocalizacion || 
        !this.medidorTanqueData.vigenciaCalibracion) {
        this.toastr.error('Todos los campos son requeridos', 'Error');
        return;
    }

    // Validar fecha
    const fecha = new Date(this.medidorTanqueData.vigenciaCalibracion);
    const minDate = new Date('1753-01-01');
    const maxDate = new Date('9999-12-31');

    if (fecha < minDate || fecha > maxDate) {
        this.toastr.error('La fecha debe estar entre 01/01/1753 y 31/12/9999', 'Error');
        return;
    }

    // Crear objeto con el formato correcto
    const medidorFormateado = {
        ClaveTanque: this.medidorTanqueData.claveTanque,
        SistemaMedicionTanque: this.medidorTanqueData.SistemaMedicionTanque,
        DescripcionLocalizacion: this.medidorTanqueData.descripcionLocalizacion,
        VigenciaCalibracion: fecha.toISOString().split('T')[0],
        IncertidumbreMedicion: this.medidorTanqueData.incertidumbreMedicion
    };

    console.log('Datos a enviar:', medidorFormateado); 

    // this.loadDataService.saveMedidoresTankData([medidorFormateado], '').then(
    //     response => {
    //         console.log('Medidor de tanque registrado exitosamente', response);
    //         this.toastr.success('Medidor de tanque registrado con éxito');
    //         // Limpiar formulario
    //         this.medidorTanqueData = {
    //             claveTanque: '',
    //             SistemaMedicionTanque: '',
    //             descripcionLocalizacion: '',
    //             vigenciaCalibracion: '',
    //             incertidumbreMedicion: 0
    //         };
    //     },
    //     error => {
    //         console.error('Error al registrar medidor de tanque', error);
    //         this.toastr.error('Error al registrar el medidor de tanque: ' + error.message);
    //     }
    // );
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