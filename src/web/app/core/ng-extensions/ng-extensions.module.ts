import {ModuleWithProviders, NgModule} from '@angular/core';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser'

import {bindEventsPluginFactory} from './bind-events-plugin.factory'

@NgModule({})
export class NgExtensionsModule {
  static forRoot(): ModuleWithProviders<NgExtensionsModule> {
    return {
      ngModule: NgExtensionsModule,
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useFactory: bindEventsPluginFactory,
          multi: true,
        }
      ]
    }
  }
}
