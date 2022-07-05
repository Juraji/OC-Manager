import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

import {TraitMgmtModule} from '#components/trait-mgmt'

import {TraitOverviewComponent} from './trait-overview.component'
import {TraitOverviewResolve} from './trait-overview.resolve'

const ROUTES: Routes = [
  {
    path: '',
    component: TraitOverviewComponent,
    resolve: {
      storeData: TraitOverviewResolve
    }
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
  providers: [TraitOverviewResolve]
})
export class TraitOverviewModule {
}
