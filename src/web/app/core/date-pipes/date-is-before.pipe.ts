import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateIsBefore'})
export class DateIsBeforePipe implements PipeTransform {

  transform(value: Nullable<number | string | Date>, reference?: Nullable<number | string | Date>): boolean {
    if (value === null || value === undefined) return true
    const referenceDate = !!reference ? new Date(reference) : new Date()
    return new Date(value).getTime() < referenceDate.getTime()
  }
}
