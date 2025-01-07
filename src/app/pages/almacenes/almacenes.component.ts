// almacenes.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadDataService } from '../../services/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos } from 'src/app/interfaces/Permiso.interface';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent {

  razonSelected: number = 0;
  permisoSelected: number = 0;
  razonesSociales: IRazonSocial[] = [];
  permisos: IPermisos[] = [];

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
    claveMedicion: '',
    descripcionLocalizacion: '',
    vigenciaCalibracion: '',
    incertidumbreMedicion: 0
  };

  medidorDispensarioData = {
    claveDispensario: '',
    claveMedicion: '',
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
    .then((permisos: IPermisos[]) => {
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
  
    this.loadDataService.saveTanksData([tanqueFormateado], '').then(
      response => {
        console.log('Tanque registrado exitosamente', response);
        this.toastr.success('Tanque registrado con éxito');
        // Limpiar formulario
        this.tanqueData = {
          claveTanque: '',
          descripcion: '',
          vigenciaCalibracion: '',
          capacidadTotal: 0,
          capacidadOperativa: 0,
          capacidadUtil: 0,
          capacidadFondaje: 0,
          volumenMinimoOperacion: 0
        };
      },
      error => {
        console.error('Error al registrar tanque', error);
        this.toastr.error('Error al registrar el tanque: ' + error.message);
      }
    );
  }

  // Método para registrar dispensario
  registrarDispensario() {
    this.loadDataService.saveDispensariosData([this.dispensarioData], '').then(
      response => {
        console.log('Dispensario registrado exitosamente', response);
        // Limpiar formulario o mostrar mensaje de éxito
      },
      error => {
        console.error('Error al registrar dispensario', error);
        // Mostrar mensaje de error
      }
    );
  }

  // Método para registrar medidor de tanque
  registrarMedidorTanque() {
    this.loadDataService.saveMedidoresTankData([this.medidorTanqueData], '').then(
      response => {
        console.log('Medidor de tanque registrado exitosamente', response);
        // Limpiar formulario o mostrar mensaje de éxito
      },
      error => {
        console.error('Error al registrar medidor de tanque', error);
        // Mostrar mensaje de error
      }
    );
  }

  // Método para registrar medidor de dispensario
  registrarMedidorDispensario() {
    this.loadDataService.saveDispensariosMedidoresData([this.medidorDispensarioData], '').then(
      response => {
        console.log('Medidor de dispensario registrado exitosamente', response);
        // Limpiar formulario o mostrar mensaje de éxito
      },
      error => {
        console.error('Error al registrar medidor de dispensario', error);
        // Mostrar mensaje de error
      }
    );
  }

  // Método para registrar manguera
  registrarManguera() {
    this.loadDataService.saveManguerasDispensariosData([this.mangueraData], '').then(
      response => {
        console.log('Manguera registrada exitosamente', response);
        // Limpiar formulario o mostrar mensaje de éxito
      },
      error => {
        console.error('Error al registrar manguera', error);
        // Mostrar mensaje de error
      }
    );
  }
}