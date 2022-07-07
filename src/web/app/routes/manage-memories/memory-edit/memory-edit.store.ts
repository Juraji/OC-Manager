import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, mergeMap, Observable, tap, withLatestFrom} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiMemoriesService} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'
import {OcMemory} from '#models/memories.model'

interface MemoryEditStoreState {
  memory: Nullable<OcMemory>
  characters: EntityState<OcCharacter>
  availableCharacters: EntityState<OcCharacter>
}

export interface MemoryEditStoreData {
  memory: Nullable<OcMemory>
  characters: OcCharacter[]
  availableCharacters: OcCharacter[]
}

@Injectable()
export class MemoryEditStore extends ComponentStore<MemoryEditStoreState> {

  private readonly characterAdapter = MemoryEditStore.createCharacterAdapter()
  private readonly characterSelectors = this.characterAdapter.getSelectors()

  readonly memoryId$ = this.select(s => s.memory?.id ?? null)
  readonly isNewMemory = this.memoryId$.pipe(map(id => !id))
  readonly memory$ = this.select(s => s.memory).pipe(filterNotNull())
  readonly characters$ = this
    .select(s => s.characters)
    .pipe(map(this.characterSelectors.selectAll))

  readonly availableCharacters: Observable<OcCharacter[]> = this
    .select(s => s.availableCharacters)
    .pipe(map(this.characterSelectors.selectAll))

  readonly filteredAvailableCharacters$ = this.characters$
    .pipe(
      map(cs => cs.map(e => e.id)),
      mergeMap(idsInUse => this.availableCharacters
        .pipe(map(available => available.filter(ac => !idsInUse.includes(ac.id)))))
    )

  constructor(
    private readonly service: OcmApiMemoriesService
  ) {
    super()

    this.setState({
      memory: null,
      characters: this.characterAdapter.getInitialState(),
      availableCharacters: this.characterAdapter.getInitialState(),
    })
  }

  setStoreData: (data: MemoryEditStoreData) => void = this.effect<MemoryEditStoreData>($ => $.pipe(
    tap(data => this.setState(s => ({
      memory: data.memory,
      characters: this.characterAdapter.setAll(data.characters, s.characters),
      availableCharacters: this.characterAdapter.setAll(data.availableCharacters, s.characters),
    })))
  ))

  saveMemory(changes: Partial<OcMemory>): Observable<OcMemory> {
    return this.memoryId$
      .pipe(
        once(),
        mergeMap(id => !!id ? this.memory$ : [{} as OcMemory]),
        once(),
        defaultIfEmpty({} as OcMemory),
        map(memory => ({...memory, ...changes})),
        mergeMap(memory => this.service.saveMemory(memory)),
        tap(memory => this.patchState({memory}))
      )
  }

  deleteMemory() {
    return this.memoryId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.service.deleteMemory(id))
      )
  }

  readonly addCharacter: (characterId: string) => void = this.effect<string>($ => $.pipe(
    withLatestFrom(this.memoryId$.pipe(filterNotNull())),
    mergeMap(([characterId, memoryId]) => this.service.addCharacterToMemory(memoryId, characterId)),
    tap(character => this.patchState(s => ({
      characters: this.characterAdapter.addOne(character, s.characters)
    })))
  ))

  readonly removeCharacter: (characterId: string) => void = this.effect<string>($ => $.pipe(
    withLatestFrom(this.memoryId$.pipe(filterNotNull())),
    mergeMap(([characterId, memoryId]) => this.service
      .removeCharacterFromMemory(memoryId, characterId)
      .pipe(map(() => characterId))),
    tap(characterId => this.patchState(s => ({
      characters: this.characterAdapter.removeOne(characterId, s.characters)
    })))
  ))

  private static createCharacterAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
