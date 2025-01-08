import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermisoService } from 'src/app/services/permiso.service';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  
  isDispensarios: boolean = false;
  razonesSociales: IRazonSocial[] = [];
  permisos: Permiso[] = [];
  razonSelected: number = 0;
  permisoSelected: number = 0;

  constructor(
    private permisoService: PermisoService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    await this.getRazonesSociales();
    await this.getPermisos(this.razonSelected);
  }

  getPermisos(idRazonSocial: number) {
    this.permisoService.getPermisos(idRazonSocial)
    .then((permisos: Permiso[]) => {
      console.log(permisos);
      this.permisos = permisos;
    })
    .catch(e => {
      console.log(e);
    });
  }

  async getRazonesSociales() {
    try {
      const data = await this.permisoService.getRazonSocialData();
      console.log(data);
      this.razonesSociales = data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}