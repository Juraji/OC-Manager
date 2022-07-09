import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, Observable, skip, switchMap, tap} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiCharactersService} from '#core/ocm-api'
import {OcmApiExportService} from '#core/ocm-api/services/ocm-api-export.service'
import {PortfoliosStore} from '#core/root-store'
import {OcCharacter} from '#models/characters.model'

export interface CharacterOverviewStoreData {
  characters: OcCharacter[]
}

interface CharacterOverviewStoreState {
  characters: EntityState<OcCharacter>
}

@Injectable()
export class CharacterOverviewStore extends ComponentStore<CharacterOverviewStoreState> {

  private readonly characterEntityAdapter = CharacterOverviewStore.createCharacterEntityAdapter()
  private readonly characterEntitySelectors = this.characterEntityAdapter.getSelectors()

  public readonly allCharacters$: Observable<OcCharacter[]> = this
    .select(s => s.characters)
    .pipe(map(this.characterEntitySelectors.selectAll))

  constructor(
    private readonly portfoliosStore: PortfoliosStore,
    private readonly service: OcmApiCharactersService,
    private readonly exportService: OcmApiExportService,
  ) {
    super()

    this.setState({
      characters: this.characterEntityAdapter.getInitialState()
    })
  }

  readonly setStoreData: (storeData: CharacterOverviewStoreData) => void = this
    .effect<CharacterOverviewStoreData>($ => $.pipe(
      tap(({characters}) => this.patchState(s => ({
        characters: this.characterEntityAdapter.setAll(characters, s.characters)
      }))),
      switchMap(() => this.portfoliosStore.selectedPortfolioId$),
      skip(1), // Skip initial
      mergeMap(() => this.service.getAllCharacters()),
      tap(characters => this.patchState(s => ({
        characters: this.characterEntityAdapter.setAll(characters, s.characters)
      })))
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
