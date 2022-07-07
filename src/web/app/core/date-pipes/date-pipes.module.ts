import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DateDiffPipe} from './date-diff.pipe';
import {DateIsBeforePipe} from './date-is-before.pipe';
import {RelativeTimePipe} from './relative-time.pipe';
import {YearsAgoPipe} from './years-ago.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateDiffPipe,
    YearsAgoPipe,
    RelativeTimePipe,
    DateIsBeforePipe,
  ],
  exports: [
    YearsAgoPipe,
    DateDiffPipe,
    RelativeTimePipe,
    DateIsBeforePipe,
  ]
})
export class DatePipesModule {
}
