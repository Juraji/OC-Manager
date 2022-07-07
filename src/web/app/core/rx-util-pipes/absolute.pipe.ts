import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'absolute'})
export class AbsolutePipe implements PipeTransform {

  transform(value: Nullable<number>): number | null {
    return !!value ? Math.abs(value) : null;
  }

}
