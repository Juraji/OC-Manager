import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateDiff'})
export class DateDiffPipe implements PipeTransform {

  transform(value: Nullable<number | string | Date>, reference?: Nullable<number | string | Date>): number | null {
    if (!value) return null
    const sourceDate = new Date(value)
    const referenceDate = !!reference ? new Date(reference) : new Date()
    return Math.floor(referenceDate.getTime() - sourceDate.getTime())
  }

}
