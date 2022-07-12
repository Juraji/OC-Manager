import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {map, mergeMap, tap} from 'rxjs'

import {numberSort} from '#core/arrays'
import {OcmApiMemoriesService} from '#core/ocm-api'
import {OcMemory} from '#models/memories.model'

interface MemoriesOverviewStoreState {
  memories: EntityState<OcMemory>
}

@Injectable()
export class MemoriesOverviewStore extends ComponentStore<MemoriesOverviewStoreState> {

  private readonly memoriesAdapter = MemoriesOverviewStore.createMemoriesAdapter()
  private readonly memoriesSelectors = this.memoriesAdapter.getSelectors()

  readonly allMemories$ = this
    .select(s => s.memories)
    .pipe(map(this.memoriesSelectors.selectAll))

  constructor(
    private readonly service: OcmApiMemoriesService,
  ) {
    super()

    this.setState({
      memories: this.memoriesAdapter.getInitialState()
    })
  }

  readonly loadMemories: () => void = this.effect<void>($ => $.pipe(
    tap(() => this.patchState(s => ({
      memories: this.memoriesAdapter.removeAll(s.memories)
    }))),
    mergeMap(() => this.service.getAllMemories()),
    tap(memory => this.patchState(s => ({
      memories: this.memoriesAdapter.addOne(memory, s.memories)
    })))
  ))

  private static createMemoriesAdapter() {
    return createEntityAdapter<OcMemory>({
      selectId: e => e.id,
      sortComparer: numberSort(e => e.date, true)
    })
  }
}
