import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import { ReadOnlyFieldComponent } from './read-only-field/read-only-field.component';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ReadOnlyFieldComponent
  ],
  declarations: [
    ReadOnlyFieldComponent
  ]
})
export class ReadOnlyFieldModule {
}
