import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';
import { MovimientoTanque, MovimientoDispensario } from 'src/app/interfaces/Movimientos.interface';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  
  isDispensarios: boolean = false;
  razonesSociales: IRazonSocial[] = [];
  permisos: Permiso[] = [];
  razonSelected: number = 0;
  permisoSelected: number = 0;

  // Objetos para los formularios
  tanqueData: MovimientoTanque = {
    ClaveTanque: '',
    TipoMovimiento: '',
    VolumenInicialTanque: 0,
    VolumenFinalTanque: 0,
    Volumen: 0,
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
    UUID: '',
    FechaEmisionCFDI: new Date(),
    ClaveVehiculo: '',
    PermisoTransporte: '',
    Proveedor: '',
    RfcProveedor: '',
    PermisoAlmacenamientoDistribucion: '',
    NombreTerminalDistribucion: '',
    Aclaracion: ''
  };

  dispensarioData: MovimientoDispensario = {
    ClaveDispensario: '',
    ClaveManguera: '',
    TipoRegistro: '',
    VolumenTotalizadorAcum: 0,
    VolumenTotalizadorInsta: 0,
    PrecioVentaTotalizadorInstantaneo: 0,
    FechaHoraEntrega: new Date(),
    Permiso: '',
    FechaVenta: new Date(),
    CantidadLitros: 0,
    PrecioUnitario: 0,
    PrecioVentaTotalizadorInsta: 0,
    Importe: 0,
    UUID: '',
    FechaEmisionCFDI: new Date(),
    RfcCliente: '',
    NombreCliente: '',
    Aclaracion: ''
  };

  constructor(
    private permisoService: PermisoService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    await this.getRazonesSociales();
    await this.getPermisos(this.razonSelected);
  }

  getPermisos(idRazonSocial: number) {
    this.permisoService.getPermisos(idRazonSocial)
    .then((permisos: Permiso[]) => {
      this.permisos = permisos;
    })
    .catch(e => {
      console.log(e);
    });
  }

  async getRazonesSociales() {
    try {
      const data = await this.permisoService.getRazonSocialData();
      this.razonesSociales = data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // Métodos para manejar los formularios
  registrarMovimientoTanque() {
    console.log('Array de movimientos:', this.tanqueData);
  }

  registrarMovimientoDispensario() {
    console.log('Datos del movimiento de dispensario:', this.dispensarioData);
  }


}