import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from '../../../services/user.service';
import { EditarUsuariosComponent } from '../editar/editar.component';

import { MatDateRangeInput } from '@angular/material/datepicker';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NuevoPasswordUsuarioComponent } from '../new-password/editar.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public fechaInicio: any = '';
  public fechaFin: any = '';

  public isLoged: boolean = false;
  public lecturas: any[] = [];
  public busqueda: string = '';
  public esError: boolean = false;
  public mensaje: string = '';

  public displayedColumns: string[] = ['id', 'login', 'nombre', 'apellidos', 'perfil', 'activo', 'actions'];
  public dataSource!: MatTableDataSource<UserData>;
  @ViewChild(MatSort) sort!: MatSort;

  public arrayPagina: any[] = [];
  public totalPagina: number = 0;
  public actualPagina: number = 1;


  constructor(private compartirUsuario: AuthService, private router: Router, private usuarioService: UsuarioService, public dialog: MatDialog) { }

  ngOnInit(): void {
    let usuarioPerfil = this.compartirUsuario.ObtenerTipoUsuario();
    if (usuarioPerfil !== "Administrador") {
      this.router.navigate([''], { replaceUrl: true });
    }
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.ObtenerLecturasUsuarios().subscribe({
      next: (r) => {
        this.lecturas = r;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(r);
        this.dataSource.sort = this.sort;
      },
      error: (e) => {
        this.esError = true;
        if (e.status == 500)
          this.mensaje = e.error;
        else
          this.mensaje = 'No se ha podido contactar el servidor';
      }
    });
  }

  openEditarUsuario(usuarioData: UserData): void {
    console.log(JSON.stringify(usuarioData));

    const dialogRef = this.dialog.open(EditarUsuariosComponent, {
      width: '750px',
      data: { 
        id: usuarioData.id, 
        nombre: usuarioData.nombre, 
        apellidos: usuarioData.apellidos, 
        login: usuarioData.login,
        perfil: usuarioData.perfil,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.route.navigate(['/usuario/lista']);
      
      this.obtenerUsuarios();
    });
  }
  
  openNewPassword(usuarioData: UserData): void {
    console.log(JSON.stringify(usuarioData));

    const dialogRef = this.dialog.open(NuevoPasswordUsuarioComponent, {
      width: '750px',
      data: { 
        id: usuarioData.id, 
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.route.navigate(['/usuario/lista']);
      
      this.obtenerUsuarios();
    });
  }

  clickChangeStatus(paramIdUsuario: number, paramStatus: boolean) {
    let completeUrl: string;
    completeUrl = paramStatus ? 'desactivar' : 'activar';

    this.usuarioService.actualizarEstatusUsuario(paramIdUsuario, completeUrl).subscribe({
      next: (r) => {
        this.obtenerUsuarios();
      },
      error: (e) => {
        this.obtenerUsuarios();
      }
    });
  }

  obtenerPaginas(totalLecturas: number) {
    let pagina = Math.ceil(totalLecturas / 80); // Total de registros por página
    this.arrayPagina = Array.from({ length: pagina }, (_, index) => index + 1);
  }

  cambiarPagina(pagina: number) {
    this.actualPagina = pagina;
    this.obtenerUsuarios();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.fechaInicio = this.dateFormat(dateRangeStart.value);
    this.fechaFin = this.dateFormat(dateRangeEnd.value);
  }

  dateFormat(fecha: string | number | Date) {
    fecha = new Date(fecha);

    var day = ('0' + fecha.getDate()).slice(-2);
    var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var year = fecha.getFullYear();

    return month + '-' + day + '-' + year;
  }

}

export interface UserData {
  id: number;
  nombre: string;
  apellidos: string;
  login: string;
  perfil: string;
  activo: string;
}
