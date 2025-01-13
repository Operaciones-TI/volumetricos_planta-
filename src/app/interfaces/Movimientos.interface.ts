export interface MovimientoTanque {
    ClaveTanque: string;
    TipoMovimiento: string;
    VolumenInicialTanque: number;
    VolumenFinalTanque: number;
    VolumenEntregado: number;
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
    Uuid: string;
    FechaYHoraTransaccion: Date | string;
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
    TipoDeRegistro: "D" | "E" | "J" | "A" | "N" | "C";
    VolumenEntregadoTotalizadorAcum: number;
    VolumenEntregadoTotalizadorInsta: number;
    PrecioVentaTotalizadorInsta: number;
    FechaHoraEntrega: Date | string;
    Permiso: string;
    FechaVenta: Date | string;
    CantidadLitros: number;
    PrecioUnitario: number;
    Importe: number;
    Uuid: string;
    FechaYHoraTransaccion: Date | string;
    RfcClienteOProveedor: string;
    NombreClienteOProveedor: string;
    Aclaracion: string;
}