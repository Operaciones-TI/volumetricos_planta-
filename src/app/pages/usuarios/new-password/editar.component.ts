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
export class NuevoPasswordUsuarioComponent {

  public esError: boolean = false;
  public esErrors: boolean = false;
  public esSuccess: boolean = false;
  public mensaje: string = '';
  public mensajes: Array<string> = [];

  public userDetail: any;

  constructor(private compartirUsuario: AuthService, private router: Router, private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<NuevoPasswordUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: UserData) { }

  ngOnInit() {
    let usuarioPerfil = this.compartirUsuario.ObtenerTipoUsuario();
    if (usuarioPerfil !== "Administrador") {
      this.router.navigate([''], { replaceUrl: true });
    } else {
      this.onActualizarPassword();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onActualizarPassword() {
    this.usuarioService.actualizaPassUsuario(this.dataUsuario.id).subscribe({
      next: (r) => {
        this.esSuccess = true;
        console.log(r);
      },
      error: (e) => {
        console.log(JSON.stringify(e));

        if (e.status == 409) {
          this.esError = true;

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
        } else if (e.status == 200) {

          this.esSuccess = true;

          this.userDetail = e.error.text;

        } else {
          this.esError = true;
          this.mensaje = 'No se ha podido contactar el servidor';
        }
      }
    });
  }

}
