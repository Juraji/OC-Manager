import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, Resolve} from '@angular/router'
import {EMPTY, Observable, of} from 'rxjs'

import {OcmApiCharactersService} from '#core/ocm-api'
import {OcCharacter} from '#models/characters.model'

@Injectable()
export class CharacterEditResolve implements Resolve<OcCharacter | null> {

  constructor(
    private readonly charactersService: OcmApiCharactersService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<OcCharacter | null> {
    const characterId = route.paramMap.get('characterId')

    if (!characterId) {
      return EMPTY
    } else if (characterId === 'new') {
      return of(null)
    } else {
      return this.charactersService.getCharacterById(characterId)
    }
  }
}
