import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';
import {
  MovimientoTanque,
  MovimientoDispensario,
} from 'src/app/interfaces/Movimientos.interface';
import { LoadDataService } from 'src/app/services/load-data.service';
import { clearObject } from 'src/app/utils/movimientos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss'],
})
export class MovimientosComponent implements OnInit {
  isDispensarios: boolean = false;
  razonesSociales: IRazonSocial[] = [];
  permisos: Permiso[] = [];
  razonSelected: number = 0;
  permisoSelected: number = 0;
  fechaMovimiento = '';

  // Objetos para los formularios
  tanqueData: MovimientoTanque = {
    ClaveTanque: '',
    TipoMovimiento: '',
    VolumenInicialTanque: 0,
    VolumenFinalTanque: 0,
    VolumenEntregado: 0,
    Temperatura: 0,
    PresionAbsoluta: 0,
    FechaHoraInicialEntrega: new Date(),
    FechaHoraFinalEntrega: new Date(),
    Cantidad: 0,
    PermisoReceptor: '',
    FechaHoraInicial: new Date(),
    VolumenFactura: 0,
    Folio: '',
    PrecioCompra: 0,
    ImporteTotal: 0,
    Uuid: '',
    FechaYHoraTransaccion: new Date(),
    ClaveVehiculo: '',
    PermisoTransporte: '',
    Proveedor: '',
    RfcProveedor: '',
    PermisoAlmacenamientoDistribucion: '',
    NombreTerminalDistribucion: '',
    Aclaracion: '',
  };

  dispensarioData: MovimientoDispensario = {
    ClaveDispensario: '',
    ClaveManguera: '',
    TipoDeRegistro: 'D',
    VolumenEntregadoTotalizadorAcum: 0,
    VolumenEntregadoTotalizadorInsta: 0,
    FechaHoraEntrega: new Date(),
    Permiso: '',
    FechaVenta: new Date(),
    CantidadLitros: 0,
    PrecioUnitario: 0,
    PrecioVentaTotalizadorInsta: 0,
    Importe: 0,
    Uuid: '',
    FechaYHoraTransaccion: new Date(),
    RfcClienteOProveedor: '',
    NombreClienteOProveedor: '',
    Aclaracion: '',
  };

  constructor(
    private permisoService: PermisoService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.getRazonesSociales();
    // console.log("token: ", this.authService.ObtenerToken());
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

  formatDateWithTimezoneOffset(date: Date): string {
    const pad = (num: number): string => (num < 10 ? '0' : '') + num;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const timezoneOffset = -date.getTimezoneOffset();
    const sign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

    const dateRes = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;

    return date ? dateRes : '';
  }

  validateEntregaTanque(): boolean {
    if (
      !this.tanqueData.ClaveTanque ||
      !this.tanqueData.TipoMovimiento ||
      !this.tanqueData.VolumenInicialTanque ||
      !this.tanqueData.VolumenFinalTanque ||
      !this.tanqueData.VolumenEntregado ||
      !this.tanqueData.Temperatura ||
      !this.tanqueData.PresionAbsoluta ||
      !this.tanqueData.FechaHoraInicialEntrega ||
      !this.tanqueData.FechaHoraFinalEntrega ||
      !this.tanqueData.Cantidad ||
      !this.tanqueData.PermisoReceptor ||
      !this.tanqueData.FechaHoraInicial ||
      !this.tanqueData.VolumenFactura ||
      !this.tanqueData.Folio ||
      !this.tanqueData.PrecioCompra ||
      !this.tanqueData.ImporteTotal ||
      !this.tanqueData.Uuid ||
      !this.tanqueData.FechaYHoraTransaccion ||
      !this.tanqueData.ClaveVehiculo ||
      !this.tanqueData.PermisoTransporte ||
      !this.tanqueData.Proveedor ||
      !this.tanqueData.RfcProveedor ||
      !this.tanqueData.PermisoAlmacenamientoDistribucion ||
      !this.tanqueData.NombreTerminalDistribucion ||
      !this.tanqueData.Aclaracion
    ) {
      return false;
    }
    return true;
  }

  validateEntregaDispensario(): boolean {
    if (
      !this.dispensarioData.ClaveDispensario ||
      !this.dispensarioData.ClaveManguera ||
      !this.dispensarioData.TipoDeRegistro ||
      !this.dispensarioData.VolumenEntregadoTotalizadorAcum ||
      !this.dispensarioData.VolumenEntregadoTotalizadorInsta ||
      !this.dispensarioData.FechaHoraEntrega ||
      !this.dispensarioData.Permiso ||
      !this.dispensarioData.FechaVenta ||
      !this.dispensarioData.CantidadLitros ||
      !this.dispensarioData.PrecioUnitario ||
      !this.dispensarioData.PrecioVentaTotalizadorInsta ||
      !this.dispensarioData.Importe ||
      !this.dispensarioData.Uuid ||
      !this.dispensarioData.FechaYHoraTransaccion ||
      !this.dispensarioData.RfcClienteOProveedor ||
      !this.dispensarioData.NombreClienteOProveedor ||
      !this.dispensarioData.Aclaracion
    ) {
      return false;
    }
    return true;
  }

  validateRazonPermiso(): boolean {
    if (this.razonSelected === 0 || this.permisoSelected === 0) {
      return false;
    }
    return true;
  }

  // * movimientos de tanques
  registrarMovimientoTanque() {
    if (!this.validateEntregaTanque()) {
      this.toastr.error(
        'Por favor complete todos los campos',
        'Campos Requeridos'
      );
      return;
    }

    if (!this.validateRazonPermiso()) {
      this.toastr.error(
        'Por favor seleccione una razón social, permiso y fecha de movimiento',
        'Campos Requeridos'
      );
      return;
    }

    let dataToSend: MovimientoTanque = {
      ClaveTanque: this.tanqueData.ClaveTanque,
      TipoMovimiento: this.tanqueData.TipoMovimiento,
      VolumenInicialTanque: this.tanqueData.VolumenInicialTanque,
      VolumenFinalTanque: this.tanqueData.VolumenFinalTanque,
      VolumenEntregado: this.tanqueData.VolumenEntregado,
      Temperatura: this.tanqueData.Temperatura,
      PresionAbsoluta: this.tanqueData.PresionAbsoluta,
      FechaHoraInicialEntrega: this.formatDateWithTimezoneOffset(
        new Date(this.tanqueData.FechaHoraInicialEntrega)
      ),
      FechaHoraFinalEntrega: this.formatDateWithTimezoneOffset(
        new Date(this.tanqueData.FechaHoraFinalEntrega)
      ),
      Cantidad: this.tanqueData.Cantidad,
      PermisoReceptor: this.tanqueData.PermisoReceptor,
      FechaHoraInicial: this.formatDateWithTimezoneOffset(
        new Date(this.tanqueData.FechaHoraInicial)
      ),
      VolumenFactura: this.tanqueData.VolumenFactura,
      Folio: this.tanqueData.Folio,
      PrecioCompra: this.tanqueData.PrecioCompra,
      ImporteTotal: this.tanqueData.ImporteTotal,
      Uuid: this.tanqueData.Uuid,
      FechaYHoraTransaccion: this.formatDateWithTimezoneOffset(
        new Date(this.tanqueData.FechaYHoraTransaccion)
      ),
      ClaveVehiculo: this.tanqueData.ClaveVehiculo,
      PermisoTransporte: this.tanqueData.PermisoTransporte,
      Proveedor: this.tanqueData.Proveedor,
      RfcProveedor: this.tanqueData.RfcProveedor,
      PermisoAlmacenamientoDistribucion:
        this.tanqueData.PermisoAlmacenamientoDistribucion,
      NombreTerminalDistribucion: this.tanqueData.NombreTerminalDistribucion,
      Aclaracion: this.tanqueData.Aclaracion,
    };
    let token = this.authService.ObtenerToken();

    this.loadDataService
      .saveArriveTankData(
        [dataToSend],
        this.permisoSelected,
        this.razonSelected,
        token ? token : '',
        this.fechaMovimiento
      )
      .then((response) => {
        for (let res of response) {
          if (res?.Result === 0 && res.IsCompleted) {
            this.toastr.warning('El tanque con esta clave no existe.', 'Error');
          } else if (res?.Result != 0 && res.IsCompleted) {
            this.toastr.success(
              'Movimiento de tanque registrado correctamente',
              'Éxito'
            );
            // Limpiar formulario
            clearObject(this.tanqueData);
          }
        }
      })
      .catch((e) => {
        console.log(e);
        this.toastr.error('Hubo un error al guardar los datos', 'Error');
      });
  }

  // * movimientos de dispensario
  registrarMovimientoDispensario() {
    if (!this.validateEntregaDispensario()) {
      this.toastr.error(
        'Por favor complete todos los campos',
        'Campos Requeridos'
      );
      return;
    }

    if (!this.validateRazonPermiso()) {
      this.toastr.error(
        'Por favor seleccione una razón social, un permiso y fecha de movimiento',
        'Campos Requeridos'
      );
      return;
    }

    console.log(this.dispensarioData.FechaVenta);
    let dataToSend: MovimientoDispensario = {
      TipoDeRegistro: this.dispensarioData.TipoDeRegistro,
      ClaveDispensario: this.dispensarioData.ClaveDispensario,
      ClaveManguera: this.dispensarioData.ClaveManguera,
      VolumenEntregadoTotalizadorAcum:
        this.dispensarioData.VolumenEntregadoTotalizadorAcum,
      VolumenEntregadoTotalizadorInsta:
        this.dispensarioData.VolumenEntregadoTotalizadorInsta,
      PrecioVentaTotalizadorInsta:
        this.dispensarioData.PrecioVentaTotalizadorInsta,
      FechaHoraEntrega: this.formatDateWithTimezoneOffset(
        new Date(this.dispensarioData.FechaHoraEntrega)
      ),
      Permiso: this.dispensarioData.Permiso,
      FechaVenta: this.formatDateWithTimezoneOffset(
        new Date(this.dispensarioData.FechaVenta)
      ),
      CantidadLitros: this.dispensarioData.CantidadLitros,
      PrecioUnitario: this.dispensarioData.PrecioUnitario,
      Importe: this.dispensarioData.Importe,
      Uuid: this.dispensarioData.Uuid,
      FechaYHoraTransaccion: this.formatDateWithTimezoneOffset(
        new Date(this.dispensarioData.FechaYHoraTransaccion)
      ),
      RfcClienteOProveedor: this.dispensarioData.RfcClienteOProveedor,
      NombreClienteOProveedor: this.dispensarioData.NombreClienteOProveedor,
      Aclaracion: this.dispensarioData.Aclaracion,
    };

    let token = this.authService.ObtenerToken();
    console.log('Datos del movimiento de dispensario:', [dataToSend]);
    this.loadDataService
      .saveArriveDispData(
        [dataToSend],
        this.permisoSelected,
        this.razonSelected,
        token ? token : ''
        // this.fechaMovimiento
      )
      .then((response) => {
        for (let res of response) {
          if (res?.Result === 0 && res.IsCompleted) {
            this.toastr.warning(
              'El dispensario con esta clave no existe.',
              'Error'
            );
          } else if (res?.Result != 0 && res.IsCompleted) {
            this.toastr.success(
              'Movimiento de dispensario registrado correctamente',
              'Éxito'
            );
            // Limpiar formulario
            clearObject(this.dispensarioData);
          }
        }
      })
      .catch((e) => {
        this.toastr.error('Hubo un error al guardar los datos', 'Error');
        console.log(e);
      });
  }
}
