import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule, Routes} from '@angular/router'
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {MainMenuModule} from '#components/main-menu'
import {NgExtensionsModule} from '#core/ng-extensions'
import {OcmApiModule} from '#core/ocm-api'
import {OcmNgbGlobalConfigurationModule} from '#core/ocm-ngb-global-configuration'
import {RootStoreModule} from '#core/root-store'

import {AppComponent} from './app.component';

const ROUTES: Routes = [
  {
    path: 'characters',
    loadChildren: () => import('./routes/manage-characters/manage-characters.module').then(m => m.ManageCharactersModule)
  },
  {
    path: 'memories',
    loadChildren: () => import('./routes/manage-memories/manage-memories.module').then(m => m.ManageMemoriesModule)
  },
  {
    path: 'images',
    loadChildren: () => import('./routes/image-gallery/image-gallery.module').then(m => m.ImageGalleryModule)
  },
  {
    path: 'portfolios',
    loadChildren: () => import('./routes/manage-portfolios/manage-portfolios.module').then(m => m.ManagePortfoliosModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./routes/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'traits',
    loadChildren: () => import('./routes/manage-traits/manage-traits.module').then(m => m.ManageTraitsModule)
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
    RouterModule.forRoot(ROUTES, {useHash: true}),
    OcmApiModule.forRoot(),
    OcmNgbGlobalConfigurationModule.forRoot(),
    NgExtensionsModule.forRoot(),
    RootStoreModule.forRoot(),
    ModalsModule.forRoot(),
    MainMenuModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
