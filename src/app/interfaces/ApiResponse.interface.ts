export interface IApiResponse {
  Result: number;
  Id: number;
  IsCanceled: boolean;
  IsCompleted: boolean;
  IsCompletedSuccessfully: boolean;
  IsFaulted: boolean;
  Status: number;
  CreationOptions: number;
  Exception: any;
  AsycState: any;
}

export interface AlmacenesResponse {
  tanques: IApiResponse[];
  dispensarios: IApiResponse[];
  medidoresTanques: IApiResponse[];
  medidoresDispensarios: IApiResponse[];
  manguerasDispensario: IApiResponse[];
}