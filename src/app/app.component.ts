import { Component } from '@angular/core';

import { Usuario } from './model/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'volumetricos_planta-';

  public usuario: Usuario;
  public token: string = '';

  constructor(
    private route: Router,

  ) {

    this.usuario = new Usuario(0, '', '', '', '', '', new Date());
    this.getLocaStorage();
  }

  getLocaStorage() {
  let identity = localStorage.getItem('identity');
  if (identity !== null) {
    this.route.navigate(['/login']);
  }
  else {
    this.route.navigate(['/home']);
  }
}

}
