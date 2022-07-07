import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router'
import {map, startWith, switchMap} from 'rxjs'

import {BooleanInput} from '#core/ng-extensions'
import {OcmApiCharactersService} from '#core/ocm-api'
import {filterNotEmpty, filterNotNull, ObservableInputs, once} from '#core/rxjs'
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
  readonly characterId$ = this.inputs.observe(() => this.character)
    .pipe(map(c => typeof c === 'string' ? c : c?.id))
  readonly character$ = this.inputs.observe(() => this.character)
    .pipe(switchMap(c => typeof c === 'string' ? this.charactersService.getCharacterById(c as string) : [c]))
  readonly thumbnailUri$ = this.characterId$
    .pipe(
      filterNotNull(),
      filterNotEmpty(),
      switchMap(id => this.charactersService.getCharacterThumbnailUrl(id)),
      startWith('assets/no-image-placeholder.svg')
    )

  @Input()
  @BooleanInput()
  flat: boolean | string = false

  @Input()
  @BooleanInput()
  hideName: boolean | string = false

  @Input()
  @BooleanInput()
  disabled: boolean | string = false

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
    console.log(this.disabled)
    if (!this.disabled) {
      this.characterId$
        .pipe(once(), filterNotNull())
        .subscribe(id => this.router.navigate(['/characters/edit', id]))
    }
  }


}
