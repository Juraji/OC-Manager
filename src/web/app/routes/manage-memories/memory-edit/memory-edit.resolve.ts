import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, Observable, of} from 'rxjs'

import {OcmApiCharactersService, OcmApiImagesService, OcmApiMemoriesService} from '#core/ocm-api'
import {OcMemory} from '#models/memories.model'

@Injectable()
export class MemoryEditResolve implements Resolve<OcMemory | null> {

  constructor(
    private readonly charactersService: OcmApiCharactersService,
    private readonly imagesService: OcmApiImagesService,
    private readonly memoriesService: OcmApiMemoriesService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<OcMemory | null> {
    const memoryId = route.paramMap.get('memoryId')

    if (!memoryId) {
      return EMPTY
    } else if (memoryId === 'new') {
      return of(null)
    } else {
      return this.memoriesService.getMemoryById(memoryId)
    }
  }
}
