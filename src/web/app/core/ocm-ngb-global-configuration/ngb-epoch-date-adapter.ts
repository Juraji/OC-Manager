import {Injectable} from '@angular/core'
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap'

@Injectable()
export class NgbEpochDateAdapter extends NgbDateAdapter<number> {
  fromModel(value: number | null): NgbDateStruct | null {
    if (typeof value !== 'number') return value
    const d = new Date(value)
    return {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()}
  }

  toModel(date: NgbDateStruct | null): number | null {
    if (date === null) return date
    const d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0)
    return d.getTime();
  }

}
