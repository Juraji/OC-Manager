import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {forkJoin, Observable} from 'rxjs'

import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {TraitOverviewStoreData} from './trait-overview.store'

@Injectable()
export class TraitOverviewResolve implements Resolve<TraitOverviewStoreData> {

  constructor(
    private readonly traitsService: OcmApiCharacterTraitsService
  ) {
  }

  resolve(): Observable<TraitOverviewStoreData> {
    const sources: ForkJoinSource<TraitOverviewStoreData> = {
      traits: this.traitsService.getAllTraits()
    }

    return forkJoin(sources);
  }
}
