import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/user.service';

export interface UserData {
  id: number;
  nombre: string;
  apellidos: string;
  login: string;
  perfil: string;
}


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarUsuariosComponent {

  public esError: boolean = false;
  public esErrors: boolean = false;
  public esSuccess: boolean = false;
  public mensaje: string = '';
  public mensajes: Array<string> = [];

  public perfiles = [
    { "nombre": "Administrador" },
    { "nombre": "Supervisor" },
    { "nombre": "Auditor" },
    { "nombre": "Operador" }
  ]

  constructor(private compartirUsuario: AuthService, private router: Router, private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<EditarUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: UserData) { }

  ngOnInit() {
    let usuarioPerfil = this.compartirUsuario.ObtenerTipoUsuario();
    if (usuarioPerfil !== "Administrador") {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onActualizarUsuario() {
    this.usuarioService.actualizarUsuario(this.dataUsuario).subscribe({
      next: (r) => {
        this.esSuccess = true;

        setTimeout(() => {
          this.onNoClick();
        }, 3000);
      },
      error: (e) => {
        this.esError = true;
        console.log(JSON.stringify(e));

        if (e.status == 409) {
          let errorsM: [];
          errorsM = e.error;
          console.log(errorsM);
          this.esErrors = true;
          errorsM.forEach((errorMessage: string) => {
            if (errorMessage.includes('empty')) {
              let temp = errorMessage.split(':', 2);
              let newString = `El campo: "${temp[0]}" es requerido!`;
              this.mensajes.push(newString);
            } else {
              let temp = errorMessage.split(':', 2);
              this.mensajes.push(temp[1]);
            }
          });
        } else
          this.mensaje = 'No se ha podido contactar el servidor';
      }
    });
  }

}
