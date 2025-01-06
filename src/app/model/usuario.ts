
export class Usuario{
  constructor(
      public id: number,
      public login: string,
      public password: string,
      public nombre: string,
      public apellidos: string,
      public perfil: string,
      public ultimaSesion: Date
  ){}
}
