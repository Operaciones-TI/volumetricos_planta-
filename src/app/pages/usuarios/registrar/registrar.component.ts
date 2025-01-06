import { Component, OnInit } from '@angular/core';

import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/user.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarUsuariosComponent implements OnInit {

  public userDetail: any;
  public esError: boolean = false;
  public esErrors: boolean = false;
  public esSuccess: boolean = false;
  public mensaje: string = '';
  public mensajes: Array<string> = [];

  public usuario: {
    nombre: string,
    apellidos: string,
    login: string,
    perfil: string
  } = {
      nombre: '',
      apellidos: '',
      login: '',
      perfil: ''
    };

  constructor(private compartirUsuario: AuthService, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    let usuarioPerfil = this.compartirUsuario.ObtenerTipoUsuario();
    if (usuarioPerfil !== "Administrador") {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

  registrarUsuario() {
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (r) => {
        console.log(JSON.stringify(r));

        this.userDetail = r;
        this.esSuccess = true;
        this.clearFormulario();
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
          this.esErrors = false;
        this.mensaje = 'No se ha podido contactar el servidor';
      }
    });
  }

  clearFormulario() {
    this.usuario.nombre = "";
    this.usuario.apellidos = "";
    this.usuario.perfil = "";
    this.usuario.login = "";
  }
}
