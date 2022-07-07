import {HTTP_INTERCEPTORS} from '@angular/common/http'
import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';

import {PortfolioHeaderInterceptor} from './portfolio-header.interceptor'
import {PortfoliosStore} from './portfolios.store'
import {SettingsStore} from './settings-store.service'

export const initializeSettingsStore = (s: SettingsStore) => {
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
        SettingsStore,
        PortfoliosStore,
        {provide: APP_INITIALIZER, useFactory: initializeSettingsStore, deps: [SettingsStore], multi: true},
        {provide: APP_INITIALIZER, useFactory: initializePortfoliosStore, deps: [PortfoliosStore], multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: PortfolioHeaderInterceptor, multi: true}
      ]
    }
  }
}
