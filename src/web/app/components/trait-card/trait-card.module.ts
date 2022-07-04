import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import { TraitCardComponent } from './trait-card/trait-card.component';


@NgModule({
  declarations: [
    TraitCardComponent
  ],
  exports: [
    TraitCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TraitCardModule {
}
