import {HTTP_INTERCEPTORS} from '@angular/common/http'
import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';

import {EventSettingsStore} from './event-settings.store'
import {PortfolioHeaderInterceptor} from './portfolio-header.interceptor'
import {PortfoliosStore} from './portfolios.store'

export const initializeEventSettingsStore = (s: EventSettingsStore) => {
  return () => s.initialize()
}

export const initializePortfoliosStore = (s: PortfoliosStore) => {
  return () => s.initialize()
}

@NgModule()
export class RootStoreModule {
  static forRoot(): ModuleWithProviders<RootStoreModule> {
    return {
      ngModule: RootStoreModule,
      providers: [
        EventSettingsStore,
        PortfoliosStore,
        {provide: APP_INITIALIZER, useFactory: initializeEventSettingsStore, deps: [EventSettingsStore], multi: true},
        {provide: APP_INITIALIZER, useFactory: initializePortfoliosStore, deps: [PortfoliosStore], multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: PortfolioHeaderInterceptor, multi: true}
      ]
    }
  }
}
