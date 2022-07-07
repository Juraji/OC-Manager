import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {OcCharacter} from '#models/characters.model'

import {MemoryEditStore} from '../memory-edit.store'

@Component({
  selector: 'ocm-memory-edit-characters',
  templateUrl: './memory-edit-characters.component.html',
  styleUrls: ['./memory-edit-characters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryEditCharactersComponent implements OnInit {

  constructor(
    readonly store: MemoryEditStore
  ) {
  }

  ngOnInit(): void {
  }

  onAddCharacter(c: OcCharacter) {
    this.store.addCharacter(c.id)
  }

  onRemoveCharacter(c: OcCharacter) {
    this.store.removeCharacter(c.id)
  }
}
