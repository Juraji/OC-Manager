import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {CharacterEditStore} from '../character-edit.store'

@Component({
  selector: 'ocm-character-trait-mgmt',
  templateUrl: './character-trait-mgmt.component.html',
  styleUrls: ['./character-trait-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterTraitMgmtComponent implements OnInit {

  constructor(
    private readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
  }

}
