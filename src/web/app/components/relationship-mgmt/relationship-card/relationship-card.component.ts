import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {BooleanInput} from '#core/ng-extensions'
import {OcCharacterRelationship} from '#models/characters.model'

@Component({
  selector: 'ocm-relationship-card',
  templateUrl: './relationship-card.component.html',
  styleUrls: ['./relationship-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationshipCardComponent implements OnInit {

  @Input()
  relationship: Nullable<OcCharacterRelationship>

  @Input()
  @BooleanInput()
  flat: boolean | string = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
