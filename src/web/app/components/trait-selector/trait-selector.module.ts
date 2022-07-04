import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ModalsModule} from '@juraji/ng-bootstrap-modals'
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap'

import {TraitCardModule} from '#components/trait-card'

import {TraitSelectorComponent} from './trait-selector/trait-selector.component';


@NgModule({
  declarations: [
    TraitSelectorComponent
  ],
  imports: [
    CommonModule,
    ModalsModule,
    NgbNavModule,
    TraitCardModule
  ],
  exports: [
    ModalsModule,
    TraitSelectorComponent
  ]
})
export class TraitSelectorModule {
}
