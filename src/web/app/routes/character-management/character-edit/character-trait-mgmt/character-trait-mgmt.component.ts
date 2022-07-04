import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Modals} from '@juraji/ng-bootstrap-modals'
import {mergeMap} from 'rxjs'

import {TraitSelectorComponent} from '#components/trait-selector/trait-selector/trait-selector.component'
import {once} from '#core/rxjs'
import {OcCharacterTrait} from '#models/traits.model'

import {CharacterEditStore} from '../character-edit.store'

@Component({
  selector: 'ocm-character-trait-mgmt',
  templateUrl: './character-trait-mgmt.component.html',
  styleUrls: ['./character-trait-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterTraitMgmtComponent implements OnInit {

  constructor(
    private readonly modals: Modals,
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
  }

  onAddTrait() {
    this.store.allTraits$
      .pipe(
        once(),
        mergeMap(omit => this.modals
          .open<OcCharacterTrait>(TraitSelectorComponent, {data: {omit}})
          .onResolved),
        mergeMap(trait => this.store.addTrait(trait.id))
      )
      .subscribe()
  }

  onRemoveTrait(trait: OcCharacterTrait) {
    this.store
      .removeTrait(trait.id)
      .subscribe()
  }
}
