import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'

import {MainMenuComponent} from './main-menu.component';


@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule
  ],
  exports: [
    MainMenuComponent
  ]
})
export class MainMenuModule {
}
