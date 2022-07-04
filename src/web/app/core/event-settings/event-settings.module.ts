import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';

import {EventSettingsStore} from '#core/event-settings/event-settings.store'

export const initializeEventSettingsStore = (s: EventSettingsStore) => {
  s.initialize()
  return true;
}

@NgModule()
export class EventSettingsModule {
  static forRoot(): ModuleWithProviders<EventSettingsModule> {
    return {
      ngModule: EventSettingsModule,
      providers: [
        EventSettingsStore,
        {provide: APP_INITIALIZER, useFactory: initializeEventSettingsStore, deps: [EventSettingsStore]}
      ]
    }
  }
}
