import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {forkJoin, Observable} from 'rxjs'

import {OcmApiMemoriesService} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {MemoriesOverviewStoreData} from './memories-overview.store'

@Injectable()
export class MemoriesOverviewResolve implements Resolve<MemoriesOverviewStoreData> {

  constructor(private readonly service: OcmApiMemoriesService) {
  }

  resolve(): Observable<MemoriesOverviewStoreData> {
    const sources: ForkJoinSource<MemoriesOverviewStoreData> = {
      memories: this.service.getAllMemories()
    }

    return forkJoin(sources)
  }

}
