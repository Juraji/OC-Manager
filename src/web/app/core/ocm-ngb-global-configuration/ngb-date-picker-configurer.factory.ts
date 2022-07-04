import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap'

export const ngbDatePickerConfigurer = (s: NgbDatepickerConfig) => {
  s.minDate = {year: 1, month: 1, day: 1}
  s.maxDate = {year: 9999, month: 12, day: 31}
  return true;
}
