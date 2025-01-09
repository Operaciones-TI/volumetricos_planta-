export interface MovimientoTanque {
    ClaveTanque: string;
    TipoMovimiento: string;
    VolumenInicialTanque: number;
    VolumenFinalTanque: number;
    Volumen: number;
    Temperatura: number;
    PresionAbsoluta: number;
    FechaHoraInicialEntrega: Date | string;
    FechaHoraFinalEntrega: Date | string;
    Cantidad: number;
    PermisoReceptor: string;
    FechaHoraInicial: Date | string;
    VolumenFactura: number;
    Folio: string;
    PrecioCompra: number;
    ImporteTotal: number;
    UUID: string;
    FechaEmisionCFDI: Date | string;
    ClaveVehiculo: string;
    PermisoTransporte: string;
    Proveedor: string;
    RfcProveedor: string;
    PermisoAlmacenamientoDistribucion: string;
    NombreTerminalDistribucion: string;
    Aclaracion: string;
}

export interface MovimientoDispensario {
    ClaveDispensario: string;
    ClaveManguera: string;
    TipoRegistro: string;
    VolumenTotalizadorAcum: number;
    VolumenTotalizadorInsta: number;
    PrecioVentaTotalizadorInstantaneo: number;
    FechaHoraEntrega: Date | string;
    Permiso: string;
    FechaVenta: Date | string;
    CantidadLitros: number;
    PrecioUnitario: number;
    PrecioVentaTotalizadorInsta: number;
    Importe: number;
    UUID: string;
    FechaEmisionCFDI: Date | string;
    RfcCliente: string;
    NombreCliente: string;
    Aclaracion: string;
}