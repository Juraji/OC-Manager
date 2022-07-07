import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, mergeMap, Observable, tap} from 'rxjs'

import {strSort} from '#core/arrays'
import {OcmApiMemoriesService} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'
import {OcMemory} from '#models/memories.model'

interface MemoryEditStoreState {
  memory: Nullable<OcMemory>
  characters: EntityState<OcCharacter>
}

export interface MemoryEditStoreData {
  memory: Nullable<OcMemory>
  characters: OcCharacter[]
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

  constructor(
    private readonly service: OcmApiMemoriesService
  ) {
    super()

    this.setState({
      memory: null,
      characters: this.characterAdapter.getInitialState()
    })
  }

  setStoreData: (data: MemoryEditStoreData) => void = this.effect<MemoryEditStoreData>($ => $.pipe(
    tap(data => this.setState(s => ({
      memory: data.memory,
      characters: this.characterAdapter.setAll(data.characters, s.characters)
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

  private static createCharacterAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }
}
