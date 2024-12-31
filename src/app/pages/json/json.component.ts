import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { JsonService } from './../../services/json.service';


@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss']
})
export class JsonComponent implements OnInit {

  public loading: boolean = false;
  public esError: boolean = false;
  public esErrors: boolean = false;
  public esSuccess: boolean = false;
  public mensaje: string = '';
  public mensajes: Array<string> = [];

  rangePicker = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public checkDay: boolean = false;
  public checkMonth: boolean = false;
  public dateInit: any = '';
  public dateEnd: any = '';

  constructor(private jsonService: JsonService) { }

  ngOnInit(): void {
  }

  obtenerJSON() {
    this.loading = true;
    if (this.checkDay) {
      this.jsonService.ObtenerJSONDiario(this.dateInit, this.dateEnd).subscribe({
        next: (r) => {
          this.loading = false;
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
    else {
      this.jsonService.ObtenerJSONMensual(this.dateInit, this.dateEnd).subscribe({
        next: (r) => {
          this.loading = false;
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
  }
}
