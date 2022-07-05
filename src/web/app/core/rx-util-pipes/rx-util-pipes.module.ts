import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {CountPipe} from './count.pipe';
import {EmptyPipe} from './empty.pipe';
import {NotPipe} from './not.pipe';

@NgModule({
  declarations: [
    NotPipe,
    CountPipe,
    EmptyPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotPipe,
    CountPipe,
    EmptyPipe
  ]
})
export class RxUtilPipesModule {
}
