import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap'

import {MainMenuComponent} from './main-menu/main-menu.component';
import { PortfolioSelectorComponent } from './portfolio-selector/portfolio-selector.component';


@NgModule({
  declarations: [
    MainMenuComponent,
    PortfolioSelectorComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        NgbDropdownModule,
    ],
  exports: [
    MainMenuComponent
  ]
})
export class MainMenuModule {
}
