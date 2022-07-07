import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'monthAsDate'
})
export class MonthAsDatePipe implements PipeTransform {

  transform(value: Nullable<number | string>, reference?: number | string | Date): Date | null {
    if (!value) return null
    const d = !!reference ? new Date(reference) : new Date()
    if (typeof value === 'number') d.setMonth(value)
    else d.setMonth(parseInt(value))
    return d;
  }

}
