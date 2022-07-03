import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, Observable} from 'rxjs'

import {strSort} from '#core/arrays'
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

  constructor() {
    super()

    this.setState({
      characters: this.characterEntityAdapter.getInitialState()
    })
  }

  setStoreData(storeData: CharacterOverviewStoreData) {
    this.patchState(s => ({
      characters: this.characterEntityAdapter.setAll(storeData.characters, s.characters)
    }))
  }

  private static createCharacterEntityAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
