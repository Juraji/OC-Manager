import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {NgbDateAdapter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap'

import {ngbDatePickerConfigurer} from '#core/ocm-ngb-global-configuration/ngb-date-picker-configurer.factory'
import {NgbEpochDateAdapter} from '#core/ocm-ngb-global-configuration/ngb-epoch-date-adapter'

@NgModule({})
export class OcmNgbGlobalConfigurationModule {
  static forRoot(): ModuleWithProviders<OcmNgbGlobalConfigurationModule> {
    return {
      ngModule: OcmNgbGlobalConfigurationModule,
      providers: [
        {provide: NgbDateAdapter, useClass: NgbEpochDateAdapter},
        {provide: APP_INITIALIZER, useFactory: ngbDatePickerConfigurer, deps: [NgbDatepickerConfig]}
      ]
    }
  }
}
