import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { JsonService } from './../../services/json.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent, MatDateRangeInput } from '@angular/material/datepicker';

import * as moment from 'moment';
import { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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

  public placeDetail: string = '';
  public placeDetailLoaded: boolean = false;
  public singleDate: any = '';
  public dateInit: any = '';
  public dateEnd: any = '';

  public checkDay: boolean = false;
  public checkMonth: boolean = false;

  public date = new FormControl(moment());

  constructor(private jsonService: JsonService) { }

  ngOnInit(): void {
  }

  obtenerJSON() {
    this.loading = true;
    if (this.checkDay) {
      console.log('Json Diario!! ');
      this.jsonService.ObtenerJSONDiario(this.dateInit, this.dateEnd).subscribe({
        next: (r) => {
          this.placeDetail = r;
          this.loading = false;
          this.placeDetailLoaded = true;
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
      console.log('Json Mensual!!');
      this.jsonService.ObtenerJSONMensual(this.dateInit, this.dateEnd).subscribe({
        next: (r) => {
          this.placeDetail = r;
          this.loading = false;
          this.placeDetailLoaded = true;
          console.log(r)
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

  dateChangeEvent() {
    let formatDate = this.dateFormat(this.singleDate._d);
    console.log(formatDate);
    this.dateInit = formatDate;
    this.dateEnd = formatDate;
  }

  dateFormat(fecha: string | number | Date) {
    fecha = new Date(fecha);

    var day = ('0' + fecha.getDate()).slice(-2);
    var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var year = fecha.getFullYear();

    return month + '-' + day + '-' + year;
  }

  onCheckBoxChanged(event: any, checkName: string) {
    if (checkName == 'checkDay') {
      if (event) {
        this.checkMonth = false;
        this.date = new FormControl(moment());
      }
    } else if (checkName == 'checkMonth') {
      if (event) {
        this.checkDay = false;
        this.singleDate = '';
        this.reasignValueDatepicker();
      }
    }
    console.log(event);
  }

  onGetDateStartAndEnd(datePicker: any) {
    let temp = new Date(datePicker);
    let month = temp.getMonth(); // Enero - 0, Febrero - 1 , Marzo - 2 , Abril - 3 , Mayo - 4 , Junio - 5 , Julio - 6 , Agosto - 7 , Septiembre - 8 , Octubre - 9 , Noviembre - 10 , Diciembre - 11
    let year = temp.getFullYear();
    let firstDayDate = new Date(year, month, 1);
    let lastDayDate = new Date(year, month + 1, 0);

    console.log('First Day format', this.dateFormat(firstDayDate)); //Primer dia en el Mes Seleccionado
    console.log('Last Day format: ', this.dateFormat(lastDayDate)); //Ultimo dia en el Mes Seleccionado
    this.dateInit = this.dateFormat(firstDayDate);
    this.dateEnd = this.dateFormat(lastDayDate);
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log('Mes/Año: ', ctrlValue._d);
    this.onGetDateStartAndEnd(ctrlValue._d);
  }

  reasignValueDatepicker() {
    const ctrlValue = this.date.value;
    console.log('Mes/Año: ', ctrlValue._d);
    this.onGetDateStartAndEnd(ctrlValue._d);
  }

  generarZipJSON() {
    const dataINFO = {
      json: JSON.stringify(this.placeDetail)
    };

    this.jsonService.ObtenerJSONNombre(this.dateInit, this.dateEnd).subscribe({
      next: (r) => {
        console.log('resp: ', r);
        const zipName = r.NombreArchivo;

        this.jsonService.ObtenerZipJSONInfo(this.dateInit, this.dateEnd, zipName, dataINFO).then((data: any) => {
          console.log(data);
        });
      },
      error: (error) => {
        this.esError = true;
        console.log(JSON.stringify(error));

        if (error.status == 409) {
          let errorsM: [];
          errorsM = error.error;
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
}
