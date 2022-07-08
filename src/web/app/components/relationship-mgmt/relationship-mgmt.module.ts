import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'
import {ModalsModule} from '@juraji/ng-bootstrap-modals'

import {CharacterMgmtModule} from '#components/character-mgmt'
import {ReadOnlyFieldModule} from '#components/read-only-field'

import {
  CreateCharacterRelationshipComponent
} from './create-character-relationship/create-character-relationship.component';
import {RelationshipCardComponent} from './relationship-card/relationship-card.component';


@NgModule({
  imports: [
    CommonModule,
    ModalsModule,
    ReactiveFormsModule,
    CharacterMgmtModule,
    ReadOnlyFieldModule
  ],
  declarations: [
    CreateCharacterRelationshipComponent,
    RelationshipCardComponent
  ],
  exports: [
    ModalsModule,
    CreateCharacterRelationshipComponent,
    RelationshipCardComponent,
  ]
})
export class RelationshipMgmtModule {
}
