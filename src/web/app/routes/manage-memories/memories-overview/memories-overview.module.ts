import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MemoryMgmtModule} from '#components/memory-mgmt'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {MemoriesOverviewComponent} from './memories-overview.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MemoriesOverviewComponent,
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
})
export class MemoriesOverviewModule {
}
