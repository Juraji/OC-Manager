import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

import {CharacterMgmtModule} from '#components/character-mgmt'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {CharacterOverviewComponent} from './character-overview.component';

const ROUTES: Routes = [
  {
    path: '',
    component: CharacterOverviewComponent,
  }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        CharacterMgmtModule,
        RxUtilPipesModule
    ],
  declarations: [
    CharacterOverviewComponent
  ],
})
export class CharacterOverviewModule {
}
