import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import { NotPipe } from './not.pipe';

@NgModule({
  declarations: [
    NotPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotPipe
  ]
})
export class RxUtilPipesModule {
}
