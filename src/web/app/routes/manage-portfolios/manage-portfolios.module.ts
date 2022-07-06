import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

const ROUTES: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./portfolios-overview/portfolios-overview.module').then(m => m.PortfoliosOverviewModule)
  },
  {
    path: 'edit',
    redirectTo: '/'
  },
  {
    path: '**',
    redirectTo: 'overview'
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: []
})
export class ManagePortfoliosModule {
}
