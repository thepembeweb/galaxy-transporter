import { Injectable } from '@angular/core';
import * as XLSX from 'ts-xlsx';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor() {}

  private dataFileUrl = 'assets/data.xlsx';
  private planetsSheetIndex = 0;
  private routesSheetIndex = 1;
  private trafficSheetIndex = 2;

  public getPlanetData() {
    return new Promise((res, rej) => {
      res(this.getWorksheetDataJsonData(this.planetsSheetIndex));
    });
  }

  public getRouteData() {
    return new Promise((res, rej) => {
      res(this.getWorksheetDataJsonData(this.routesSheetIndex));
    });
  }

  public getTrafficData() {
    return new Promise((res, rej) => {
      res(this.getWorksheetDataJsonData(this.trafficSheetIndex));
    });
  }

  public getWorksheetDataJsonData(index) {
    return new Promise((resolve, reject) => {
      const url = this.dataFileUrl;
      const oReq = new XMLHttpRequest();
      let workBook: any;
      oReq.open('GET', url, true);
      oReq.responseType = 'arraybuffer';
      oReq.onload = e => {
        if (oReq.status >= 200 && oReq.status < 300) {
          const arrayBuffer = oReq.response;
          const data = new Uint8Array(arrayBuffer);
          const arr = new Array();
          for (let i = 0; i !== data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
          }
          const bstr = arr.join('');
          workBook = XLSX.read(bstr, { type: 'binary' });
          const workSheetName = workBook.SheetNames[index];
          const workSheet = workBook.Sheets[workSheetName];
          const json = XLSX.utils.sheet_to_json(workSheet, { raw: true });
          resolve(json);
        } else {
          reject(
            console.log('XMLHttpRequest failed; error code:' + oReq.statusText)
          );
        }
      };
      oReq.send();
    });
  }
}
