import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})
export class LoadDataComponent implements OnInit {
  excelData: any;
  excelAlmacenes: any;
  excelMovimientos: any;
  saving: boolean = false;
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  excelNumberToDate(num: number) {
    let newDate = XLSX.SSF.parse_date_code(num);
    return `${newDate.y}-${String(newDate.m).padStart(2, '0')}-${String(newDate.d).padStart(2, '0')}`;
  }
  

  // showToast(msg: string) {
  //   this.toast.setMessage(msg);
  //   this.toast.isShow = true;

  //   setTimeout(() => {
  //     this.toast.close();
  //   }, 5000);
  // }


  getData() {
    this.almacenesFile();
    this.movimientosFile();

    setTimeout(() => {
      this.saving = false;
    }, 2000);
  }

  formatExcelData(excelData: any, cols: string[]): any {

    for (let i = 0; i < cols.length; i++) {
      if (!excelData[cols[i]]) {
        excelData[cols[i]] = null;
      }
    }

    return excelData;
  }

  almacenesFile() {
    this.saving = true;
    const inputElement = document.getElementById('almacenesFile') as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      console.log('no file');
      this.saving = false;
      return;
    }
    const file = inputElement.files[0];
    if (!file) {
      console.log('no file')
      this.saving = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: ["A","B","C","D","E","F","G", "H"]});

      let headsCells = [];
      let tanques = [];
      let dispensarios = [];
      let medidoresTanques = [];
      let medidoresDispensarios = [];
      let manguerasDispensario = [];

      // if row.A of this.excelData is equals to "Tanque" then add the next rows, but the next rows nust not have "Tanque" in A, until 
      // the next row has "Dispensario" in A
      for (let i = 0; i < this.excelData.length - 1; i++) {
        if(["Tanques", "Dispensarios", "Medidores de tanques", "Medidores de Dispensarios", "Mangueras Dispensario"].includes(this.excelData[i].A)) {
          headsCells.push(i);
        }
      }
      
      tanques = this.excelData.slice(headsCells[0] + 2, headsCells[1]);
      dispensarios = this.excelData.slice(headsCells[1] + 2, headsCells[2]);
      medidoresTanques = this.excelData.slice(headsCells[2] + 2, headsCells[3]);
      medidoresDispensarios = this.excelData.slice(headsCells[3] + 2, headsCells[4]);
      manguerasDispensario = this.excelData.slice(headsCells[4] + 2, headsCells[5]);

      for (let item of tanques) {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E", "F", "G", "H"]);
        if (typeof item.C === "number") {
          item.C = this.excelNumberToDate(item.C);
        }
      }
      
      for (let item of dispensarios) {
        item = this.formatExcelData(item, ["A"]);
      }

      for (let item of medidoresTanques) {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E", "F"]);
        if (typeof item.D === "number") {
          item.D = this.excelNumberToDate(item.D);
        }
      }

      for (let item of medidoresDispensarios) {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E", "F"]);
        if (typeof item.D === "number") {
          item.D = this.excelNumberToDate(item.D);
        }
      }

      for (let item of manguerasDispensario) {
        item = this.formatExcelData(item, ["A", "B"]);
      }

      // for ()
      let obj = {
        tanques: tanques,
        dispensarios: dispensarios,
        medidoresTanques: medidoresTanques,
        medidoresDispensarios: medidoresDispensarios,
        manguerasDispensario: manguerasDispensario
      }

      this.excelAlmacenes = JSON.stringify(obj);
      console.log(this.excelAlmacenes);
      // this.toastr.success('Almacenes cargados correctamente', '', {
      //   timeOut: 3000,
      //   progressBar: true,
      // });
      inputElement.value = '';
    };

    reader.readAsArrayBuffer(file);
  }

  movimientosFile() {
    this.saving = true;
    const inputElement = document.getElementById('movimientosFile') as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      console.log('no movimientos file');
      this.saving = false;
      return;
    }
    const file = inputElement.files[0];
    if (!file) {
      console.log('no movimientos file')
      this.saving = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      console.log(workbook.SheetNames)

      let tanqueHeads = [
        'ClavenTanque',
        'TipoMovimiento',
        'VolumenInicial',
        'Volumenfinal',
        'Volumen',
        'Temperatura',
        'PresionAbsoluta',
        'FechaHoraInicio',
        'FechaHoraFinal',
        'Cantidad',
        'PermisoReceptor',
        'FechaHoraInicial',
        'VolumenFactura',
        'Folio',
        'PrecioCompra',
        'ImporteTotal',
        'Uuid',
        'FechaEmisionCfdi',
        'ClaveVehiculo',
        'PermisoTransporte',
        'Proveedor',
        'RfcProveedor',
        'PermisoAlmacenamientoDistribucion',
        'NombreTerminalDistribucion',
        'Aclaracion',
      ];

      let dispensHeads = [
        'ClavenDispensario',
        'ClaveManguera',
        'TipoRegistro',
        'VolEntregadoTotalAcumulado',
        'VolEntregadoTotalInstantaneo',
        'PrecioVentaTotalizadorInstantaneo',
        'FechaHoraEntrega',
        'Permiso',
        'FechaVenta',
        'CantidadLitros',
        'PrecioUnitario',
        'Importe',
        'Uuid',
        'FechaEmisionCfdi',
        'RfcCliente',
        'NombreCliente',
        'Aclaracion',
      ];

      let cierreHeads = [
        'PermisoPlanta',
        'FechaInicio',
        'VolumenInicial',
        'FechaCierre',
        'VolumenFinal',
        'VolumenSalida',
        'VolumenEntrada',
      ];


      // Add mising keys to data from excel
      const addMissigKeysTanques = (excelData: any) => {
        const newObj = Object.fromEntries(tanqueHeads.map((key, i) => [key, null]));
        return Object.assign(newObj, excelData);
      }
      
      const addMissigKeysDisp = (excelData: any) => {
        const newObj = Object.fromEntries(dispensHeads.map((key, i) => [key, null]));
        return Object.assign(newObj, excelData);
      }

      const addMissigKeysCierre = (excelData: any) => {
        const newObj = Object.fromEntries(cierreHeads.map((key, i) => [key, null]));
        return Object.assign(newObj, excelData);
      }

      let CurrentHeader = tanqueHeads;
      let movTanques: any[] = [];
      let movDisp: any[] = [];
      let movCierre: any[] = [];

      for(let s = 0; s < workbook.SheetNames.length; s++) {
        let data: any[];
        let worksheet = workbook.Sheets[workbook.SheetNames[s]];
        if(workbook.SheetNames[s].includes('Movimientos tanques')) {
          CurrentHeader = tanqueHeads;
          data = XLSX.utils.sheet_to_json(worksheet, {
            header: CurrentHeader,
          });
          data.splice(0,2)
          data = data.map(d => addMissigKeysTanques(d));
          data.map(d => {
            if (typeof d.FechaEmisionCfdi === "number") {
              d.FechaEmisionCfdi = this.excelNumberToDate(d.FechaEmisionCfdi)
            }
          });
          movTanques = data;
        } else if(workbook.SheetNames[s].includes('Movimientos Dispensarios')) {
          CurrentHeader = dispensHeads;
          data = XLSX.utils.sheet_to_json(worksheet, {
            header: CurrentHeader,
          });
          data.splice(0,2)
          data = data.map(d => addMissigKeysDisp(d));
          data.map(d => {
            if(typeof d.FechaVenta === "number") {
              d.FechaVenta = this.excelNumberToDate(d.FechaVenta)
            }

            if (typeof d.FechaEmisionCfdi === "number") {
              d.FechaEmisionCfdi = this.excelNumberToDate(d.FechaEmisionCfdi)
            }
          });
          movDisp = data;
        } else if (workbook.SheetNames[s].includes('Cierre Mensual')) {
          CurrentHeader = cierreHeads;
          data = XLSX.utils.sheet_to_json(worksheet, {
            header: CurrentHeader,
          });
          data.shift();
          data = data.map(d => addMissigKeysCierre(d));
          data.map(d => {
            if (typeof d.FechaInicio === "number") {
              d.FechaInicio = this.excelNumberToDate(d.FechaInicio)
            }

            if (typeof d.FechaCierre === "number") {
              d.FechaCierre = this.excelNumberToDate(d.FechaCierre)
            }
          });
          movCierre = data;
        }
      }

      const movimientos ={
        tanques: movTanques,
        dispensarios: movDisp,
        cierre: movCierre
      };

      this.excelMovimientos = JSON.stringify(movimientos);
      console.log(this.excelMovimientos)
      // this.toastr.success('Movimientos cargados correctamente', '', {
      //   timeOut: 3000,
      //   progressBar: true,
      // });
      inputElement.value = '';
    };

    reader.readAsArrayBuffer(file);
  }
}
