import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
// import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { Global } from './../../services/global';
// import { QRCodeComponent } from './code-modal/code-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {

  public login!: string;
  public pwd!: string;
  public esError: boolean = false;
  public mensaje: string = '';

  constructor(
    private app: AppComponent,
    private route: Router,
    private usrServ: AuthService,
    // public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // let identity = localStorage.getItem('identity');
    // if (identity !== null) {
    //   this.usrServ.updateLogin(true);

    //   this.route.navigate(['/']);
    // }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.route.navigate(['home']);
  }

  Login() {
    this.usrServ.Login(this.login, this.pwd).subscribe({
      next: (r) => {
        console.log(r);
        this.usrServ.updateLogin(true);

        this.app.token = r.token;
        this.app.usuario = r.usuario;
        localStorage.setItem('identity', JSON.stringify(r.usuario));
        localStorage.setItem('token', r.token);

        this.route.navigate(['home'])
          .then(() => {
            window.location.reload();
          });
      },
      error: (e) => {
        this.esError = true;
        if (e.status == 500)
          this.mensaje = e.error;
        else if(e.status == 409) {
          console.log(e);
          this.mensaje = e.error;
        }
        else if(e.status == 404) {
          console.log(e);
          this.mensaje = e.error;
        }
        else
          this.mensaje = 'No se ha podido contactar el servidor';
      }
    });
  }

  // onOpenQRDialog() {
  //   this.dialog.open(QRCodeComponent, {width: '450px'});
  // }
}
