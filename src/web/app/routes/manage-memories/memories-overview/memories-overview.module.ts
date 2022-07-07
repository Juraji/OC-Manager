import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MemoryMgmtModule} from '#components/memory-mgmt'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {MemoriesOverviewComponent} from './memories-overview.component';
import {MemoriesOverviewResolve} from './memories-overview.resolve'

const ROUTES: Routes = [
  {
    path: '',
    component: MemoriesOverviewComponent,
    resolve: {
      storeData: MemoriesOverviewResolve
    }
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MemoryMgmtModule,
    RxUtilPipesModule
  ],
  declarations: [
    MemoriesOverviewComponent
  ],
  providers: [
    MemoriesOverviewResolve
  ]
})
export class MemoriesOverviewModule {
}
