export interface Permiso {
  Id: number;
  IdRazonSocial: number | null; 
  RfcRepresentanteLegal: string | null;
  RfcProveedor: string | null;
  Caracter: string;
  ModalidadPermiso: string | null;
  NumPermiso: string | null;
}

export interface IPermisos {
  id: number;
  idRazonSocial: number;
  rfcRepresentanteLegal: string;
  rfcProveedor: string;
  caracter: string;
  modalidadPermiso: string;
  numPermiso: string;
}