import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./trait-overview/trait-overview.module').then(m => m.TraitOverviewModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit-trait/edit-trait.module').then(m => m.EditTraitModule)
  },
  {
    path: '**',
    redirectTo: 'overview'
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ]
})
export class ManageTraitsModule {
}
