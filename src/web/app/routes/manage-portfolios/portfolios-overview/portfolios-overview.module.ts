import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {PortfoliosOverviewComponent} from './portfolios-overview.component'

const ROUTES: Routes = [
  {
    path: '',
    component: PortfoliosOverviewComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ModalsModule
  ],
  declarations: [
    PortfoliosOverviewComponent
  ]
})
export class PortfoliosOverviewModule {
}
