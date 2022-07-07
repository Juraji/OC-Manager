import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'

import {ReadOnlyFieldModule} from '#components/read-only-field'
import {DatePipesModule} from '#core/date-pipes'
import {RxUtilPipesModule} from '#core/rx-util-pipes'

import {MemoryCardComponent} from './memory-card/memory-card.component';
import {MemoryTimelineComponent} from './memory-timeline/memory-timeline.component';
import { MonthAsDatePipe } from './month-as-date.pipe';


@NgModule({
  imports: [
    CommonModule,
    ReadOnlyFieldModule,
    DatePipesModule,
    RouterModule,
    RxUtilPipesModule
  ],
  declarations: [
    MemoryCardComponent,
    MemoryTimelineComponent,
    MonthAsDatePipe
  ],
  exports: [
    MemoryCardComponent,
    MemoryTimelineComponent
  ]
})
export class MemoryMgmtModule {
}
