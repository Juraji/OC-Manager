import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, forkJoin, Observable} from 'rxjs'

import {OcmApiCharactersService, OcmApiMemoriesService} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {MemoryEditStoreData} from './memory-edit.store'

@Injectable()
export class MemoryEditResolve implements Resolve<MemoryEditStoreData> {

  constructor(
    private readonly charactersService:OcmApiCharactersService,
    private readonly service: OcmApiMemoriesService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<MemoryEditStoreData> {
    const memoryId = route.paramMap.get('memoryId')

    if (!memoryId) {
      return EMPTY
    } else if (memoryId === 'new') {
      const sources: ForkJoinSource<MemoryEditStoreData> = {
        memory: [null],
        characters: [[]],
        availableCharacters: [[]]
      }

      return forkJoin(sources)
    } else {
      const sources: ForkJoinSource<MemoryEditStoreData> = {
        memory: this.service.getMemoryById(memoryId),
        characters: this.service.getMemoryCharacters(memoryId),
        availableCharacters: this.charactersService.getAllCharacters(),
      }

      return forkJoin(sources)
    }
  }
}
