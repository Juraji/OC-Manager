import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'

import {MainMenuComponent} from './main-menu.component';


@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    MainMenuComponent
  ]
})
export class MainMenuModule {
}
