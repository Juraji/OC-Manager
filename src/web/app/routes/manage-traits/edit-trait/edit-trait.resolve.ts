import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, Observable, of} from 'rxjs'

import {OcmApiCharacterTraitsService} from '#core/ocm-api'
import {OcCharacterTrait} from '#models/traits.model'

@Injectable()
export class EditTraitResolve implements Resolve<OcCharacterTrait | null> {

  constructor(
    private readonly service: OcmApiCharacterTraitsService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<OcCharacterTrait | null> {
    const traitId = route.paramMap.get('traitId')

    if (!traitId) {
      return EMPTY
    } else if (traitId === 'new') {
      return of(null)
    } else {
      return this.service.getTraitById(traitId);
    }
  }
}
