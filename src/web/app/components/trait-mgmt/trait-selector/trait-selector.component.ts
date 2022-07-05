import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MODAL_DATA, ModalSizeLg} from '@juraji/ng-bootstrap-modals'

import {OcCharacterTrait} from '#models/traits.model'

import {TraitSelectorStore} from './trait-selector.store'

export interface TraitSelectorData {
  omit: OcCharacterTrait[]
}

@ModalSizeLg()
@Component({
  selector: 'ocm-trait-selector',
  templateUrl: './trait-selector.component.html',
  styleUrls: ['./trait-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TraitSelectorStore]
})
export class TraitSelectorComponent implements OnInit {

  constructor(
    @Inject(MODAL_DATA) private readonly data: TraitSelectorData,
    readonly store: TraitSelectorStore,
  ) {
  }

  ngOnInit(): void {
    const omitIds = this.data.omit.map(t => t.id)
    this.store.loadTraits(omitIds)
  }
}
