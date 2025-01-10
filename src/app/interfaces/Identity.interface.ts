export interface Identity {
    id: number;
    activo: boolean;
    apellidos: string;
    nombre: string;
    login: string;
    password: string;
    perfil: string,
    ultimaSesion: string;
    expiracionPassword: string;
}