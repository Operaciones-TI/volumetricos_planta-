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

  // Métodos para manejar los formularios
  registrarMovimientoTanque() {
    const MovimientoTanqueFormat = [{

        ClaveTanque: this.tanqueData.ClaveTanque,
        TipoMovimiento: this.tanqueData.TipoMovimiento,
        VolumenInicialTanque: this.tanqueData.VolumenInicialTanque,
        VolumenFinalTanque: this.tanqueData.VolumenFinalTanque,
        Volumen: this.tanqueData.Volumen,
        Temperatura: this.tanqueData.Temperatura,
        PresionAbsoluta: this.tanqueData.PresionAbsoluta,
        FechaHoraInicialEntrega: this.tanqueData.FechaHoraInicialEntrega,
        FechaHoraFinalEntrega: this.tanqueData.FechaHoraFinalEntrega,
        Cantidad: this.tanqueData.Cantidad,
        PermisoReceptor: this.tanqueData.PermisoReceptor,
        FechaHoraInicial: this.tanqueData.FechaHoraInicial,
        VolumenFactura: this.tanqueData.VolumenFactura,
        Folio: this.tanqueData.Folio,
        PrecioCompra: this.tanqueData.PrecioCompra,
        ImporteTotal: this.tanqueData.ImporteTotal,
        UUID: this.tanqueData.UUID,
        FechaEmisionCFDI: this.tanqueData.FechaEmisionCFDI,
        ClaveVehiculo: this.tanqueData.ClaveVehiculo,
        PermisoTransporte: this.tanqueData.PermisoTransporte,
        Proveedor: this.tanqueData.Proveedor,
        RfcProveedor: this.tanqueData.RfcProveedor,
        PermisoAlmacenamientoDistribucion: this.tanqueData.PermisoAlmacenamientoDistribucion,
        NombreTerminalDistribucion: this.tanqueData.NombreTerminalDistribucion,
        Aclaracion: this.tanqueData.Aclaracion 
    }];
  
    console.log('Array de movimientos:', MovimientoTanqueFormat);
  }

  registrarMovimientoDispensario() {
    const MovimientoDispensarioFormat = [{

        ClaveDispensario: this.dispensarioData.ClaveDispensario,
        ClaveManguera: this.dispensarioData.ClaveManguera,
        TipoRegistro: this.dispensarioData.TipoRegistro,
        VolumenTotalizadorAcum: this.dispensarioData.VolumenTotalizadorAcum,
        VolumenTotalizadorInsta: this.dispensarioData.VolumenTotalizadorInsta,
        PrecioVentaTotalizadorInstantaneo: this.dispensarioData.PrecioVentaTotalizadorInstantaneo,
        FechaHoraEntrega: this.dispensarioData.FechaHoraEntrega,
        Permiso: this.dispensarioData.Permiso,
        FechaVenta: this.dispensarioData.FechaVenta,
        CantidadLitros: this.dispensarioData.CantidadLitros,
        PrecioUnitario: this.dispensarioData.PrecioUnitario,
        PrecioVentaTotalizadorInsta: this.dispensarioData.PrecioVentaTotalizadorInsta,
        Importe: this.dispensarioData.Importe,
        UUID: this.dispensarioData.UUID,
        RfcCliente: this.dispensarioData.RfcCliente,
        NombreCliente: this.dispensarioData.NombreCliente,
        Aclaracion: this.dispensarioData.Aclaracion 
    }];


    console.log('Datos del movimiento de dispensario:', MovimientoDispensarioFormat);
  }


}