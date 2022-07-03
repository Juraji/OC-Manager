import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ocm-character-edit',
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterEditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
