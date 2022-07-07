import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {BooleanInput} from '#core/ng-extensions'
import {SettingsStore} from '#core/root-store'
import {OcMemory} from '#models/memories.model'

@Component({
  selector: 'ocm-memory-card',
  templateUrl: './memory-card.component.html',
  styleUrls: ['./memory-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryCardComponent implements OnInit {

  @Input()
  memory: Nullable<OcMemory>

  @Input()
  @BooleanInput()
  flat: boolean | string = false

  constructor(
    readonly settings: SettingsStore
  ) {
  }

  ngOnInit(): void {
  }

}
