import {Pipe, PipeTransform} from '@angular/core';

import {DateDiffPipe} from '#core/date-pipes/date-diff.pipe'

const MS_PER_YEAR = 31557600000

@Pipe({name: 'yearsAgo'})
export class YearsAgoPipe extends DateDiffPipe implements PipeTransform {

  override transform(value: Nullable<number | string | Date>, reference?: Nullable<number | string | Date>): number | null {
    const ms = super.transform(value, reference)
    if (!ms) return null
    return Math.floor(ms / MS_PER_YEAR)
  }

}
