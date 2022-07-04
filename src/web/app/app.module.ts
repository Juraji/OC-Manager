import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule, Routes} from '@angular/router'
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {MainMenuModule} from '#components/main-menu'
import {EventSettingsModule} from '#core/event-settings'
import {NgExtensionsModule} from '#core/ng-extensions'
import {OcmApiModule} from '#core/ocm-api'
import {OcmNgbGlobalConfigurationModule} from '#core/ocm-ngb-global-configuration'

import {AppComponent} from './app.component';

const ROUTES: Routes = [
  {
    path: 'characters',
    loadChildren: () => import('./routes/character-management/character-management.module').then(m => m.CharacterManagementModule)
  },
  {
    path: 'settings/events',
    loadChildren: () => import('./routes/event-settings/event-settings.module').then(m => m.EventSettingsModule)
  },
  {
    path: '**',
    redirectTo: 'characters'
  }
]

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    OcmApiModule.forRoot(),
    OcmNgbGlobalConfigurationModule.forRoot(),
    NgExtensionsModule.forRoot(),
    EventSettingsModule.forRoot(),
    ModalsModule.forRoot(),
    MainMenuModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
