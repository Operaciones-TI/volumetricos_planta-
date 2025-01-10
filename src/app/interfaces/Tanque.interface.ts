export interface Tanque {
  ClaveIdentificacionTanque?: string;
  DescripcionLocalizacion?: string;
  VigenciaCalibracionTanque?: string | Date;
  CapacidadTotalTanque?: number;
  CapacidadOperativaTanque?: number;
  CapacidadUtilTanque?: number;
  CapacidadFondajeTanque?: number;
  VolumenMinimoOperacion?: number;
  EstadoTanque?: string | null;
}