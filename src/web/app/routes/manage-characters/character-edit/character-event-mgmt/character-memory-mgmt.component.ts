import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {CharacterEditStore} from '../character-edit.store'

@Component({
  selector: 'ocm-character-memory-mgmt',
  templateUrl: './character-memory-mgmt.component.html',
  styleUrls: ['./character-memory-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterMemoryMgmtComponent implements OnInit {

  constructor(
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
  }

}
