// almacenes.component.ts
import { Component, OnInit } from '@angular/core';
import { LoadDataService } from '../../services/load-data.service';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';
import { Tanque } from 'src/app/interfaces/Tanque.interface';
import { MedidorTanque } from 'src/app/interfaces/MedidorTanque.interface';
import { MedidorDispensarios } from 'src/app/interfaces/MedidorDispensario.interface';
import { MangueraDispensario } from 'src/app/interfaces/MangueraDispensario.interface';
import { clearObject } from 'src/app/utils/movimientos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss'],
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
    VolumenMinimoOperacion: 0,
  };

  dispensarioData = {
    ClaveDispensario: '',
  };

  medidorTanqueData: MedidorTanque = {
    ClaveTanque: '',
    SistemaMedicionTanque: '',
    DescripcionLocalizacion: '',
    VigenciaCalibracion: '',
    IncertidumbreMedicion: 0,
  };

  medidorDispensarioData: MedidorDispensarios = {
    ClaveDispensario: '',
    SistemaMedicion: '',
    DescripcionLocalizacion: '',
    VigenciaCalibracion: '',
    IncertidumbreMedicion: 0,
  };

  mangueraData: MangueraDispensario = {
    ClaveDispensario: '',
    ClaveManguera: '',
  };

  constructor(
    private loadDataService: LoadDataService,
    private toastr: ToastrService,
    private permisoService: PermisoService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.getRazonesSociales();
    await this.getPermisos(this.razonSelected);
  }

  getPermisos(idRazonSocial: number) {
    const token = this.authService.ObtenerToken();
    this.permisoService
      .getPermisos(idRazonSocial, token ? token : '')
      .then((permisos: Permiso[]) => {
        this.permisos = permisos;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async getRazonesSociales() {
    try {
      const token = this.authService.ObtenerToken();
      const data = await this.permisoService.getRazonSocialData(
        token ? token : ''
      );
      this.razonesSociales = data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // Método para registrar tanque
  registrarTanque() {
    if (
      !this.tanqueData.ClaveIdentificacionTanque ||
      !this.tanqueData.DescripcionLocalizacion ||
      !this.tanqueData.VigenciaCalibracionTanque ||
      !this.tanqueData.CapacidadTotalTanque ||
      !this.tanqueData.CapacidadOperativaTanque ||
      !this.tanqueData.CapacidadUtilTanque ||
      !this.tanqueData.CapacidadFondajeTanque ||
      !this.tanqueData.VolumenMinimoOperacion
    ) {
      this.toastr.warning(
        'Por favor, complete todos los campos',
        'Campos Requeridos'
      );
      return;
    } else {
      // Validaciones antes de guardar
      const fecha = new Date(this.tanqueData.VigenciaCalibracionTanque);
      const minDate = new Date('1753-01-01');
      const maxDate = new Date('9999-12-31');

      if (fecha < minDate || fecha > maxDate) {
        this.toastr.error(
          'La fecha debe estar entre 01/01/1753 y 31/12/9999',
          'Error'
        );
        return;
      }

      if (this.razonSelected === 0 || this.permisoSelected === 0) {
        this.toastr.warning(
          'Por favor, seleccione una razón social y un permiso',
          'Campos Requeridos'
        );
        return;
      }

      this.tanqueData.VigenciaCalibracionTanque = fecha
        .toISOString()
        .split('T')[0];

      this.loadDataService
        .saveTanksData(
          [this.tanqueData],
          this.permisoSelected,
          this.razonSelected,
          'token'
        )
        .then(
          (response) => {
            for (let res of response) {
              if (res?.Result === 0 && res.IsCompleted) {
                this.toastr.warning(
                  'El tanque con esta clave y permiso ya existe.',
                  ''
                );
              } else if (res?.Result != 0 && res.IsCompleted) {
                this.toastr.success('Tanque registrado con éxito');
                // Limpiar formulario
                clearObject(this.tanqueData);
              }
            }
          },
          (error) => {
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
      this.toastr.warning(
        'La clave del dispensario es requerida',
        'Campo vacío'
      );
      return;
    }

    if (this.razonSelected === 0 || this.permisoSelected === 0) {
      this.toastr.warning(
        'Por favor, seleccione una razón social y un permiso',
        'Campos Requeridos'
      );
      return;
    }

    this.loadDataService
      .saveDispensariosData(
        [this.dispensarioData],
        this.permisoSelected,
        this.razonSelected,
        'token'
      )
      .then(
        (response) => {
          for (let res of response) {
            if (res?.Result === 0 && res.IsCompleted) {
              this.toastr.warning(
                'El dispensario con esta clave y permiso ya existe.',
                ''
              );
            } else if (res?.Result != 0 && res.IsCompleted) {
              this.toastr.success('Dispensario registrado con éxito');
              // Limpiar formulario
              clearObject(this.dispensarioData);
            }
          }
        },
        (error) => {
          console.error('Error al registrar dispensario', error);
          this.toastr.error(
            'Error al registrar el dispensario: ' + error.message
          );
        }
      );
  }

  // Método para registrar medidor de tanque
  registrarMedidorTanque() {
    // Validaciones
    if (
      !this.medidorTanqueData.ClaveTanque ||
      !this.medidorTanqueData.SistemaMedicionTanque ||
      !this.medidorTanqueData.DescripcionLocalizacion ||
      !this.medidorTanqueData.VigenciaCalibracion
    ) {
      this.toastr.error(
        'Todos los campos son requeridos para crear un medidor de tanque.',
        'Error'
      );
      return;
    }

    // Validar fecha
    const fecha = new Date(this.medidorTanqueData.VigenciaCalibracion);
    const minDate = new Date('1753-01-01');
    const maxDate = new Date('9999-12-31');

    if (fecha < minDate || fecha > maxDate) {
      this.toastr.error(
        'La fecha debe estar entre 01/01/1753 y 31/12/9999',
        'Error'
      );
      return;
    }

    if (this.razonSelected === 0 || this.permisoSelected === 0) {
      this.toastr.warning(
        'Por favor, seleccione una razón social y un permiso',
        'Campos Requeridos'
      );
      return;
    }

    this.medidorTanqueData.VigenciaCalibracion = fecha
      .toISOString()
      .split('T')[0];

    this.loadDataService
      .saveMedidoresTankData(
        [this.medidorTanqueData],
        this.permisoSelected,
        this.razonSelected,
        'token'
      )
      .then(
        (response) => {
          for (let res of response) {
            if (res?.Result === 0 && res.IsCompleted) {
              this.toastr.warning(
                'El medidor de tanque con esta clave y permiso ya existe.',
                ''
              );
            } else if (res?.Result != 0 && res.IsCompleted) {
              this.toastr.success('Medidor de tanque registrado con éxito');
              // Limpiar formulario
              clearObject(this.medidorTanqueData);
            }
          }
        },
        (error) => {
          console.error('Error al registrar medidor de tanque', error);
          this.toastr.error(
            'Error al registrar el medidor de tanque: ' + error.message
          );
        }
      );
  }

  // Método para registrar medidor de dispensario
  registrarMedidorDispensario() {
    // Validaciones
    if (
      !this.medidorDispensarioData.ClaveDispensario ||
      !this.medidorDispensarioData.SistemaMedicion ||
      !this.medidorDispensarioData.DescripcionLocalizacion ||
      !this.medidorDispensarioData.VigenciaCalibracion ||
      !this.medidorDispensarioData.IncertidumbreMedicion
    ) {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      return;
    } else {
      // Validar fecha
      const fecha = new Date(this.medidorDispensarioData.VigenciaCalibracion);
      const minDate = new Date('1753-01-01');
      const maxDate = new Date('9999-12-31');

      if (fecha < minDate || fecha > maxDate) {
        this.toastr.error(
          'La fecha debe estar entre 01/01/1753 y 31/12/9999',
          'Error'
        );
        return;
      }

      if (this.razonSelected === 0 || this.permisoSelected === 0) {
        this.toastr.warning(
          'Por favor, seleccione una razón social y un permiso',
          'Campos Requeridos'
        );
        return;
      }

      this.medidorDispensarioData.VigenciaCalibracion = fecha
        .toISOString()
        .split('T')[0];

      this.loadDataService
        .saveDispensariosMedidoresData(
          [this.medidorDispensarioData],
          this.permisoSelected,
          this.razonSelected,
          'token'
        )
        .then(
          (response) => {
            for (let res of response) {
              if (res?.Result === 0 && res.IsCompleted) {
                this.toastr.warning(
                  'El medidor de dispensario con esta clave y permiso ya existe.',
                  ''
                );
              } else if (res?.Result != 0 && res.IsCompleted) {
                this.toastr.success(
                  'Medidor de dispensario registrado con éxito'
                );
                // Limpiar formulario
                clearObject(this.medidorDispensarioData);
              }
            }
          },
          (error) => {
            console.error('Error al registrar medidor de dispensario', error);
            this.toastr.error(
              'Error al registrar el medidor de dispensario: ' + error.message
            );
          }
        );
    }
  }

  // Método para registrar manguera
  registrarManguera() {
    // Validaciones
    if (
      !this.mangueraData.ClaveDispensario ||
      !this.mangueraData.ClaveManguera
    ) {
      this.toastr.error('Todos los campos son requeridos', 'Error');
      return;
    }

    if (this.razonSelected === 0 || this.permisoSelected === 0) {
      this.toastr.warning(
        'Por favor, seleccione una razón social y un permiso',
        'Campos Requeridos'
      );
      return;
    }

    this.loadDataService
      .saveManguerasDispensariosData(
        [this.mangueraData],
        this.permisoSelected,
        this.razonSelected,
        'token'
      )
      .then(
        (response) => {
          for (let res of response) {
            if (res?.Result === 0 && res.IsCompleted) {
              this.toastr.warning(
                'La manguera con esta clave y permiso ya existe.',
                ''
              );
            } else if (res?.Result != 0 && res.IsCompleted) {
              this.toastr.success('Manguera registrada con éxito');
              // Limpiar formulario
              clearObject(this.mangueraData);
            }
          }
        },
        (error) => {
          console.error('Error al registrar manguera', error);
          this.toastr.error('Error al registrar la manguera: ' + error.message);
        }
      );
  }
}
