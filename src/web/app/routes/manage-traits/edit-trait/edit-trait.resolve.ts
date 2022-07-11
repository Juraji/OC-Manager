import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, forkJoin, Observable, toArray} from 'rxjs'

import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {ForkJoinSource} from '#core/rxjs'

import {EditTraitStoreData} from './edit-trait.store'

@Injectable()
export class EditTraitResolve implements Resolve<EditTraitStoreData> {

  constructor(
    private readonly service: OcmApiCharacterTraitsService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<EditTraitStoreData> {
    const traitId = route.paramMap.get('traitId')

    if (!traitId) {
      return EMPTY
    } else if (traitId === 'new') {
      const sources: ForkJoinSource<EditTraitStoreData> = {
        trait: [null],
        characters: [[]]
      }

      return forkJoin(sources);
    } else {
      const sources: ForkJoinSource<EditTraitStoreData> = {
        trait: this.service.getTraitById(traitId),
        characters: this.service.getAllCharactersWithTrait(traitId).pipe(toArray())
      }

      return forkJoin(sources);
    }
  }
}
