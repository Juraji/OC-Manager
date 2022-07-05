import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocm-character-event-mgmt',
  templateUrl: './character-event-mgmt.component.html',
  styleUrls: ['./character-event-mgmt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterEventMgmtComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
