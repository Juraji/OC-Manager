import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CharacterEditComponent} from './character-edit.component'

const ROUTES: Routes = [
  {
    path: ':characterId',
    component: CharacterEditComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    CharacterEditComponent
  ]
})
export class CharacterEditModule {
}
