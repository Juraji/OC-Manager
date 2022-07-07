import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'

import {CharacterMgmtModule} from '#components/character-mgmt'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

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
        CharacterMgmtModule,
        RxUtilPipesModule
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
