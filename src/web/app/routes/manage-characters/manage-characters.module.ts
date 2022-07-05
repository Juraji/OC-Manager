import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

const ROUTES: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./character-overview/character-overview.module').then(m => m.CharacterOverviewModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./character-edit/character-edit.module').then(m => m.CharacterEditModule)
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
export class ManageCharactersModule {
}
