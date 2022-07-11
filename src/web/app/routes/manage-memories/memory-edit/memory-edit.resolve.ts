import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, forkJoin, Observable, toArray} from 'rxjs'

import {OcmApiCharactersService, OcmApiImagesService, OcmApiMemoriesService} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {MemoryEditStoreData} from './memory-edit.store'

@Injectable()
export class MemoryEditResolve implements Resolve<MemoryEditStoreData> {

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly imagesService: OcmApiImagesService,
    private readonly memoriesService: OcmApiMemoriesService,
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
        availableCharacters: [[]],
        images: [[]]
      }

      return forkJoin(sources)
    } else {
      const sources: ForkJoinSource<MemoryEditStoreData> = {
        memory: this.memoriesService.getMemoryById(memoryId),
        characters: this.memoriesService.getMemoryCharacters(memoryId).pipe(toArray()),
        availableCharacters: this.charactersService.getAllCharacters().pipe(toArray()),
        images: this.imagesService.getImagesByLinkedNodeId(memoryId).pipe(toArray())
      }

      return forkJoin(sources)
    }
  }
}
