import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {switchMap} from 'rxjs'

import {OcmApiCharactersService} from '#core/ocm-api'
import {filterNotNull, ObservableInputs} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'

@Component({
  selector: 'ocm-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCardComponent implements OnChanges {
  private readonly inputs = new ObservableInputs()

  @Input()
  character: Nullable<OcCharacter | string>
  readonly character$ = this.inputs.observe(() => this.character)
    .pipe(switchMap(c => typeof c === 'string' ? this.charactersService.getCharacterById(c as string) : [c]))

  readonly thumbnailUri$ = this.character$
    .pipe(filterNotNull(), switchMap(c => this.charactersService.getCharacterThumbnailUrl(c.id)))

  constructor(
    private readonly charactersService: OcmApiCharactersService
  ) {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }


}
