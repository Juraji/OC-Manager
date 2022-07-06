import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {NgbDateAdapter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap'

import {NgbEpochDateAdapter} from './ngb-epoch-date-adapter'

export const ngbDatePickerConfigurer = (s: NgbDatepickerConfig) => {
  s.minDate = {year: 1, month: 1, day: 1}
  s.maxDate = {year: 9999, month: 12, day: 31}
  return () => true;
}

@NgModule({})
export class OcmNgbGlobalConfigurationModule {
  static forRoot(): ModuleWithProviders<OcmNgbGlobalConfigurationModule> {
    return {
      ngModule: OcmNgbGlobalConfigurationModule,
      providers: [
        {provide: NgbDateAdapter, useClass: NgbEpochDateAdapter},
        {provide: APP_INITIALIZER, useFactory: ngbDatePickerConfigurer, deps: [NgbDatepickerConfig], multi: true}
      ]
    }
  }
}
