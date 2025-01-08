import { Component, OnInit } from '@angular/core';
import { Permiso } from 'src/app/interfaces/Permiso.interface';
import { PermisoService } from 'src/app/services/permiso.service';
import { ToastrService } from 'ngx-toastr';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';
@Component({
  selector: 'app-razon-social',
  templateUrl: './razon-social.component.html',
  styleUrls: ['./razon-social.component.scss']
})
export class RazonSocialComponent implements OnInit {
  data: Permiso = {
    Id: 0,
    IdRazonSocial: 0,
    RfcRepresentanteLegal: null,
    RfcProveedor: null,
    Caracter: 'permisionario',
    ModalidadPermiso: null,
    NumPermiso: null
  }
  razonesSociales: IRazonSocial[] = [];
  razonesLoading: boolean = false;

  constructor(
    private permisoService: PermisoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getRazonesSociales();
  }

  getRazonesSociales() {
    this.razonesLoading = true;
    this.permisoService.getRazonSocialData()
    .then(data => {
      this.razonesSociales = data;
      this.data.IdRazonSocial = this.razonesSociales[0].Id;
      this.razonesLoading = false;
    })
    .catch(error => {
      this.razonesLoading = false;
      this.toastr.error(error.message || 'Error al cargar razones sociales', 'Error');
    });
  }

  isValidForm() {
    return this.data.IdRazonSocial && this.data.RfcRepresentanteLegal && this.data.RfcProveedor && this.data.ModalidadPermiso && this.data.NumPermiso;
  }

  clearForm() {
    this.data = {
      Id: 0,
      IdRazonSocial: null,
      RfcRepresentanteLegal: null,
      RfcProveedor: null,
      Caracter: this.data.Caracter,
      ModalidadPermiso: null,
      NumPermiso: null
    }
  }
  
  handleSubmit() {
    // event.preventDefault();
    if (!this.isValidForm()) {
      this.toastr.warning('Por favor, complete todos los campos', 'Campos Requeridos');
      return;
    }

    console.log(this.data);

    this.permisoService.savePermisoData(this.data, 'token').then(data => {
      this.toastr.success('Permiso guardado exitosamente', 'Éxito');
      this.clearForm();
    }).catch(error => {
      console.error('Error al guardar permiso:', error);
      if (error.status === 400) {
        const errors = error.error;

        for (let e of errors) {
          this.toastr.error(e, 'Error'); 
        }
      } else if (error.status === 409) {
        this.toastr.error(error.error, 'Error');
      } else {
      this.toastr.error(error.message || 'Error al guardar los datos', 'Error');
      }
    });
  }
}
