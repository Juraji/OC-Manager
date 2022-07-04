import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'ocm-character-relationship-mgmt',
  templateUrl: './character-relationship-mgmt.component.html',
  styleUrls: ['./character-relationship-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterRelationshipMgmtComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
