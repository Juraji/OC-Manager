import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DateDiffPipe} from './date-diff.pipe';
import {YearsAgoPipe} from './years-ago.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateDiffPipe,
    YearsAgoPipe
  ],
  exports: [
    YearsAgoPipe,
    DateDiffPipe
  ]
})
export class DatePipesModule {
}
