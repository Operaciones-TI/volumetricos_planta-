import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { JsonService } from './../../services/json.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent, MatDateRangeInput } from '@angular/material/datepicker';

import * as moment from 'moment';
import { Moment } from 'moment';

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
      console.log('Json Mensual!!');
      this.jsonService.ObtenerJSONMensual(this.dateInit, this.dateEnd).subscribe({
        next: (r) => {
          this.loading = false;
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
}
