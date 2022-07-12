import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, tap} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiCharactersService} from '#core/ocm-api'
import {OcmApiExportService} from '#core/ocm-api/services/ocm-api-export.service'
import {OcCharacter} from '#models/characters.model'

interface CharacterOverviewStoreState {
  characters: EntityState<OcCharacter>
}

@Injectable()
export class CharacterOverviewStore extends ComponentStore<CharacterOverviewStoreState> {

  private readonly characterAdapter = CharacterOverviewStore.createCharacterEntityAdapter()
  private readonly characterEntitySelectors = this.characterAdapter.getSelectors()

  public readonly allCharacters$: Observable<OcCharacter[]> = this
    .select(s => s.characters)
    .pipe(map(this.characterEntitySelectors.selectAll))

  constructor(
    private readonly service: OcmApiCharactersService,
    private readonly exportService: OcmApiExportService,
  ) {
    super()

    this.setState({
      characters: this.characterAdapter.getInitialState()
    })
  }

  readonly loadCharacters: () => void = this.effect($ => $.pipe(
    tap(() => this.patchState(s => ({characters: this.characterAdapter.removeAll(s.characters)}))),
    mergeMap(() => this.service.getAllCharacters()),
    tap(characters => this.patchState(s => ({
      characters: this.characterAdapter.addOne(characters, s.characters)
    }))),
  ))

  readonly exportCharacters: () => void = this.effect<void>($ => $.pipe(
    mergeMap(() => this.exportService.exportCharacters())
  ))

  private static createCharacterEntityAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
