import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss']
})
export class LoadDataComponent implements OnInit {
  excelData: any;
  constructor() { }

  ngOnInit(): void {
  }


  getData(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    // Función para convertir fechas seriales
    function formatExcelData(excelData: any, cols: string[]): any {
      // const date = XLSX.SSF.parse_date_code(excelData.C);
      // excelData.C = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;

      for (let i = 0; i < cols.length; i++) {
        if (!excelData[cols[i]]) {
          excelData[cols[i]] = null;
        }
      }

      return excelData;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: ["A","B","C","D","E","F","G", "H"]});
      console.log(this.excelData);

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
        item = formatExcelData(item, ["A", "B", "C", "D", "E", "F", "G", "H"]);
      }
      
      for (let item of dispensarios) {
        item = formatExcelData(item, ["A"]);
      }

      for (let item of medidoresTanques) {
        item = formatExcelData(item, ["A", "B", "C", "D", "E", "F"]);
      }

      for (let item of medidoresDispensarios) {
        item = formatExcelData(item, ["A", "B", "C", "D", "E", "F"]);
      }

      for (let item of manguerasDispensario) {
        item = formatExcelData(item, ["A", "B"]);
      }
      console.log(headsCells);
      console.log(tanques);
      console.log(dispensarios);
      console.log(medidoresTanques);
      console.log(medidoresDispensarios);
      console.log(manguerasDispensario);

      // console.log(XLSX.utils.sheet_to_json(worksheet));
      
      // console.log(workbook);
    };

    reader.readAsArrayBuffer(file);
  }
}
