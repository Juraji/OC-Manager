import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'
import {mergeMap} from 'rxjs'

import {CreateCharacterRelationshipComponent} from '#components/relationship-mgmt'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacterRelationship} from '#models/characters.model'

import {CharacterEditStore} from '../character-edit.store'

@Component({
  selector: 'ocm-character-relationship-mgmt',
  templateUrl: './character-relationship-mgmt.component.html',
  styleUrls: ['./character-relationship-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterRelationshipMgmtComponent implements OnInit {

  constructor(
    private readonly modals: Modals,
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
  }

  onAddRelationship() {
    this.store.characterId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(forCharacterId => this.modals
          .open<OcCharacterRelationship>(CreateCharacterRelationshipComponent, {data: {forCharacterId}})
          .onResolved),
        mergeMap(rel => this.store.addCharacterRelationship(rel))
      )
      .subscribe()

  }

  onRemoveRelationship(rel: OcCharacterRelationship) {
    this.store
      .removeCharacterRelationship(rel.id)
      .subscribe()
  }
}
