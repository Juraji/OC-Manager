import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ModalsModule} from '@juraji/ng-bootstrap-modals'
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap'

import {TraitCardComponent} from './trait-card/trait-card.component'
import { TraitLabelPipe } from './trait-label.pipe'
import {TraitSelectorComponent} from './trait-selector/trait-selector.component';


@NgModule({
  imports: [
    CommonModule,
    ModalsModule,
    NgbNavModule,
  ],
  declarations: [
    TraitCardComponent,
    TraitSelectorComponent,
    TraitLabelPipe
  ],
  exports: [
    ModalsModule,
    TraitCardComponent,
    TraitSelectorComponent,
    TraitLabelPipe
  ]
})
export class TraitMgmtModule {
}
