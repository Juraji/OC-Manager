import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {CharacterEditStore} from '../character-edit.store'

@Component({
  selector: 'ocm-character-event-mgmt',
  templateUrl: './character-event-mgmt.component.html',
  styleUrls: ['./character-event-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterEventMgmtComponent implements OnInit {

  constructor(
    readonly store: CharacterEditStore
  ) {
  }

  ngOnInit(): void {
  }

}
