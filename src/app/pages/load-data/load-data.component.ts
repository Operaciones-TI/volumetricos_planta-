import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoadDataService } from '../../services/load-data.service';
import * as XLSX from 'xlsx';
import { Tanque } from 'src/app/interfaces/Tanque.interface';
import { Dispensario } from 'src/app/interfaces/Dispensario.interface';
import { MedidorDispensarios } from 'src/app/interfaces/MedidorDispensario.interface';
import { MedidorTanque } from 'src/app/interfaces/MedidorTanque.interface';
import { MangueraDispensario } from 'src/app/interfaces/MangueraDispensario.interface';
import { IPermisos, Permiso } from 'src/app/interfaces/Permiso.interface';
import { PermisoService } from 'src/app/services/permiso.service';
import { AuthService } from 'src/app/services/auth.service';

import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { IRazonSocial } from 'src/app/interfaces/RazonSocial.interface';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss'],
})
export class LoadDataComponent implements OnInit {
  excelData: any;
  excelAlmacenes: any;
  excelMovimientos: any;
  saving: boolean = false;
  almacenesSaved: boolean = false;
  movimientosSaved: boolean = false;
  razonSelected: number = 0;
  permisoSelected: number = 0;
  
  razonesSociales: IRazonSocial[] = [];
  permisos: Permiso[] = [];

  constructor(
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private router: Router,
    private permisoService: PermisoService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.getRazonesSociales()
    this.getPermisos(this.razonSelected);
  }

  async descargarZip(data: any) {
    // const data = JSON.stringify({ iFecha: '2024-12-30', fFecha: '2024-12-30' });
    const zip = new JSZip();
    zip.file('data.json', data);
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const url = document.createElement('a');
    url.href = URL.createObjectURL(zipBlob);
    url.download = 'data.zip';
    document.body.appendChild(url);
    url.click();
  }

  excelNumberToDate(num: number) {
    let newDate = XLSX.SSF.parse_date_code(num);
    return `${newDate.y}-${String(newDate.m).padStart(2, '0')}-${String(newDate.d).padStart(2, '0')}`;
  }

  getPermisos(idRazonSocial: number) {
    const token = this.authService.ObtenerToken();
    this.permisoService.getPermisos(idRazonSocial, token ? token : '')
    .then((permisos: Permiso[]) => {
      this.permisos = permisos;
    })
    .catch(e => {
      console.log(e);
    });
  }

  async getRazonesSociales() {
    try {
      const token = this.authService.ObtenerToken();
      const data = await this.permisoService.getRazonSocialData(token ? token : '');
      this.razonesSociales = data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  saveData() {
    if (this.razonSelected === 0 || this.permisoSelected === 0) {
      this.toastr.warning('Por favor, seleccione una razón social y un permiso', 'Campos Requeridos');
      return;
    } else {
      this.almacenesFile();
      this.movimientosFile();
    }
  }

  formatExcelData(excelData: any, cols: string[]): any {

    for (let i = 0; i < cols.length; i++) {
      if (!excelData[cols[i]]) {
        excelData[cols[i]] = null;
      }
    }

    return excelData;
  }

  // ----------------------------------------------------------------------------------------
  // Format Object functions with missing keys
  // ----------------------------------------------------------------------------------------
  async formatTanques(oldKeys: any): Promise<Tanque> {
    return new Promise((resolve, reject) => {
      resolve({
        ClaveIdentificacionTanque: oldKeys.A,
        DescripcionLocalizacion: oldKeys.B,
        VigenciaCalibracionTanque: oldKeys.C,
        CapacidadTotalTanque: oldKeys.D,
        CapacidadOperativaTanque: oldKeys.E,
        CapacidadUtilTanque: oldKeys.F,
        CapacidadFondajeTanque: oldKeys.G,
        VolumenMinimoOperacion: oldKeys.H,
        EstadoTanque: null
      }),
      reject((e: Error) => {
        console.error('Error formatting tanques', e);
      });
    });
  }

  async formatDispensarios(oldKeys: any): Promise<Dispensario> {
    return new Promise((resolve, reject) => {
      resolve({
        ClaveDispensario: oldKeys.A,
      }),
      reject((e: Error) => {
        console.error('Error formatting tanques', e);
      });
    });
  }

  async formatMedidoresDispensario(oldKeys: any): Promise<MedidorDispensarios> {
    return new Promise((resolve, reject) => {
      resolve({
        ClaveDispensario: oldKeys.A,
        SistemaMedicion: oldKeys.B,
        DescripcionLocalizacion: oldKeys.C,
        VigenciaCalibracion: oldKeys.D,
        IncertidumbreMedicion: oldKeys.E,
      }),
      reject((e: Error) => {
        console.error('Error formatting tanques', e);
      });
    });
  }

  async formatManguerasDispensario(oldKeys: any): Promise<MangueraDispensario> {
    return new Promise((resolve, reject) => {
      resolve({
        ClaveDispensario: oldKeys.A,
        ClaveManguera: oldKeys.B
      }),
      reject((e: Error) => {
        console.error('Error formatting tanques', e);
      });
    });
  }
  
  async formatMedidoresTanques(oldKeys: any): Promise<MedidorTanque> {
    return new Promise((resolve, reject) => {
      resolve({
        ClaveTanque: oldKeys.A,
        SistemaMedicionTanque: oldKeys.B,
        DescripcionLocalizacion: oldKeys.C,
        VigenciaCalibracion: oldKeys.D,
        IncertidumbreMedicion: oldKeys.E
      }),
      reject((e: Error) => {
        console.error('Error formatting tanques', e);
      });
    });
  }


  // ----------------------------------------------------------------------------------------
  // Get files data from input and convert it to JSON
  // ----------------------------------------------------------------------------------------

  almacenesFile() {
    this.saving = true;
    const inputElement = document.getElementById('almacenesFile') as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      this.saving = false;
      return;
    }
    const file = inputElement.files[0];
    if (!file) {
      this.saving = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
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

      tanques = await Promise.all(tanques.map(async (item: any) => {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E", "F", "G", "H"]);
        if (typeof item.C === "number") {
          item.C = this.excelNumberToDate(item.C);
        }
        item = await this.formatTanques(item);
        return item;
      }));

      dispensarios = await Promise.all(dispensarios.map(async (item: any) => {
        item = this.formatExcelData(item, ["A"]);
        item = await this.formatDispensarios(item);
        return item;
      }));

      medidoresTanques = await Promise.all(medidoresTanques.map(async (item: any) => {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E"]);
        if (typeof item.D === "number") {
          item.D = this.excelNumberToDate(item.D);
        }
        item = await this.formatMedidoresTanques(item);
        return item;
      }));

      medidoresDispensarios = await Promise.all(medidoresDispensarios.map(async (item: any) => {
        item = this.formatExcelData(item, ["A", "B", "C", "D", "E"]);
        if (typeof item.D === "number") {
          item.D = this.excelNumberToDate(item.D);
        }
        item = await this.formatMedidoresDispensario(item);
        return item;
      }));

      manguerasDispensario = await Promise.all(manguerasDispensario.map(async (item: any) => {
        item = this.formatExcelData(item, ["A", "B"]);
        item = await this.formatManguerasDispensario(item);
        return item;
      }));

      let obj = {
        tanques: tanques,
        dispensarios: dispensarios,
        medidoresTanques: medidoresTanques,
        medidoresDispensarios: medidoresDispensarios,
        manguerasDispensario: manguerasDispensario
      }

      this.excelAlmacenes = JSON.stringify(obj);
      inputElement.value = '';

      let token = this.authService.ObtenerToken();

      this.loadDataService.saveAlmacenesData(
        obj, 
        this.permisoSelected, 
        this.razonSelected, 
        token ? token : ''
      ).then(response => {
        if (response) {
          // const { tanques, dispensarios, medidoresTanques, medidoresDispensarios, manguerasDispensario } = response;
          const res = Object.keys(response)
          console.log('keys: ',res)
          for (let item of res){
            let resItem = item.charAt(0).toUpperCase() + item.slice(1);
            console.log(resItem)
            console.log(`key ${item}: `, (response as any)[item]);
            let failed = (response as any)[item].filter((r: any) => r.Result === 0);
            let succesfull = (response as any)[item].filter((r: any) => r.Result > 0);
            console.log('failed: ', failed);
            console.log('succesfull: ', succesfull);
            if (succesfull.length > 0) {
              this.toastr.success(`${succesfull.length} ${resItem} guardados correctamente`, `${resItem}`,  {
                timeOut: 5000,
                progressBar: true, 
                disableTimeOut: true
              });
            }
            if (failed.length > 0) {
              this.toastr.warning(`${failed.length} ${resItem} ya extistian en la base de datos con el mismo permiso`, `${resItem}`, {
                timeOut: 5000,
                progressBar: true,
                disableTimeOut: true
              });
            }
          }
        }
        console.log('res from service: ', response);
        this.toastr.success('Almacenes guardados correctamente', '', {
            timeOut: 3000,
            progressBar: true,
          });
        this.almacenesSaved = true;
        this.saving = false;
      }).catch(e => {
        this.toastr.error('Algo fallo en el servidor al guardar los almacenes', '', {
          timeOut: 3000,
          progressBar: true,
        });
        this.saving = false;
        console.log(e)
      });
    };

    reader.readAsArrayBuffer(file);

  }

  movimientosFile() {
    this.saving = true;
    const inputElement = document.getElementById('movimientosFile') as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      this.saving = false;
      return;
    }
    const file = inputElement.files[0];
    if (!file) {
      this.saving = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      let tanqueHeads = [
        'ClaveTanque',
        'TipoMovimiento',
        'VolumenInicialTanque',
        'VolumenFinalTanque',
        'VolumenEntregado',
        'Temperatura',
        'PresionAbsoluta',
        'FechaHoraInicialEntrega',
        'FechaHoraFinalEntrega',
        'Cantidad',
        'PermisoReceptor',
        'FechaHoraInicial',
        'VolumenDocumentado',
        'Folio',
        'PrecioCompra',
        'Valor',
        'Uuid',
        'FechaYHoraTransaccion',
        'ClaveVehiculo',
        'PermisoTransporte',
        'NombreClienteOProveedor',
        'RfcClienteOProveedor',
        'PermisoAlmacenamientoDistribucion',
        'NombreTerminalDistribucion',
        'Aclaracion',
      ];

      let dispensHeads = [
        'ClaveDispensario',
        'ClaveManguera',
        'TipoDeRegistro',
        'VolumenEntregadoTotalizadorAcum',
        'VolumenEntregadoTotalizadorInsta',
        'PrecioVentaTotalizadorInstantaneo',
        'FechaHoraEntrega',
        'Permiso',
        'FechaVenta',
        'CantidadLitros',
        'PrecioUnitario',
        'Importe',
        'Uuid',
        'FechaYHoraTransaccion',
        'RfcClienteOProveedor',
        'NombreClienteOProveedor',
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

      let token = this.authService.ObtenerToken();

      this.excelMovimientos = JSON.stringify(movimientos);
      this.loadDataService.saveMovimientosData(
        movimientos, 
        this.permisoSelected, 
        this.razonSelected, 
        token ? token : ''
      ).then(response => {
        // const { tanques, dispensarios, medidoresTanques, medidoresDispensarios, manguerasDispensario } = response;
        const res = Object.keys(response)
        console.log('keys: ',res)
        for (let item of res){
          let resItem = item.charAt(0).toUpperCase() + item.slice(1);
          console.log(resItem)
          console.log(`key ${item}: `, (response as any)[item]);
          let failed = (response as any)[item].filter((r: any) => r.Result === 0);
          let succesfull = (response as any)[item].filter((r: any) => r.Result > 0);
          console.log('failed: ', failed);
          console.log('succesfull: ', succesfull);
          if (succesfull.length > 0) {
            this.toastr.success(`${succesfull.length} ${resItem} guardados correctamente`, `${resItem}`,  {
              timeOut: 5000,
              progressBar: true, 
              disableTimeOut: true
            });
          }
          if (failed.length > 0) {
            this.toastr.warning(`${failed.length} ${resItem} ya extistian en la base de datos con el mismo permiso`, `${resItem}`, {
              timeOut: 5000,
              progressBar: true,
              disableTimeOut: true
            });
          }
        }
      }).catch((e) => {
        console.log(e);
        this.toastr.error('Algo fallo al guardar los movimientos', '', {
          timeOut: 3000,
          progressBar: true,
        });
        this.saving = false;
      });
      
      inputElement.value = '';
    };

    reader.readAsArrayBuffer(file);
  }
}
