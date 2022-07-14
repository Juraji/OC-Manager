import {Pipe, PipeTransform} from '@angular/core';

const FACTOR = 1024
const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

@Pipe({name: 'bytesToHuman'})
export class BytesToHumanPipe implements PipeTransform {

  transform(value: Nullable<number>, decimals = 2): unknown {
    if (value === null || value === undefined || value < 0) return 'unknown'
    if (value === 0) return '0 Bytes';
    const i = Math.floor(Math.log(value) / Math.log(FACTOR));
    return parseFloat((value / Math.pow(FACTOR, i)).toFixed(decimals)) + ' ' + SIZES[i];
  }

}
