import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'count'})
export class CountPipe implements PipeTransform {

  transform(value: Nullable<unknown[] | { length: number }>): number {
    return !!value ? value.length : 0;
  }

}
