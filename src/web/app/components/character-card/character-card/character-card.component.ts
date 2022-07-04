import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router'
import {switchMap} from 'rxjs'

import {BooleanInput} from '#core/ng-extensions'
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

  @Input()
  @BooleanInput()
  flat: boolean | string = false

  @Input()
  @BooleanInput()
  disabled: boolean | string = false

  readonly thumbnailUri$ = this.character$
    .pipe(filterNotNull(), switchMap(c => this.charactersService.getCharacterThumbnailUrl(c.id)))

  constructor(
    private readonly router: Router,
    private readonly charactersService: OcmApiCharactersService
  ) {
  }

  ngOnChanges() {
    this.inputs.onChanges()
  }

  @HostListener('click')
  onClick() {
    if(!this.disabled) {
      const targetId = typeof this.character === 'string' ? this.character : this.character?.id
      this.router.navigate(['/characters/edit', targetId])
    }
  }


}
