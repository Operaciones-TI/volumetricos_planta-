import { Component, OnInit } from '@angular/core';
import { RazonSocialService, RazonSocialData } from 'src/app/services/razon-social.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-razon-planta',
  templateUrl: './razon-planta.component.html',
  styleUrls: ['./razon-planta.component.scss']
})
export class RazonPlantaComponent implements OnInit {
  plantaData: RazonSocialData = {
    RazonSocialName: '',
    PlantaName: '',
    RfcContribuyente: ''
  };

  constructor(
    private razonSocialService: RazonSocialService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    try {
      if (!this.plantaData.RazonSocialName || !this.plantaData.PlantaName || !this.plantaData.RfcContribuyente) {
        this.toastr.warning('Por favor, complete todos los campos', 'Campos Requeridos');
        return;
      }
      const token = this.authService.ObtenerToken();
      const response = await this.razonSocialService.saveRazonSocialData(this.plantaData, token ? token : '');
      
      if (response) {
        this.plantaData = {
          RazonSocialName: '',
          PlantaName: '',
          RfcContribuyente: ''
        };
        this.toastr.success('Datos guardados exitosamente', 'Éxito');
      }
    } catch (error: any) {
      console.error('Error al guardar:', error);
      this.toastr.error(error.message || 'Error al guardar los datos', 'Error');
    }
  }
}