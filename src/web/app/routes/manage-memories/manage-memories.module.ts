import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

const ROUTES: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./memories-overview/memories-overview.module').then(m => m.MemoriesOverviewModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./memory-edit/memory-edit.module').then(m => m.MemoryEditModule)
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
export class ManageMemoriesModule {
}
