import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

import {TraitMgmtModule} from '#components/trait-mgmt'

import {TraitOverviewComponent} from './trait-overview.component'

const ROUTES: Routes = [
  {
    path: '',
    component: TraitOverviewComponent,
  }
]

@NgModule({
  declarations: [
    TraitOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    TraitMgmtModule
  ],
})
export class TraitOverviewModule {
}
