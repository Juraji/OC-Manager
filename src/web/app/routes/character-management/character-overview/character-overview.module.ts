import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

import {CharacterCardModule} from '../../../components/character-card'

import {CharacterOverviewComponent} from './character-overview.component';
import {CharacterOverviewResolve} from './character-overview.resolve'

const ROUTES: Routes = [
  {
    path: '',
    component: CharacterOverviewComponent,
    resolve: {
      storeData: CharacterOverviewResolve
    }
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    CharacterCardModule
  ],
  declarations: [
    CharacterOverviewComponent
  ],
  providers: [
    CharacterOverviewResolve
  ]
})
export class CharacterOverviewModule {
}
