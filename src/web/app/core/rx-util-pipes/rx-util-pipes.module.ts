import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AbsolutePipe} from './absolute.pipe';
import {CountPipe} from './count.pipe';
import {EmptyPipe} from './empty.pipe';
import {KeyValuesPipe} from './key-values.pipe';
import {NotPipe} from './not.pipe';

@NgModule({
  declarations: [
    NotPipe,
    CountPipe,
    EmptyPipe,
    AbsolutePipe,
    KeyValuesPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotPipe,
    CountPipe,
    EmptyPipe,
    AbsolutePipe,
    KeyValuesPipe
  ]
})
export class RxUtilPipesModule {
}
