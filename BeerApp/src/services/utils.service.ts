import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  makeUnique(array: any[]): any[] {
    return [...new Set(array)];
  }
  uniqueByValueInBreweriesArray(response, value, arrayName): void {
    const uniqueObject = {};
    const data = response;
    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        const objId = data[i].brewery[value];
        uniqueObject[objId] = data[i];
      }
    }
    for (const i in uniqueObject) {
      if (uniqueObject) {
        arrayName.push(uniqueObject[i]);
      }
    }
  }
}
