import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CharacterEditComponent} from './character-edit.component'
import {CharacterEditResolve} from './character-edit.resolve'

const ROUTES: Routes = [
  {
    path: ':characterId',
    component: CharacterEditComponent,
    resolve: {
      storeData: CharacterEditResolve
    }
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
  ],
  providers: [
    CharacterEditResolve
  ]
})
export class CharacterEditModule {
}
