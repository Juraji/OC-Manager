import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {DragDropFileDirective} from './drag-drop-file.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DragDropFileDirective
  ],
  exports: [
    DragDropFileDirective
  ]
})
export class DragDropFileModule {
}
