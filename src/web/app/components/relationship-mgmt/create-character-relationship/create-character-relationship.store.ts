import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, tap} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiCharactersService} from '#core/ocm-api'
import {OcCharacter} from '#models/characters.model'

interface CreateCharacterRelationshipStoreState {
  targetCharacters: EntityState<OcCharacter>
}

@Injectable()
export class CreateCharacterRelationshipStore extends ComponentStore<CreateCharacterRelationshipStoreState> {

  private readonly targetCharactersAdapter = CreateCharacterRelationshipStore.createCharacterEntityAdapter()
  private readonly targetCharactersSelectors = this.targetCharactersAdapter.getSelectors()

  readonly availableTargetCharacters$ = this
    .select(s => s.targetCharacters)
    .pipe(map(this.targetCharactersSelectors.selectAll))

  constructor(
    private readonly charactersService: OcmApiCharactersService
  ) {
    super()

    this.setState({
      targetCharacters: this.targetCharactersAdapter.getInitialState()
    })
  }

  public readonly loadTargetCharacters: (forCharacterId: string) => void = this.effect<string>($ => $.pipe(
    mergeMap(forCharacterId => this.charactersService
      .getAllCharacters()
      .pipe(map(cs => cs.filter(c => c.id !== forCharacterId)))),
    tap(cs => this.setState(s => ({
      targetCharacters: this.targetCharactersAdapter.setAll(cs, s.targetCharacters)
    })))
  ))

  private static createCharacterEntityAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
