import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {EditTraitStore} from '../edit-trait.store'

@Component({
  selector: 'ocm-edit-trait-characters',
  templateUrl: './edit-trait-characters.component.html',
  styleUrls: ['./edit-trait-characters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTraitCharactersComponent implements OnInit {

  constructor(
    readonly store: EditTraitStore
  ) {
  }

  ngOnInit(): void {
  }

}
